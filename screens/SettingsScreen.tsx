import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  HelpCircle,
  Shield,
  Info,
  Bell,
} from "lucide-react-native";
import { useAuth } from "../hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: async () => {
          setLoading(true);
          try {
            await logout();
            // Navigation will be handled by the AuthContext
          } catch (error: any) {
            Alert.alert("Error", error.message);
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    // You can implement theme switching logic here
    try {
      await AsyncStorage.setItem("@theme_mode", value ? "dark" : "light");
    } catch (error) {
      console.log("Error saving theme preference", error);
    }
  };

  const toggleNotifications = async (value: boolean) => {
    setNotifications(value);
    try {
      await AsyncStorage.setItem("@notifications_enabled", String(value));
    } catch (error) {
      console.log("Error saving notification preference", error);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          onPress: () => {
            Alert.alert(
              "Feature Coming Soon",
              "Account deletion functionality will be available in a future update."
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user?.displayName || "User"}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            {darkMode ? (
              <Moon size={22} color="#64748b" />
            ) : (
              <Sun size={22} color="#64748b" />
            )}
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
            thumbColor={darkMode ? "#3b82f6" : "#f4f4f5"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Bell size={22} color="#64748b" />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
            thumbColor={notifications ? "#3b82f6" : "#f4f4f5"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.navigationItem}>
          <View style={styles.navigationItemLeft}>
            <HelpCircle size={22} color="#64748b" />
            <Text style={styles.navigationText}>Help & Support</Text>
          </View>
          <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navigationItem}>
          <View style={styles.navigationItemLeft}>
            <Shield size={22} color="#64748b" />
            <Text style={styles.navigationText}>Privacy Policy</Text>
          </View>
          <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navigationItem}>
          <View style={styles.navigationItemLeft}>
            <Info size={22} color="#64748b" />
            <Text style={styles.navigationText}>About</Text>
          </View>
          <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    marginVertical: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#64748b",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#64748b",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    color: "#0f172a",
    marginLeft: 12,
  },
  navigationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  navigationItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  navigationText: {
    fontSize: 16,
    color: "#0f172a",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginVertical: 16,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 8,
  },
  deleteAccountButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  deleteAccountText: {
    fontSize: 14,
    color: "#64748b",
    textDecorationLine: "underline",
  },
});

export default SettingsScreen;
