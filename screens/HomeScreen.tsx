"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Plus, Bell, Calendar, AlertTriangle } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import VehicleCard from "../components/VehicleCard"
import ReminderCard from "../components/ReminderCard"
import { mockVehicles, mockReminders } from "../data/mockData"

const HomeScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()

  const upcomingReminders = mockReminders
    .filter((reminder) => reminder.status === "upcoming" || reminder.status === "overdue")
    .slice(0, 3)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      paddingTop: 60,
      backgroundColor: colors.primary,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#fff",
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: "rgba(255, 255, 255, 0.8)",
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    viewAllButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    viewAllText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },
    addButton: {
      position: "absolute",
      right: 16,
      bottom: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    summaryCards: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 4,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryValue: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginTop: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.muted,
      textAlign: "center",
      marginTop: 12,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bike & Car Service Manager</Text>
        <Text style={styles.headerSubtitle}>Keep your vehicles in top condition</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <View style={styles.iconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <Text style={styles.summaryValue}>{upcomingReminders.length}</Text>
            <Text style={styles.summaryLabel}>Upcoming Reminders</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={20} color={colors.primary} />
            </View>
            <Text style={styles.summaryValue}>{mockReminders.filter((r) => r.status === "overdue").length}</Text>
            <Text style={styles.summaryLabel}>Overdue Items</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.iconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.summaryValue}>{mockVehicles.length}</Text>
            <Text style={styles.summaryLabel}>Vehicles</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Vehicles</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("Vehicles" as never)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {mockVehicles.length > 0 ? (
          mockVehicles.slice(0, 2).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No vehicles added yet. Tap the + button to add your first vehicle.
            </Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("Reminders" as never)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {upcomingReminders.length > 0 ? (
          upcomingReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={(id) => console.log("Complete reminder:", id)}
              onSnooze={(id) => console.log("Snooze reminder:", id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No upcoming reminders. You're all caught up!</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddEditVehicle" as never)}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen
