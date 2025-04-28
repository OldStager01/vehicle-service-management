"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Image } from "react-native"
import { Mail, Bell, Moon, ChevronRight, LogOut, Trash2, HelpCircle, Shield, Info } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import { mockUserProfile } from "../data/mockData"

const SettingsScreen = () => {
  const { colors, theme, setTheme, isDark } = useTheme()
  const [profile, setProfile] = useState(mockUserProfile)
  const [editMode, setEditMode] = useState(false)

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile)
    setEditMode(false)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      paddingTop: 60,a
      backgroundColor: colors.primary,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#fff",
      marginBottom: 16,
    },
    profileSection: {
      alignItems: "center",
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      borderWidth: 3,
      borderColor: "#fff",
    },
    avatarText: {
      fontSize: 36,
      fontWeight: "700",
      color: colors.primary,
    },
    userName: {
      fontSize: 20,
      fontWeight: "700",
      color: "#fff",
    },
    userEmail: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
      marginLeft: 12,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    dangerZone: {
      backgroundColor: colors.error + "10",
      borderColor: colors.error + "30",
    },
    dangerButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },
    dangerText: {
      fontSize: 16,
      color: colors.error,
      marginLeft: 12,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    editButton: {
      position: "absolute",
      right: 16,
      top: 60,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            ) : (
              <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
            )}
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userEmail}>{profile.email}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
          <Text style={styles.editButtonText}>{editMode ? "Cancel" : "Edit Profile"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {editMode ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={profile.name}
                  onChangeText={(text) => setProfile({ ...profile, name: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={profile.email}
                  onChangeText={(text) => setProfile({ ...profile, email: text })}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={profile.phone}
                  onChangeText={(text) => setProfile({ ...profile, phone: text })}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Preferences</Text>
              <View style={styles.card}>
                <View style={styles.settingItem}>
                  <View style={styles.iconContainer}>
                    <Bell size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Switch
                    value={profile.notificationPreferences.push}
                    onValueChange={(value) =>
                      setProfile({
                        ...profile,
                        notificationPreferences: {
                          ...profile.notificationPreferences,
                          push: value,
                        },
                      })
                    }
                    trackColor={{ false: colors.border, true: colors.primary + "70" }}
                    thumbColor={profile.notificationPreferences.push ? colors.primary : colors.muted}
                  />
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.iconContainer}>
                    <Mail size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Switch
                    value={profile.notificationPreferences.email}
                    onValueChange={(value) =>
                      setProfile({
                        ...profile,
                        notificationPreferences: {
                          ...profile.notificationPreferences,
                          email: value,
                        },
                      })
                    }
                    trackColor={{ false: colors.border, true: colors.primary + "70" }}
                    thumbColor={profile.notificationPreferences.email ? colors.primary : colors.muted}
                  />
                </View>

                <View style={[styles.settingItem, styles.settingItemLast]}>
                  <View style={styles.iconContainer}>
                    <Calendar size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Reminder Days in Advance</Text>
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    {profile.notificationPreferences.reminderDays} days
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              <View style={styles.card}>
                <View style={styles.settingItem}>
                  <View style={styles.iconContainer}>
                    <Moon size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Dark Mode</Text>
                  <Switch
                    value={isDark}
                    onValueChange={handleThemeToggle}
                    trackColor={{ false: colors.border, true: colors.primary + "70" }}
                    thumbColor={isDark ? colors.primary : colors.muted}
                  />
                </View>

                <View style={[styles.settingItem, styles.settingItemLast]}>
                  <View style={styles.iconContainer}>
                    <Info size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>App Version</Text>
                  <Text style={{ color: colors.muted }}>1.0.0</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Support</Text>
              <View style={styles.card}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.iconContainer}>
                    <HelpCircle size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Help & Support</Text>
                  <ChevronRight size={20} color={colors.muted} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
                  <View style={styles.iconContainer}>
                    <Shield size={18} color={colors.primary} />
                  </View>
                  <Text style={styles.settingLabel}>Privacy Policy</Text>
                  <ChevronRight size={20} color={colors.muted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <View style={[styles.card, styles.dangerZone]}>
                <TouchableOpacity style={styles.dangerButton}>
                  <Trash2 size={20} color={colors.error} />
                  <Text style={styles.dangerText}>Delete All Data</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.dangerButton, { marginTop: 12 }]}>
                  <LogOut size={20} color={colors.error} />
                  <Text style={styles.dangerText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default SettingsScreen
