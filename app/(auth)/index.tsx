// app/(auth)/index.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "@/hooks/use-auth";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
  fullName?: string;
};

type AuthMode = "login" | "register";

const AuthIndex: React.FC = () => {
  const { login, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",
  });

  // Update form
  const updateForm = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validate form
  const validateForm = () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Semua field harus diisi");
      return false;
    }

    if (mode === "register") {
      if (!form.fullName) {
        Alert.alert("Error", "Nama lengkap harus diisi");
        return false;
      }
      if (form.password.length < 6) {
        Alert.alert("Error", "Password minimal 6 karakter");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        Alert.alert("Error", "Konfirmasi password tidak cocok");
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Error", "Format email tidak valid");
      return false;
    }

    return true;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        // await register(form.email, form.password, form.fullName!);
      }
      router.replace("../(tabs)");
    } catch (err: any) {
      Alert.alert(
        mode === "login" ? "Login Gagal" : "Registrasi Gagal",
        err.message || "Terjadi kesalahan, coba lagi"
      );
    } finally {
      setLoading(false);
    }
  };

  // Guest login
  const handleGuest = async () => {
    setLoading(true);
    try {
      await continueAsGuest();
      router.replace("../(tabs)");
    } catch (err) {
      Alert.alert("Error", "Gagal masuk sebagai tamu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={s.logoWrap}>
          <LinearGradient
            colors={["#3E64FF", "#2C49FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.logo}
          >
            <View style={s.targetOuter}>
              <View style={s.targetInner} />
            </View>
          </LinearGradient>
        </View>

        <Text style={s.title}>FocusTask</Text>
        <Text style={s.subtitle}>
          {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </Text>

        {/* Tab Switcher */}
        <View style={s.tabContainer}>
          <TouchableOpacity
            style={[s.tab, mode === "login" && s.tabActive]}
            onPress={() => setMode("login")}
          >
            <Text
              style={[
                s.tabText,
                mode === "login" && s.tabTextActive,
              ]}
            >
              Masuk
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, mode === "register" && s.tabActive]}
            onPress={() => setMode("register")}
          >
            <Text
              style={[
                s.tabText,
                mode === "register" && s.tabTextActive,
              ]}
            >
              Daftar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={s.card}>
          {/* Full Name - Register Only */}
          {mode === "register" && (
            <>
              <Text style={s.label}>Nama Lengkap</Text>
              <View style={s.inputWrap}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#96A0B5"
                  style={s.leftIcon}
                />
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#8B92A6"
                  style={s.input}
                  value={form.fullName}
                  onChangeText={(v) => updateForm("fullName", v)}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          {/* Email */}
          <Text style={s.label}>Email</Text>
          <View style={s.inputWrap}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#96A0B5"
              style={s.leftIcon}
            />
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#8B92A6"
              style={s.input}
              value={form.email}
              onChangeText={(v) => updateForm("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={[s.label, { marginTop: 16 }]}>Password</Text>
          <View style={s.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#96A0B5"
              style={s.leftIcon}
            />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#8B92A6"
              style={s.input}
              value={form.password}
              onChangeText={(v) => updateForm("password", v)}
              secureTextEntry
            />
          </View>

          {/* Confirm Password - Register Only */}
          {mode === "register" && (
            <>
              <Text style={[s.label, { marginTop: 16 }]}>
                Konfirmasi Password
              </Text>
              <View style={s.inputWrap}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#96A0B5"
                  style={s.leftIcon}
                />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#8B92A6"
                  style={s.input}
                  value={form.confirmPassword}
                  onChangeText={(v) => updateForm("confirmPassword", v)}
                  secureTextEntry
                />
              </View>
            </>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={s.primaryBtnText}>
              {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
            </Text>
          </TouchableOpacity>

          {/* Guest Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={s.secondaryBtn}
            onPress={handleGuest}
            disabled={loading}
          >
            <Text style={s.secondaryBtnText}>
              {loading ? "Memproses..." : "Lanjutkan sebagai Tamu"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthIndex;

// Styles (sama dengan LoginScreen, + tab styles)
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#161821" },
  scroll: { padding: 24, minHeight: "100%", justifyContent: "center" },

  // Logo (sama)
  logoWrap: { alignItems: "center", marginBottom: 8 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  targetOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  targetInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },

  // Titles (sama)
  title: {
    color: "#F2F5FF",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    color: "#A0A7C0",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },

  // Tab Switcher
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#272B3C",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#2E5BFF",
  },
  tabText: {
    color: "#B7C1E1",
    fontSize: 15,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },

  // Card (sama)
  card: {
    backgroundColor: "#212433",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  label: { color: "#99A1B9", fontSize: 13, marginBottom: 8 },

  // Inputs (sama)
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B1E2B",
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2A2E41",
  },
  leftIcon: { marginRight: 8 },
  input: { flex: 1, color: "#E5EAF5", paddingVertical: 10 },

  // Buttons (sama + disabled state)
  primaryBtn: {
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E5BFF",
    marginTop: 16,
    shadowColor: "#2E5BFF",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnDisabled: {
    backgroundColor: "#4C7DFF",
    opacity: 0.7,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryBtn: {
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    backgroundColor: "#272B3C",
    borderWidth: 1,
    borderColor: "#343B55",
  },
  secondaryBtnText: { color: "#B7C1E1", fontSize: 14 },
});