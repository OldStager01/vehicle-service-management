"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Plus, Search, Filter } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import VehicleCard from "../components/VehicleCard"
import { mockVehicles } from "../data/mockData"

const VehicleListScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterVisible, setFilterVisible] = useState(false)
  const [vehicleType, setVehicleType] = useState<string | null>(null)

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = vehicleType ? vehicle.type === vehicleType : true

    return matchesSearch && matchesType
  })

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
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: -20,
      padding: 12,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    filterButton: {
      marginLeft: 8,
      padding: 4,
    },
    content: {
      flex: 1,
      padding: 16,
      paddingTop: 24,
    },
    filterContainer: {
      flexDirection: "row",
      marginBottom: 16,
      justifyContent: "space-between",
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    },
    filterChipText: {
      fontSize: 14,
      fontWeight: "500",
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

  const renderFilterChip = (type: string, label: string) => {
    const isActive = vehicleType === type
    return (
      <TouchableOpacity
        style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
        onPress={() => setVehicleType(isActive ? null : type)}
      >
        <Text style={[styles.filterChipText, isActive ? styles.activeFilterChipText : styles.inactiveFilterChipText]}>
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Vehicles</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vehicles..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(!filterVisible)}>
          <Filter size={20} color={filterVisible || vehicleType ? colors.primary : colors.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {filterVisible && (
          <View style={styles.filterContainer}>
            {renderFilterChip("car", "Cars")}
            {renderFilterChip("bike", "Bikes")}
            {renderFilterChip("scooter", "Scooters")}
          </View>
        )}

        {filteredVehicles.length > 0 ? (
          <FlatList
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VehicleCard vehicle={item} />}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No vehicles found. Try adjusting your search or filters.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddEditVehicle" as never)}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default VehicleListScreen
