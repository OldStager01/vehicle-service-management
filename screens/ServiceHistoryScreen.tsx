"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useRoute } from "@react-navigation/native"
import { Plus, Calendar, Wrench, ArrowDown, ArrowUp } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import ServiceHistoryCard from "../components/ServiceHistoryCard"
import { mockServiceRecords, mockVehicles } from "../data/mockData"
import type { Vehicle } from "../types"

const ServiceHistoryScreen = () => {
  const route = useRoute()
  const { colors } = useTheme()
  const vehicleId = (route.params as any)?.vehicleId
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const vehicle = mockVehicles.find((v) => v.id === vehicleId) as Vehicle

  const serviceRecords = mockServiceRecords
    .filter((record) => record.vehicleId === vehicleId)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    vehicleInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    vehicleImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: vehicle?.color + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    vehicleDetails: {
      flex: 1,
    },
    vehicleName: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    vehicleSubtitle: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    sortButtonText: {
      fontSize: 14,
      color: colors.primary,
      marginRight: 4,
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
    timeline: {
      position: "absolute",
      left: 18,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: colors.border,
    },
    timelineItem: {
      flexDirection: "row",
      marginBottom: 16,
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
      marginRight: 12,
      marginTop: 4,
      zIndex: 1,
    },
    timelineContent: {
      flex: 1,
      marginLeft: 12,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleImage}>
            {vehicle?.type === "car" ? (
              <Wrench size={24} color={vehicle?.color} />
            ) : (
              <Wrench size={24} color={vehicle?.color} />
            )}
          </View>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{vehicle?.name}</Text>
            <Text style={styles.vehicleSubtitle}>
              {vehicle?.make} {vehicle?.model} • {vehicle?.year}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service History</Text>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
            <Text style={styles.sortButtonText}>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</Text>
            {sortOrder === "desc" ? (
              <ArrowDown size={16} color={colors.primary} />
            ) : (
              <ArrowUp size={16} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {serviceRecords.length > 0 ? (
          <FlatList
            data={serviceRecords}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ServiceHistoryCard service={item} onPress={(id) => console.log("Service pressed:", id)} />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.muted} />
            <Text style={styles.emptyStateText}>
              No service records found for this vehicle. Add your first service record.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default ServiceHistoryScreen
