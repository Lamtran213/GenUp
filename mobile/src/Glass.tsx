import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radius } from "./theme";

// Thẻ Liquid Glass: blur + nền trắng mờ + viền sáng (khớp .liquid-glass trên web)
export function Glass({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.wrap, style]} {...rest}>
      <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      {children}
    </View>
  );
}

// Nền Aurora: các quầng màu mờ phía sau để kính có thứ khúc xạ
export function Aurora() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.orb, { top: -80, left: -60, backgroundColor: "rgba(16,185,129,0.45)" }]} />
      <View style={[styles.orb, { top: 160, right: -90, backgroundColor: "rgba(56,189,248,0.42)" }]} />
      <View style={[styles.orb, { bottom: -60, left: 40, backgroundColor: "rgba(251,191,36,0.38)" }]} />
      <View style={[styles.orb, { bottom: 220, right: 20, width: 200, height: 200, backgroundColor: "rgba(167,139,250,0.32)" }]} />
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    overflow: "hidden",
    padding: 16,
  },
  tint: { backgroundColor: colors.glass },
  orb: { position: "absolute", width: 300, height: 300, borderRadius: 150 },
});

