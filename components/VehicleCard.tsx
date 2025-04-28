"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/NavigationTypes";
import { Car, Bike, Calendar, AlertTriangle } from "lucide-react-native"
import type { Vehicle } from "../types"
import { useTheme } from "../context/ThemeContext"

interface VehicleCardProps {
  vehicle: Vehicle
  compact?: boolean
}
const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, compact = false }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  // const navigation = useNavigation()
  const { colors } = useTheme()

  const isInsuranceNearExpiry = () => {
    const expiryDate = new Date(vehicle.insuranceExpiry)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isInsuranceExpired = () => {
    const expiryDate = new Date(vehicle.insuranceExpiry)
    const today = new Date()
    return expiryDate < today
  }

  const isPucExpired = () => {
    const expiryDate = new Date(vehicle.pucExpiry)
    const today = new Date()
    return expiryDate < today
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const handlePress = () => {
    navigation.navigate("ServiceHistory", { vehicleId: vehicle.id })
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: compact ? 12 : 16,
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
      marginBottom: compact ? 8 : 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: vehicle.color + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    title: {
      fontSize: compact ? 16 : 18,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
    },
    subtitle: {
      fontSize: compact ? 13 : 14,
      color: colors.muted,
      marginTop: 2,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: compact ? 8 : 12,
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
      fontSize: compact ? 13 : 14,
      fontWeight: "600",
      color: colors.text,
    },
    statusContainer: {
      flexDirection: "row",
      marginTop: 12,
      flexWrap: "wrap",
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
      marginLeft: 4,
    },
    warningBadge: {
      backgroundColor: colors.warning + "20",
    },
    warningText: {
      color: colors.warning,
    },
    dangerBadge: {
      backgroundColor: colors.error + "20",
    },
    dangerText: {
      color: colors.error,
    },
  })

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {vehicle.type === "car" ? <Car size={20} color={vehicle.color} /> : <Bike size={20} color={vehicle.color} />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{vehicle.name}</Text>
          <Text style={styles.subtitle}>
            {vehicle.make} {vehicle.model} • {vehicle.year}
          </Text>
        </View>
      </View>

      {!compact && (
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Registration</Text>
            <Text style={styles.infoValue}>{vehicle.registrationNumber}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Insurance Expiry</Text>
            <Text style={styles.infoValue}>{formatDate(vehicle.insuranceExpiry)}</Text>
          </View>
        </View>
      )}

      {!compact && (
        <View style={styles.statusContainer}>
          {isInsuranceNearExpiry() && (
            <View style={[styles.statusBadge, styles.warningBadge]}>
              <Calendar size={12} color={colors.warning} />
              <Text style={[styles.statusText, styles.warningText]}>Insurance Expiring Soon</Text>
            </View>
          )}
          {isInsuranceExpired() && (
            <View style={[styles.statusBadge, styles.dangerBadge]}>
              <AlertTriangle size={12} color={colors.error} />
              <Text style={[styles.statusText, styles.dangerText]}>Insurance Expired</Text>
            </View>
          )}
          {isPucExpired() && (
            <View style={[styles.statusBadge, styles.dangerBadge]}>
              <AlertTriangle size={12} color={colors.error} />
              <Text style={[styles.statusText, styles.dangerText]}>PUC Expired</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default VehicleCard
