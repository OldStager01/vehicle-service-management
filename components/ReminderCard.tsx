"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Calendar, Bell, CheckCircle, Clock } from "lucide-react-native"
import type { Reminder } from "../types"
import { useTheme } from "../context/ThemeContext"
import { mockVehicles } from "../data/mockData"

interface ReminderCardProps {
  reminder: Reminder
  onComplete?: (id: string) => void
  onSnooze?: (id: string) => void
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onComplete, onSnooze }) => {
  const { colors } = useTheme()

  const getVehicleName = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId)
    return vehicle ? vehicle.name : "Unknown Vehicle"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const getDaysRemaining = (dateString: string): number => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "upcoming":
        return colors.info
      case "overdue":
        return colors.error
      case "completed":
        return colors.success
      case "snoozed":
        return colors.warning
      default:
        return colors.muted
    }
  }

  const getStatusText = (status: string): string => {
    switch (status) {
      case "upcoming":
        const days = getDaysRemaining(reminder.date)
        return days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`
      case "overdue":
        return "Overdue"
      case "completed":
        return "Completed"
      case "snoozed":
        return "Snoozed"
      default:
        return ""
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "service":
        return <Calendar size={16} color={colors.primary} />
      case "insurance":
      case "puc":
      case "tax":
        return <Bell size={16} color={colors.primary} />
      default:
        return <Bell size={16} color={colors.primary} />
    }
  }

  const styles = StyleSheet.create({
    container: {
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    vehicle: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    date: {
      fontSize: 14,
      color: colors.text,
    },
    status: {
      fontSize: 14,
      fontWeight: "500",
    },
    description: {
      fontSize: 14,
      color: colors.text,
      marginTop: 8,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 16,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginLeft: 8,
    },
    completeButton: {
      backgroundColor: colors.success + "20",
    },
    snoozeButton: {
      backgroundColor: colors.warning + "20",
    },
    actionText: {
      fontSize: 14,
      fontWeight: "500",
      marginLeft: 4,
    },
    completeText: {
      color: colors.success,
    },
    snoozeText: {
      color: colors.warning,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{getTypeIcon(reminder.type)}</View>
        <View style={styles.content}>
          <Text style={styles.title}>{reminder.title}</Text>
          <Text style={styles.vehicle}>{getVehicleName(reminder.vehicleId)}</Text>
        </View>
      </View>

      {reminder.description && <Text style={styles.description}>{reminder.description}</Text>}

      <View style={styles.infoRow}>
        <Text style={styles.date}>{formatDate(reminder.date)}</Text>
        <Text style={[styles.status, { color: getStatusColor(reminder.status) }]}>
          {getStatusText(reminder.status)}
        </Text>
      </View>

      {(reminder.status === "upcoming" || reminder.status === "overdue") && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton]}
            onPress={() => onComplete && onComplete(reminder.id)}
          >
            <CheckCircle size={16} color={colors.success} />
            <Text style={[styles.actionText, styles.completeText]}>Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.snoozeButton]}
            onPress={() => onSnooze && onSnooze(reminder.id)}
          >
            <Clock size={16} color={colors.warning} />
            <Text style={[styles.actionText, styles.snoozeText]}>Snooze</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default ReminderCard
