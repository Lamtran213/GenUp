"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  AVATAR_SHOP_ITEMS,
  DAILY_MISSIONS,
  INITIAL_MODULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_PARENT_INBOX,
  INITIAL_SCENARIOS,
} from "@/lib/seed-data";
import {
  InAppNotification,
  LearningModule,
  LessonProgressEntry,
  ParentInboxMessage,
  ParentSettingsState,
  ScenarioAttemptEntry,
  ScenarioItem,
  StudentProfileState,
  TopicCategory,
} from "@/lib/types";

const STORAGE_KEY = "genup_state_v1";
const FREE_LIMIT_SECONDS = 900; // 15 phút/ngày (US-30)
const IDLE_THRESHOLD_MS = 60_000; // Tạm dừng sau 60 giây không tương tác (US-31)

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_PROFILE: StudentProfileState = {
  id: "stu-demo-01",
  nickname: "Minh Anh",
  grade: 7,
  interestedTopics: ["Puberty", "Boundaries", "CyberSafety"],
  avatarGender: "Female",
  equippedHairId: "hair-bob",
  equippedOutfitId: "outfit-uniform",
  equippedAccessoryId: "acc-none",
  ownedItemIds: ["hair-bob", "outfit-uniform", "acc-none", "acc-glasses"],
  unlockedBadgeIds: ["badge-first-lesson", "badge-streak-3"],
  totalXp: 110,
  rewardPoints: 95,
  currentStreak: 3,
  longestStreak: 5,
  activeDates: ["2026-11-04", "2026-11-05", getTodayKey()],
  claimedStreakMilestones: [3],
  isOnboarded: true,
};

const DEFAULT_PARENT_SETTINGS: ParentSettingsState = {
  parentLinked: true,
  parentSummaryEnabled: true,
  parentPin: "1234",
  notifyProgressReport: true,
  notifyStudyReminder: true,
  notifyNewContent: true,
  notifyPremiumOffer: false,
  reportFrequencyDays: 7,
  planType: "Free",
};

interface PersistedState {
  profile: StudentProfileState;
  lessonProgress: Record<string, LessonProgressEntry>;
  scenarioAttempts: Record<string, ScenarioAttemptEntry>;
  dailyMissionsClaimed: Record<string, string[]>; // dateKey -> missionIds
  dailySecondsUsed: Record<string, number>; // dateKey -> seconds
  parentSettings: ParentSettingsState;
  parentInbox: ParentInboxMessage[];
  notifications: InAppNotification[];
}

interface GenUpContextValue {
  profile: StudentProfileState;
  modules: LearningModule[];
  scenarios: ScenarioItem[];
  lessonProgress: Record<string, LessonProgressEntry>;
  scenarioAttempts: Record<string, ScenarioAttemptEntry>;
  parentSettings: ParentSettingsState;
  parentInbox: ParentInboxMessage[];
  notifications: InAppNotification[];
  completedMissionIdsToday: string[];
  remainingFreeSeconds: number;
  usedFreeSecondsToday: number;
  isTimerRunning: boolean;
  isFreeLimitReached: boolean;
  updateProfile: (patch: Partial<StudentProfileState>) => boolean;
  resetForNewOnboarding: (data: {
    nickname: string;
    grade: 6 | 7 | 8 | 9;
    interestedTopics: TopicCategory[];
    avatarGender: "Male" | "Female";
    equippedHairId?: string;
  }) => boolean;
  saveLessonStep: (moduleId: string, stepIndex: number) => void;
  submitScenarioChoice: (
    scenarioId: string,
    optionId: string,
    linkedModuleId?: string
  ) => { xpEarned: number; pointsEarned: number; isRecommended: boolean };
  completeLesson: (moduleId: string) => { ok: boolean; xpEarned: number; reason?: string };
  reviewCompletedLesson: (moduleId: string) => { ok: boolean; message: string };
  purchaseAvatarItem: (itemId: string) => { ok: boolean; message: string };
  equipAvatarItem: (itemId: string) => { ok: boolean; message: string };
  updateParentSettings: (patch: Partial<ParentSettingsState>) => void;
  generateSampleEmail: (
    category: ParentInboxMessage["category"]
  ) => Promise<{ ok: boolean; message: string }>;
  markInboxRead: (id: string) => void;
  deleteInboxMessage: (id: string) => void;
  markNotificationRead: (id?: string, markAll?: boolean) => void;
  getRecommendedNextModule: (excludeModuleId?: string) => LearningModule | null;
}

const GenUpContext = createContext<GenUpContextValue | null>(null);

export function GenUpProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<StudentProfileState>(DEFAULT_PROFILE);
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgressEntry>>({
    "mod-puberty-01": {
      moduleId: "mod-puberty-01",
      currentStepIndex: 2,
      maxStepReached: 2,
      status: "Completed",
      selectedOptionId: "opt-pub-1a",
      firstCompletionXpGranted: true,
      completedAt: "2026-11-05T10:00:00.000Z",
    },
    "mod-boundaries-01": {
      moduleId: "mod-boundaries-01",
      currentStepIndex: 1,
      maxStepReached: 1,
      status: "InProgress",
      firstCompletionXpGranted: false,
    },
  });
  const [scenarioAttempts, setScenarioAttempts] = useState<Record<string, ScenarioAttemptEntry>>({
    "scen-puberty-01": {
      scenarioId: "scen-puberty-01",
      selectedOptionId: "opt-pub-1a",
      passedFirstTime: true,
      xpGranted: true,
      attemptedAt: "2026-11-05T09:58:00.000Z",
    },
  });
  const [dailyMissionsClaimed, setDailyMissionsClaimed] = useState<Record<string, string[]>>({
    [getTodayKey()]: ["lesson"],
  });
  const [dailySecondsUsed, setDailySecondsUsed] = useState<Record<string, number>>({
    [getTodayKey()]: 180,
  });
  const [parentSettings, setParentSettings] =
    useState<ParentSettingsState>(DEFAULT_PARENT_SETTINGS);
  const [parentInbox, setParentInbox] = useState<ParentInboxMessage[]>(INITIAL_PARENT_INBOX);
  const [notifications, setNotifications] =
    useState<InAppNotification[]>(INITIAL_NOTIFICATIONS);

  const lastInteractionRef = useRef<number>(Date.now());
  const [isTabActive, setIsTabActive] = useState(true);
  const [isUserActive, setIsUserActive] = useState(true);

  // Nạp dữ liệu từ LocalStorage + đồng bộ MongoDB/Supabase
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (parsed.profile && typeof parsed.profile.nickname === "string" && parsed.profile.nickname.trim()) {
          setProfile(parsed.profile);
        }
        if (parsed.lessonProgress && typeof parsed.lessonProgress === "object") {
          setLessonProgress(parsed.lessonProgress);
        }
        if (parsed.scenarioAttempts && typeof parsed.scenarioAttempts === "object") {
          setScenarioAttempts(parsed.scenarioAttempts);
        }
        if (parsed.dailyMissionsClaimed && typeof parsed.dailyMissionsClaimed === "object") {
          setDailyMissionsClaimed(parsed.dailyMissionsClaimed);
        }
        if (parsed.dailySecondsUsed && typeof parsed.dailySecondsUsed === "object") {
          setDailySecondsUsed(parsed.dailySecondsUsed);
        }
        if (parsed.parentSettings && typeof parsed.parentSettings === "object") {
          setParentSettings({ ...DEFAULT_PARENT_SETTINGS, ...parsed.parentSettings });
        }
        if (Array.isArray(parsed.parentInbox)) {
          setParentInbox(parsed.parentInbox);
        }
        if (Array.isArray(parsed.notifications)) {
          setNotifications(parsed.notifications);
        }
      }
    } catch {
      // NFR-P04 & US-20 AC3: Chuẩn hóa về mặc định hợp lệ khi LocalStorage lỗi
    } finally {
      setHydrated(true);
    }
  }, []);

  // Tự động lưu vào LocalStorage khi state thay đổi
  useEffect(() => {
    if (!hydrated) return;
    const stateToSave: PersistedState = {
      profile,
      lessonProgress,
      scenarioAttempts,
      dailyMissionsClaimed,
      dailySecondsUsed,
      parentSettings,
      parentInbox,
      notifications,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Bỏ qua nếu trình duyệt chặn quota
    }
  }, [
    hydrated,
    profile,
    lessonProgress,
    scenarioAttempts,
    dailyMissionsClaimed,
    dailySecondsUsed,
    parentSettings,
    parentInbox,
    notifications,
  ]);

  // Theo dõi tương tác và sự kiện ẩn tab / mất focus cho Bộ đếm 15 phút (US-30, US-31)
  useEffect(() => {
    const markInteraction = () => {
      lastInteractionRef.current = Date.now();
      setIsUserActive(true);
    };

    const handleVisibility = () => {
      setIsTabActive(document.visibilityState === "visible" && document.hasFocus());
    };

    window.addEventListener("pointerdown", markInteraction, { passive: true });
    window.addEventListener("keydown", markInteraction, { passive: true });
    window.addEventListener("scroll", markInteraction, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    window.addEventListener("blur", handleVisibility);

    return () => {
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
      window.removeEventListener("scroll", markInteraction);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
      window.removeEventListener("blur", handleVisibility);
    };
  }, []);

  // US-31 AC4: Chỉ đếm giờ khi đang ở màn hình học tập tương tác (/lessons/[id] hoặc /scenarios)
  const isLearningRoute = useMemo(() => {
    if (!pathname) return false;
    const isLessonDetail =
      pathname.startsWith("/lessons/") && !pathname.endsWith("/complete");
    const isScenarioPage = pathname.startsWith("/scenarios");
    return isLessonDetail || isScenarioPage;
  }, [pathname]);

  const todayKey = getTodayKey();
  const usedFreeSecondsToday = dailySecondsUsed[todayKey] ?? 0;
  const isPremium = parentSettings.planType !== "Free";
  const remainingFreeSeconds = isPremium
    ? FREE_LIMIT_SECONDS
    : Math.max(0, FREE_LIMIT_SECONDS - usedFreeSecondsToday);
  const isFreeLimitReached = !isPremium && remainingFreeSeconds <= 0;
  const isTimerRunning =
    hydrated &&
    !isPremium &&
    isLearningRoute &&
    isTabActive &&
    isUserActive &&
    remainingFreeSeconds > 0;

  useEffect(() => {
    if (!hydrated || isPremium || !isLearningRoute) return;

    const interval = setInterval(() => {
      const idleMs = Date.now() - lastInteractionRef.current;
      if (idleMs > IDLE_THRESHOLD_MS) {
        setIsUserActive(false);
        return;
      }
      if (document.visibilityState !== "visible" || !document.hasFocus()) {
        setIsTabActive(false);
        return;
      }

      setDailySecondsUsed((prev) => {
        const current = prev[todayKey] ?? 0;
        if (current >= FREE_LIMIT_SECONDS) return prev;
        const nextVal = current + 1;

        // Gửi heartbeat lên MongoDB mỗi 15 giây
        if (nextVal % 15 === 0) {
          fetch("/api/timer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dateKey: todayKey, activeSecondsUsed: nextVal }),
          }).catch(() => null);
        }

        return { ...prev, [todayKey]: nextVal };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hydrated, isPremium, isLearningRoute, todayKey]);

  // Hàm ghi nhận hoạt động học hợp lệ trong ngày, tính Streak & Nhiệm vụ ngày (US-24, US-25, US-26, US-27)
  const recordStudyActivityAndMission = useCallback(
    (missionType: "lesson" | "scenario" | "review", extraXp: number, extraPoints: number) => {
      const today = getTodayKey();
      const claimedToday = dailyMissionsClaimed[today] ?? [];
      let missionBonusXp = 0;
      let missionBonusPoints = 0;

      if (!claimedToday.includes(missionType)) {
        const missionDef = DAILY_MISSIONS.find((m) => m.id === missionType);
        if (missionDef) {
          missionBonusXp = missionDef.xpReward;
          missionBonusPoints = missionDef.rewardPoints;
        }
        setDailyMissionsClaimed((prev) => ({
          ...prev,
          [today]: [...(prev[today] ?? []), missionType],
        }));
      }

      setProfile((prev) => {
        const nextDates = prev.activeDates.includes(today)
          ? prev.activeDates
          : [...prev.activeDates, today].sort();

        // Tính chuỗi ngày liên tiếp gần nhất (US-25 AC4)
        let streak = 1;
        for (let i = nextDates.length - 1; i > 0; i--) {
          const curr = new Date(nextDates[i]);
          const prevDate = new Date(nextDates[i - 1]);
          const diffDays = Math.round(
            (curr.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays === 1) {
            streak += 1;
          } else if (diffDays > 1) {
            break;
          }
        }

        const longest = Math.max(prev.longestStreak, streak);

        // Kiểm tra mốc thưởng Streak 3, 7, 14 ngày (US-26: chỉ thưởng 1 lần mỗi mốc)
        let milestoneBonusPoints = 0;
        const nextMilestones = [...prev.claimedStreakMilestones];
        for (const m of [3, 7, 14]) {
          if (streak >= m && !nextMilestones.includes(m)) {
            nextMilestones.push(m);
            milestoneBonusPoints += m * 10;
          }
        }

        const nextXp = prev.totalXp + extraXp + missionBonusXp;
        const nextPoints =
          prev.rewardPoints + extraPoints + missionBonusPoints + milestoneBonusPoints;

        const nextBadges = [...prev.unlockedBadgeIds];
        if (streak >= 3 && !nextBadges.includes("badge-streak-3")) {
          nextBadges.push("badge-streak-3");
        }
        if (nextXp >= 150 && !nextBadges.includes("badge-xp-master")) {
          nextBadges.push("badge-xp-master");
        }

        return {
          ...prev,
          totalXp: nextXp,
          rewardPoints: nextPoints,
          currentStreak: streak,
          longestStreak: longest,
          activeDates: nextDates,
          claimedStreakMilestones: nextMilestones,
          unlockedBadgeIds: nextBadges,
        };
      });
    },
    [dailyMissionsClaimed]
  );

  const updateProfile = useCallback((patch: Partial<StudentProfileState>): boolean => {
    if (patch.nickname !== undefined && patch.nickname.trim().length === 0) {
      // US-01 AC3 & US-04 AC3: Không chấp nhận biệt danh rỗng hoặc toàn khoảng trắng
      return false;
    }
    setProfile((prev) => ({
      ...prev,
      ...patch,
      nickname: patch.nickname !== undefined ? patch.nickname.trim() : prev.nickname,
    }));
    return true;
  }, []);

  const resetForNewOnboarding = useCallback(
    (data: {
      nickname: string;
      grade: 6 | 7 | 8 | 9;
      interestedTopics: TopicCategory[];
      avatarGender: "Male" | "Female";
      equippedHairId?: string;
    }): boolean => {
      const cleanName = data.nickname.trim();
      if (!cleanName) return false;

      setProfile({
        ...DEFAULT_PROFILE,
        nickname: cleanName,
        grade: data.grade,
        interestedTopics: data.interestedTopics,
        avatarGender: data.avatarGender,
        equippedHairId: data.equippedHairId || "hair-bob",
        isOnboarded: true,
      });
      return true;
    },
    []
  );

  const saveLessonStep = useCallback((moduleId: string, stepIndex: number) => {
    const mod = INITIAL_MODULES.find((m) => m.id === moduleId);
    if (!mod) return;
    const clampedIndex = Math.max(0, Math.min(mod.steps.length, stepIndex));

    setLessonProgress((prev) => {
      const existing = prev[moduleId];
      return {
        ...prev,
        [moduleId]: {
          moduleId,
          currentStepIndex: clampedIndex,
          maxStepReached: Math.max(existing?.maxStepReached ?? 0, clampedIndex),
          status: existing?.status === "Completed" ? "Completed" : "InProgress",
          selectedOptionId: existing?.selectedOptionId,
          firstCompletionXpGranted: existing?.firstCompletionXpGranted ?? false,
          lastReviewedDate: existing?.lastReviewedDate,
          completedAt: existing?.completedAt,
        },
      };
    });
  }, []);

  const submitScenarioChoice = useCallback(
    (scenarioId: string, optionId: string, linkedModuleId?: string) => {
      const scen = INITIAL_SCENARIOS.find((s) => s.id === scenarioId);
      const opt = scen?.options.find((o) => o.id === optionId);
      if (!scen || !opt) {
        return { xpEarned: 0, pointsEarned: 0, isRecommended: false };
      }

      const existingAttempt = scenarioAttempts[scenarioId];
      const alreadyGrantedXp = existingAttempt?.xpGranted ?? false;
      const grantXpNow = opt.isRecommended && !alreadyGrantedXp;
      const xpEarned = grantXpNow ? scen.xpReward : 0;
      const pointsEarned = grantXpNow ? scen.pointReward : 0;

      setScenarioAttempts((prev) => ({
        ...prev,
        [scenarioId]: {
          scenarioId,
          selectedOptionId: optionId,
          passedFirstTime: existingAttempt?.passedFirstTime || opt.isRecommended,
          xpGranted: alreadyGrantedXp || grantXpNow,
          attemptedAt: new Date().toISOString(),
        },
      }));

      if (linkedModuleId) {
        setLessonProgress((prev) => {
          const curr = prev[linkedModuleId];
          return {
            ...prev,
            [linkedModuleId]: {
              moduleId: linkedModuleId,
              currentStepIndex: curr?.currentStepIndex ?? 0,
              maxStepReached: curr?.maxStepReached ?? 0,
              status: curr?.status ?? "InProgress",
              selectedOptionId: optionId,
              firstCompletionXpGranted: curr?.firstCompletionXpGranted ?? false,
              lastReviewedDate: curr?.lastReviewedDate,
              completedAt: curr?.completedAt,
            },
          };
        });
      }

      recordStudyActivityAndMission("scenario", xpEarned, pointsEarned);
      return { xpEarned, pointsEarned, isRecommended: opt.isRecommended };
    },
    [scenarioAttempts, recordStudyActivityAndMission]
  );

  const completeLesson = useCallback(
    (moduleId: string): { ok: boolean; xpEarned: number; reason?: string } => {
      const mod = INITIAL_MODULES.find((m) => m.id === moduleId);
      if (!mod) return { ok: false, xpEarned: 0, reason: "Bài học không tồn tại." };

      const prog = lessonProgress[moduleId];
      const scenAttempt = scenarioAttempts[mod.scenarioId];

      // US-10 AC3 & US-15 AC3: Phải chọn phương án tình huống thực hành mới được hoàn thành bài
      if (!prog?.selectedOptionId && !scenAttempt?.selectedOptionId) {
        return {
          ok: false,
          xpEarned: 0,
          reason: "Bạn cần chọn phương án xử lý tình huống thực hành trước khi hoàn thành bài học.",
        };
      }

      const alreadyGranted = prog?.firstCompletionXpGranted ?? false;
      const xpEarned = alreadyGranted ? 0 : mod.xpReward; // +50 XP lần đầu (US-15 AC1, AC2)

      setLessonProgress((prev) => ({
        ...prev,
        [moduleId]: {
          moduleId,
          currentStepIndex: mod.steps.length - 1,
          maxStepReached: mod.steps.length - 1,
          status: "Completed",
          selectedOptionId: prog?.selectedOptionId || scenAttempt?.selectedOptionId,
          firstCompletionXpGranted: true,
          lastReviewedDate: prog?.lastReviewedDate,
          completedAt: prog?.completedAt || new Date().toISOString(),
        },
      }));

      setProfile((prev) => {
        const nextBadges = prev.unlockedBadgeIds.includes("badge-first-lesson")
          ? prev.unlockedBadgeIds
          : [...prev.unlockedBadgeIds, "badge-first-lesson"];
        return {
          ...prev,
          unlockedBadgeIds: nextBadges,
        };
      });

      recordStudyActivityAndMission("lesson", xpEarned, alreadyGranted ? 0 : 15);
      return { ok: true, xpEarned };
    },
    [lessonProgress, scenarioAttempts, recordStudyActivityAndMission]
  );

  const reviewCompletedLesson = useCallback(
    (moduleId: string): { ok: boolean; message: string } => {
      const prog = lessonProgress[moduleId];
      if (!prog || prog.status !== "Completed") {
        // US-16 AC3: Không cho xác nhận ôn tập bài chưa hoàn thành
        return {
          ok: false,
          message: "Hãy hoàn thành bài học này lần đầu trước khi sử dụng tính năng xác nhận ôn tập.",
        };
      }

      const today = getTodayKey();
      if (prog.lastReviewedDate === today) {
        // US-16 AC2: Chống ghi nhận ôn tập trùng trong cùng một ngày
        return {
          ok: false,
          message: "Bạn đã xác nhận ôn tập bài học này trong hôm nay rồi.",
        };
      }

      setLessonProgress((prev) => ({
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          lastReviewedDate: today,
        },
      }));

      recordStudyActivityAndMission("review", 0, 0);
      return {
        ok: true,
        message: "Đã ghi nhận hoạt động ôn tập bài học trong ngày!",
      };
    },
    [lessonProgress, recordStudyActivityAndMission]
  );

  const purchaseAvatarItem = useCallback(
    (itemId: string): { ok: boolean; message: string } => {
      const item = AVATAR_SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return { ok: false, message: "Vật phẩm không tồn tại." };

      if (profile.ownedItemIds.includes(itemId)) {
        // US-28 AC2: Đã sở hữu thì không trừ điểm lần nữa
        return { ok: false, message: "Bạn đã sở hữu vật phẩm này trong tủ đồ." };
      }

      if (profile.rewardPoints < item.cost) {
        // US-28 AC3: Không đủ điểm thưởng
        return {
          ok: false,
          message: `Bạn cần thêm ${item.cost - profile.rewardPoints} điểm thưởng để đổi vật phẩm này.`,
        };
      }

      setProfile((prev) => ({
        ...prev,
        rewardPoints: prev.rewardPoints - item.cost,
        ownedItemIds: [...prev.ownedItemIds, itemId],
        equippedHairId: item.category === "hair" ? itemId : prev.equippedHairId,
        equippedOutfitId: item.category === "outfit" ? itemId : prev.equippedOutfitId,
        equippedAccessoryId:
          item.category === "accessory" ? itemId : prev.equippedAccessoryId,
      }));

      return { ok: true, message: `Đã đổi và trang bị "${item.name}" thành công!` };
    },
    [profile.ownedItemIds, profile.rewardPoints]
  );

  const equipAvatarItem = useCallback(
    (itemId: string): { ok: boolean; message: string } => {
      const item = AVATAR_SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return { ok: false, message: "Vật phẩm không hợp lệ." };

      // US-29 AC3: Chặn trang bị vật phẩm chưa mở khóa
      if (!profile.ownedItemIds.includes(itemId)) {
        return { ok: false, message: "Bạn cần mở khóa vật phẩm trước khi trang bị." };
      }

      setProfile((prev) => ({
        ...prev,
        equippedHairId: item.category === "hair" ? itemId : prev.equippedHairId,
        equippedOutfitId: item.category === "outfit" ? itemId : prev.equippedOutfitId,
        equippedAccessoryId:
          item.category === "accessory" ? itemId : prev.equippedAccessoryId,
      }));

      return { ok: true, message: `Đã mặc "${item.name}".` };
    },
    [profile.ownedItemIds]
  );

  const updateParentSettings = useCallback((patch: Partial<ParentSettingsState>) => {
    setParentSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const generateSampleEmail = useCallback(
    async (
      category: ParentInboxMessage["category"]
    ): Promise<{ ok: boolean; message: string }> => {
      // US-36 AC3 & US-37 AC3: Kiểm tra loại thông báo có đang bật trong cài đặt không
      if (category === "progress_report" && !parentSettings.notifyProgressReport) {
        return {
          ok: false,
          message:
            "Loại 'Báo cáo tiến độ học tập' đang tắt. Vui lòng bật lại trong Cài đặt Email để tạo báo cáo.",
        };
      }
      if (category === "study_reminder" && !parentSettings.notifyStudyReminder) {
        return {
          ok: false,
          message: "Loại 'Nhắc nhở học tập' đang tắt trong Cài đặt Email.",
        };
      }
      if (category === "new_content" && !parentSettings.notifyNewContent) {
        return {
          ok: false,
          message: "Loại 'Thông báo nội dung mới' đang tắt trong Cài đặt Email.",
        };
      }
      if (category === "premium_offer" && !parentSettings.notifyPremiumOffer) {
        return {
          ok: false,
          message: "Loại 'Thông tin gói Premium' đang tắt trong Cài đặt Email.",
        };
      }

      const completedLessonsCount = Object.values(lessonProgress).filter(
        (p) => p.status === "Completed"
      ).length;
      const resolvedScenariosCount = Object.keys(scenarioAttempts).length;

      const res = await fetch("/api/parent/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          periodDays: parentSettings.reportFrequencyDays,
          completedLessons: completedLessonsCount,
          resolvedScenarios: resolvedScenariosCount,
          currentStreak: profile.currentStreak,
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.message) {
          setParentInbox((prev) => [data.message, ...prev]);
          return {
            ok: true,
            message: "Đã tạo thư mẫu mới trong Hộp thư Phụ huynh (lưu trên MongoDB).",
          };
        }
      }

      return { ok: false, message: "Không thể tạo thư mẫu lúc này." };
    },
    [parentSettings, lessonProgress, scenarioAttempts, profile.currentStreak]
  );

  const markInboxRead = useCallback((id: string) => {
    setParentInbox((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    );
    fetch("/api/parent/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => null);
  }, []);

  const deleteInboxMessage = useCallback((id: string) => {
    setParentInbox((prev) => prev.filter((m) => m.id !== id));
    fetch(`/api/parent/inbox?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => null);
  }, []);

  const markNotificationRead = useCallback((id?: string, markAll?: boolean) => {
    setNotifications((prev) =>
      prev.map((n) => (markAll || n.id === id ? { ...n, isRead: true } : n))
    );
    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, markAll }),
    }).catch(() => null);
  }, []);

  // US-18 AC1, AC2, AC4: Ưu tiên gợi ý bài đang học dở trước, sau đó đến bài chưa học
  const getRecommendedNextModule = useCallback(
    (excludeModuleId?: string): LearningModule | null => {
      const candidates = INITIAL_MODULES.filter((m) => m.id !== excludeModuleId);
      const inProgress = candidates.find(
        (m) => lessonProgress[m.id]?.status === "InProgress"
      );
      if (inProgress) return inProgress;

      const notStarted = candidates.find(
        (m) => lessonProgress[m.id]?.status !== "Completed"
      );
      return notStarted || null;
    },
    [lessonProgress]
  );

  const value = useMemo<GenUpContextValue>(
    () => ({
      profile,
      modules: INITIAL_MODULES,
      scenarios: INITIAL_SCENARIOS,
      lessonProgress,
      scenarioAttempts,
      parentSettings,
      parentInbox,
      notifications,
      completedMissionIdsToday: dailyMissionsClaimed[todayKey] ?? [],
      remainingFreeSeconds,
      usedFreeSecondsToday,
      isTimerRunning,
      isFreeLimitReached,
      updateProfile,
      resetForNewOnboarding,
      saveLessonStep,
      submitScenarioChoice,
      completeLesson,
      reviewCompletedLesson,
      purchaseAvatarItem,
      equipAvatarItem,
      updateParentSettings,
      generateSampleEmail,
      markInboxRead,
      deleteInboxMessage,
      markNotificationRead,
      getRecommendedNextModule,
    }),
    [
      profile,
      lessonProgress,
      scenarioAttempts,
      parentSettings,
      parentInbox,
      notifications,
      dailyMissionsClaimed,
      todayKey,
      remainingFreeSeconds,
      usedFreeSecondsToday,
      isTimerRunning,
      isFreeLimitReached,
      updateProfile,
      resetForNewOnboarding,
      saveLessonStep,
      submitScenarioChoice,
      completeLesson,
      reviewCompletedLesson,
      purchaseAvatarItem,
      equipAvatarItem,
      updateParentSettings,
      generateSampleEmail,
      markInboxRead,
      deleteInboxMessage,
      markNotificationRead,
      getRecommendedNextModule,
    ]
  );

  return <GenUpContext.Provider value={value}>{children}</GenUpContext.Provider>;
}

export function useGenUp() {
  const ctx = useContext(GenUpContext);
  if (!ctx) {
    throw new Error("useGenUp must be used inside GenUpProvider");
  }
  return ctx;
}

