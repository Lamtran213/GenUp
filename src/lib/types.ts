export type TopicCategory = "Puberty" | "Emotion" | "Boundaries" | "CyberSafety";

export type ModuleStatus = "Draft" | "PendingReview" | "Approved" | "Published";

export interface ModuleStep {
  stepIndex: number;
  title: string;
  content: string;
  keyTakeaway: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  isRecommended: boolean;
  immediateFeedback: string;
  detailedExplanation: string;
}

export interface ScenarioItem {
  id: string;
  moduleId?: string;
  title: string;
  topicCategory: TopicCategory;
  contextDescription: string;
  question: string;
  xpReward: number;
  pointReward: number;
  safetyReminder: string;
  options: ScenarioOption[];
}

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  summary: string;
  topicCategory: TopicCategory;
  targetMinGrade: number;
  targetMaxGrade: number;
  estimatedMinutes: number;
  xpReward: number;
  status: ModuleStatus;
  coverImage?: string;
  steps: ModuleStep[];
  scenarioId: string;
}

export interface AvatarItem {
  id: string;
  name: string;
  category: "hair" | "outfit" | "accessory";
  cost: number;
  description: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  conditionText: string;
}

export interface DailyMission {
  id: "lesson" | "scenario" | "review";
  title: string;
  rewardPoints: number;
  xpReward: number;
}

export interface StudentProfileState {
  id: string;
  nickname: string;
  grade: 6 | 7 | 8 | 9;
  interestedTopics: TopicCategory[];
  avatarGender: "Male" | "Female";
  equippedHairId: string;
  equippedOutfitId: string;
  equippedAccessoryId: string;
  ownedItemIds: string[];
  unlockedBadgeIds: string[];
  totalXp: number;
  rewardPoints: number;
  currentStreak: number;
  longestStreak: number;
  activeDates: string[];
  claimedStreakMilestones: number[];
  isOnboarded: boolean;
}

export interface LessonProgressEntry {
  moduleId: string;
  currentStepIndex: number;
  maxStepReached: number;
  status: "NotStarted" | "InProgress" | "Completed";
  selectedOptionId?: string;
  firstCompletionXpGranted: boolean;
  lastReviewedDate?: string;
  completedAt?: string;
}

export interface ScenarioAttemptEntry {
  scenarioId: string;
  selectedOptionId: string;
  passedFirstTime: boolean;
  xpGranted: boolean;
  attemptedAt: string;
}

export interface GendioChatMessage {
  id: string;
  actorRole: "student" | "parent";
  sender: "user" | "gendio";
  text: string;
  matchedTopic?: string;
  requiresAdultSupport?: boolean;
  createdAt: string;
}

export interface ParentInboxMessage {
  id: string;
  category: "progress_report" | "study_reminder" | "new_content" | "premium_offer";
  periodDays: 7 | 14 | 30;
  subject: string;
  previewText: string;
  bodyText: string;
  conversationPrompts: string[];
  isRead: boolean;
  isSimulated: boolean;
  createdAt: string;
}

export interface InAppNotification {
  id: string;
  type: "badge_unlocked" | "streak_milestone" | "mission_completed" | "system";
  title: string;
  body: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
}

export interface ParentSettingsState {
  parentLinked: boolean;
  parentSummaryEnabled: boolean;
  parentPin: string;
  notifyProgressReport: boolean;
  notifyStudyReminder: boolean;
  notifyNewContent: boolean;
  notifyPremiumOffer: boolean;
  reportFrequencyDays: 7 | 14 | 30;
  planType: "Free" | "PremiumMonthly" | "PremiumYearly";
}

