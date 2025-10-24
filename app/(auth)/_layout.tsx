// app/(auth)/_layout.tsx
import { Stack, Redirect } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/hooks/use-auth";

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: "#161821" }} />;
  }

  if (user) {
    return <Redirect href="../(tabs)/(home)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}