"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Plus, Filter, Bell, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import ReminderCard from "../components/ReminderCard"
import { mockReminders, mockVehicles } from "../data/mockData"

const RemindersScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)

  const filteredReminders = mockReminders.filter((reminder) => {
    const matchesVehicle = selectedVehicle ? reminder.vehicleId === selectedVehicle : true
    const matchesStatus = selectedStatus ? reminder.status === selectedStatus : true
    const matchesType = selectedType ? reminder.type === selectedType : true
    return matchesVehicle && matchesStatus && matchesType
  })

  const handleCompleteReminder = (id: string) => {
    console.log("Complete reminder:", id)
  }

  const handleSnoozeReminder = (id: string) => {
    console.log("Snooze reminder:", id)
  }

  const statuses = [
    { id: "upcoming", label: "Upcoming", icon: Calendar },
    { id: "overdue", label: "Overdue", icon: AlertTriangle },
    { id: "completed", label: "Completed", icon: CheckCircle },
    { id: "snoozed", label: "Snoozed", icon: Clock },
  ]

  const types = [
    { id: "service", label: "Service", icon: Calendar },
    { id: "insurance", label: "Insurance", icon: Bell },
    { id: "puc", label: "PUC", icon: Bell },
    { id: "tax", label: "Tax", icon: Bell },
    { id: "other", label: "Other", icon: Bell },
  ]

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
    },
    filterBar: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginTop: -20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    filterButtonText: {
      fontSize: 14,
      color: colors.primary,
      marginLeft: 4,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    filterContainer: {
      marginBottom: 16,
    },
    filterTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    filterChipsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 12,
    },
    filterChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
    },
    filterChipText: {
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 4,
    },
    activeFilterChip: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    activeFilterChipText: {
      color: "#fff",
    },
    inactiveFilterChip: {
      backgroundColor: "transparent",
      borderColor: colors.border,
    },
    inactiveFilterChipText: {
      color: colors.text,
    },
    emptyState: {
      flex: 1,
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
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders</Text>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(!filterVisible)}>
          <Filter size={16} color={colors.primary} />
          <Text style={styles.filterButtonText}>{filterVisible ? "Hide Filters" : "Show Filters"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {filterVisible && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filter by Vehicle</Text>
            <View style={styles.filterChipsRow}>
              {mockVehicles.map((vehicle) => {
                const isActive = selectedVehicle === vehicle.id
                return (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
                    onPress={() => setSelectedVehicle(isActive ? null : vehicle.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive ? styles.activeFilterChipText : styles.inactiveFilterChipText,
                      ]}
                    >
                      {vehicle.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <Text style={styles.filterTitle}>Filter by Status</Text>
            <View style={styles.filterChipsRow}>
              {statuses.map((status) => {
                const isActive = selectedStatus === status.id
                const Icon = status.icon
                return (
                  <TouchableOpacity
                    key={status.id}
                    style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
                    onPress={() => setSelectedStatus(isActive ? null : status.id)}
                  >
                    <Icon size={16} color={isActive ? "#fff" : colors.text} />
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive ? styles.activeFilterChipText : styles.inactiveFilterChipText,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <Text style={styles.filterTitle}>Filter by Type</Text>
            <View style={styles.filterChipsRow}>
              {types.map((type) => {
                const isActive = selectedType === type.id
                const Icon = type.icon
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
                    onPress={() => setSelectedType(isActive ? null : type.id)}
                  >
                    <Icon size={16} color={isActive ? "#fff" : colors.text} />
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive ? styles.activeFilterChipText : styles.inactiveFilterChipText,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

        {filteredReminders.length > 0 ? (
          <FlatList
            data={filteredReminders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ReminderCard reminder={item} onComplete={handleCompleteReminder} onSnooze={handleSnoozeReminder} />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.muted} />
            <Text style={styles.emptyStateText}>No reminders found. Adjust your filters or add a new reminder.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default RemindersScreen
