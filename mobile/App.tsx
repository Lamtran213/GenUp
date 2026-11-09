import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Aurora, Glass } from "./src/Glass";
import { colors, radius } from "./src/theme";
import { GenUpUser, askGendio } from "./src/api";
import { currentFirebaseUser, signInWithGoogle, signOut } from "./src/auth";
import { enablePush, listenForeground } from "./src/push";

type Tab = "learn" | "scenario" | "gendio" | "me";

const TOPICS = [
  { emoji: "🌱", title: "Cơ thể & Dậy thì", xp: 50, color: colors.emerald },
  { emoji: "🛡️", title: "Ranh giới & Đồng thuận", xp: 50, color: colors.sky },
  { emoji: "🌐", title: "An toàn trên mạng", xp: 60, color: colors.violet },
  { emoji: "💛", title: "Cảm xúc & Tâm lý", xp: 50, color: colors.amber },
];

const QUESTS = [
  { emoji: "📘", title: "Học 1 bài", reward: "+20 XP" },
  { emoji: "🧭", title: "Giải 1 tình huống", reward: "+15 XP" },
  { emoji: "🔄", title: "Ôn 1 bài cũ", reward: "+10 XP" },
];

const SCENARIO = {
  title: "Người lạ trong game xin ảnh riêng tư",
  options: [
    { id: "A", text: "Gửi ảnh che mặt để nhận quà", ok: false },
    { id: "B", text: "Từ chối, chụp màn hình, chặn & báo bố mẹ", ok: true },
    { id: "C", text: "Im lặng nhưng vẫn nhắn tiếp", ok: false },
  ],
};

export default function App() {
  const [user, setUser] = useState<GenUpUser | null>(null);
  const [booting, setBooting] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("learn");
  const [xp, setXp] = useState(110);
  const [slide, setSlide] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("Chào bạn! Hỏi Gendio bất cứ điều gì nhé 💬");
  const [pushOn, setPushOn] = useState(false);

  useEffect(() => {
    const fb = currentFirebaseUser();
    if (fb) {
      setUser({
        uid: fb.uid,
        email: fb.email ?? "",
        displayName: fb.displayName ?? "Bạn",
        photoURL: fb.photoURL,
      });
    }
    setBooting(false);
    const unsub = listenForeground((t, b) => Alert.alert(t, b));
    return unsub;
  }, []);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      Alert.alert("Có lỗi", e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  if (booting) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={colors.emerald} />
      </View>
    );
  }

  // ===== MÀN ĐĂNG NHẬP =====
  if (!user) {
    return (
      <View style={styles.root}>
        <Aurora />
        <StatusBar style="dark" />
        <SafeAreaView style={[styles.flex, styles.center, { padding: 24 }]}>
          <Glass style={{ width: "100%", alignItems: "center", gap: 14, padding: 28 }}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>G</Text>
            </View>
            <Text style={styles.h1}>GenUp</Text>
            <Text style={styles.muted}>Lớn lên tự tin, an toàn mỗi ngày 🌱</Text>
            <Pressable
              disabled={busy}
              onPress={() => run(async () => setUser(await signInWithGoogle()))}
              style={({ pressed }) => [styles.btnPrimary, pressed && { opacity: 0.85 }]}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Đăng nhập Google</Text>
              )}
            </Pressable>
          </Glass>
        </SafeAreaView>
      </View>
    );
  }

  const level = Math.floor(xp / 100) + 1;
  const topic = TOPICS[slide];

  return (
    <View style={styles.root}>
      <Aurora />
      <StatusBar style="dark" />
      <SafeAreaView style={styles.flex} edges={["top"]}>
        {/* HUD */}
        <Glass style={styles.hud}>
          <View style={styles.row}>
            <View style={styles.logoSm}>
              <Text style={styles.logoSmText}>G</Text>
            </View>
            <View>
              <Text style={styles.bold}>{user.displayName}</Text>
              <Text style={[styles.small, { color: colors.emerald }]}>Lv.{level}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Pill bg={colors.amberLight} fg="#B45309" text={`⚡ ${xp}`} />
            <Pill bg="#FFFBEB" fg="#D97706" text="🔥 3" />
          </View>
        </Glass>

        <ScrollView contentContainerStyle={styles.scroll}>
          {tab === "learn" && (
            <>
              {/* Carousel chủ đề */}
              <Glass style={{ gap: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.small}>Chủ đề {slide + 1}/4</Text>
                  <Pill bg={colors.emeraldLight} fg="#047857" text={`+${topic.xp} XP`} />
                </View>
                <Text style={styles.sticker}>{topic.emoji}</Text>
                <Text style={styles.h2}>{topic.title}</Text>
                <View style={styles.rowBetween}>
                  <Btn text="←" onPress={() => setSlide((slide + 3) % 4)} />
                  <Pressable
                    style={[styles.btnPrimary, { flex: 1, marginHorizontal: 8, backgroundColor: topic.color }]}
                    onPress={() => setXp(xp + 25)}
                  >
                    <Text style={styles.btnPrimaryText}>Học ngay</Text>
                  </Pressable>
                  <Btn text="→" onPress={() => setSlide((slide + 1) % 4)} />
                </View>
              </Glass>

              {/* Nhiệm vụ */}
              <Glass style={{ gap: 10 }}>
                <Text style={styles.bold}>🎯 Nhiệm vụ hôm nay</Text>
                {QUESTS.map((q) => (
                  <View key={q.title} style={styles.item}>
                    <Text style={{ fontSize: 24 }}>{q.emoji}</Text>
                    <Text style={[styles.bold, styles.flex]}>{q.title}</Text>
                    <Text style={[styles.small, { color: "#B45309" }]}>{q.reward}</Text>
                  </View>
                ))}
              </Glass>
            </>
          )}

          {tab === "scenario" && (
            <Glass style={{ gap: 12 }}>
              <Text style={styles.sticker}>🌐</Text>
              <Text style={styles.h2}>{SCENARIO.title}</Text>
              {SCENARIO.options.map((o) => {
                const chosen = picked === o.id;
                return (
                  <Pressable
                    key={o.id}
                    onPress={() => {
                      if (!picked && o.ok) setXp(xp + 30);
                      setPicked(o.id);
                    }}
                    style={[
                      styles.item,
                      chosen && {
                        borderColor: o.ok ? colors.emerald : colors.amber,
                        backgroundColor: o.ok ? "rgba(209,250,229,0.8)" : "rgba(254,243,199,0.8)",
                      },
                    ]}
                  >
                    <Text style={styles.bold}>{o.id}</Text>
                    <Text style={[styles.flex, { color: colors.ink }]}>{o.text}</Text>
                  </Pressable>
                );
              })}
              {picked && (
                <Text style={[styles.bold, { color: picked === "B" ? colors.emerald : "#B45309" }]}>
                  {picked === "B" ? "🌟 Chuẩn! +30 XP" : "💡 Thử lại phương án an toàn hơn"}
                </Text>
              )}
            </Glass>
          )}

          {tab === "gendio" && (
            <Glass style={{ gap: 12 }}>
              <Text style={styles.bold}>💬 Hỏi Gendio (riêng tư)</Text>
              <View style={styles.item}>
                <Text style={{ color: colors.ink, flex: 1 }}>{reply}</Text>
              </View>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Nhập câu hỏi..."
                placeholderTextColor="#64748B"
                style={styles.input}
              />
              <Pressable
                disabled={busy || !question.trim()}
                style={[styles.btnPrimary, (!question.trim() || busy) && { opacity: 0.5 }]}
                onPress={() =>
                  run(async () => {
                    const r = await askGendio(question.trim());
                    setReply(r.reply?.text ?? "Gendio đã ghi nhận câu hỏi!");
                    setQuestion("");
                  })
                }
              >
                <Text style={styles.btnPrimaryText}>{busy ? "Đang hỏi..." : "Gửi"}</Text>
              </Pressable>
            </Glass>
          )}

          {tab === "me" && (
            <Glass style={{ gap: 12 }}>
              <Text style={styles.sticker}>👤</Text>
              <Text style={styles.h2}>{user.displayName}</Text>
              <Text style={styles.muted}>{user.email}</Text>
              <Pressable
                disabled={busy || pushOn}
                style={[styles.btnPrimary, pushOn && { backgroundColor: colors.sky }]}
                onPress={() =>
                  run(async () => {
                    await enablePush(user.uid);
                    setPushOn(true);
                  })
                }
              >
                <Text style={styles.btnPrimaryText}>
                  {pushOn ? "✓ Đã bật thông báo" : "🔔 Bật thông báo"}
                </Text>
              </Pressable>
              <Btn
                text="Đăng xuất"
                onPress={() =>
                  run(async () => {
                    await signOut();
                    setUser(null);
                  })
                }
              />
            </Glass>
          )}
        </ScrollView>

        {/* Bottom nav */}
        <Glass style={styles.nav}>
          {(
            [
              ["learn", "🗺️", "Học"],
              ["scenario", "🧭", "Tình huống"],
              ["gendio", "💬", "Gendio"],
              ["me", "👤", "Tôi"],
            ] as const
          ).map(([key, icon, label]) => (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.navItem, tab === key && { backgroundColor: colors.emerald }]}
            >
              <Text style={{ fontSize: 18 }}>{icon}</Text>
              <Text style={[styles.small, { color: tab === key ? "#fff" : colors.ink }]}>{label}</Text>
            </Pressable>
          ))}
        </Glass>
      </SafeAreaView>
    </View>
  );
}

