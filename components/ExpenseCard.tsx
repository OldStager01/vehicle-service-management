"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { DollarSign, Droplet, Wrench, Shield, FileText } from "lucide-react-native"
import type { Expense } from "../types"
import { useTheme } from "../context/ThemeContext"
import { mockVehicles } from "../data/mockData"

interface ExpenseCardProps {
  expense: Expense
  onPress?: (id: string) => void
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress }) => {
  const { colors } = useTheme()

  const getVehicleName = (vehicleId: string): string => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId)
    return vehicle ? vehicle.name : "Unknown Vehicle"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fuel":
        return <Droplet size={16} color={colors.primary} />
      case "maintenance":
      case "repair":
        return <Wrench size={16} color={colors.primary} />
      case "insurance":
      case "tax":
        return <Shield size={16} color={colors.primary} />
      default:
        return <FileText size={16} color={colors.primary} />
    }
  }

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "fuel":
        return "Fuel"
      case "maintenance":
        return "Maintenance"
      case "repair":
        return "Repair"
      case "insurance":
        return "Insurance"
      case "tax":
        return "Tax"
      default:
        return "Other"
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
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    leftContent: {
      flexDirection: "row",
      alignItems: "center",
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
    contentContainer: {
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
    amount: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    infoItem: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.muted,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
    },
    description: {
      fontSize: 14,
      color: colors.text,
      marginTop: 8,
    },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "20",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.primary,
      marginLeft: 4,
    },
  })

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(expense.id)} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <DollarSign size={16} color={colors.primary} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{expense.description}</Text>
            <Text style={styles.vehicle}>{getVehicleName(expense.vehicleId)}</Text>
          </View>
        </View>
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{formatDate(expense.date)}</Text>
        </View>
        {expense.odometer && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Odometer</Text>
            <Text style={styles.infoValue}>{expense.odometer} km</Text>
          </View>
        )}
      </View>

      <View style={styles.categoryBadge}>
        {getCategoryIcon(expense.category)}
        <Text style={styles.categoryText}>{getCategoryLabel(expense.category)}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ExpenseCard
