"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Wrench, AlertTriangle, CheckCircle } from "lucide-react-native"
import type { ServiceRecord } from "../types"
import { useTheme } from "../context/ThemeContext"

interface ServiceHistoryCardProps {
  service: ServiceRecord
  onPress?: (id: string) => void
}

const ServiceHistoryCard: React.FC<ServiceHistoryCardProps> = ({ service, onPress }) => {
  const { colors } = useTheme()

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "regular":
        return <CheckCircle size={16} color={colors.success} />
      case "repair":
        return <Wrench size={16} color={colors.warning} />
      case "emergency":
        return <AlertTriangle size={16} color={colors.error} />
      default:
        return <Wrench size={16} color={colors.primary} />
    }
  }

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "regular":
        return "Regular Service"
      case "repair":
        return "Repair"
      case "emergency":
        return "Emergency"
      default:
        return "Other"
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "regular":
        return colors.success
      case "repair":
        return colors.warning
      case "emergency":
        return colors.error
      default:
        return colors.primary
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
      backgroundColor: getTypeColor(service.type) + "20",
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
    workshop: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    cost: {
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
    typeBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: getTypeColor(service.type) + "20",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginTop: 12,
    },
    typeText: {
      fontSize: 12,
      fontWeight: "500",
      color: getTypeColor(service.type),
      marginLeft: 4,
    },
  })

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(service.id)} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>{getTypeIcon(service.type)}</View>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{formatDate(service.date)}</Text>
            <Text style={styles.workshop}>{service.workshop}</Text>
          </View>
        </View>
        <Text style={styles.cost}>{formatCurrency(service.cost)}</Text>
      </View>

      <Text style={styles.description}>{service.description}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Odometer</Text>
          <Text style={styles.infoValue}>{service.odometer} km</Text>
        </View>
      </View>

      <View style={styles.typeBadge}>
        {getTypeIcon(service.type)}
        <Text style={styles.typeText}>{getTypeLabel(service.type)}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ServiceHistoryCard