function Pill({ bg, fg, text }: { bg: string; fg: string; text: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.small, { color: fg, fontWeight: "700" }]}>{text}</Text>
    </View>
  );
}

function Btn({ text, onPress }: { text: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.btnGlass}>
      <Text style={styles.bold}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scroll: { padding: 14, gap: 14, paddingBottom: 24 },
  h1: { fontSize: 28, fontWeight: "800", color: colors.ink },
  h2: { fontSize: 20, fontWeight: "800", color: colors.ink },
  bold: { fontWeight: "700", color: colors.ink },
  small: { fontSize: 12, color: colors.muted },
  muted: { color: colors.muted },
  sticker: { fontSize: 44 },
  logo: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.emerald, alignItems: "center", justifyContent: "center" },
  logoText: { color: "#fff", fontSize: 30, fontWeight: "800" },
  logoSm: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.emerald, alignItems: "center", justifyContent: "center" },
  logoSmText: { color: "#fff", fontWeight: "800" },
  hud: { marginHorizontal: 14, marginTop: 6, paddingVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassStrong,
  },
  input: {
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassStrong,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
  },
  btnPrimary: { backgroundColor: colors.emerald, borderRadius: radius.sm, paddingVertical: 13, paddingHorizontal: 18, alignItems: "center", alignSelf: "stretch" },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
  btnGlass: { backgroundColor: colors.glassStrong, borderWidth: 1.5, borderColor: colors.glassBorder, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" },
  nav: { flexDirection: "row", marginHorizontal: 14, marginBottom: 12, padding: 6, gap: 6 },
  navItem: { flex: 1, alignItems: "center", paddingVertical: 8, borderRadius: radius.sm },
});
