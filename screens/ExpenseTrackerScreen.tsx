"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Plus, Filter, DollarSign, Droplet, Wrench, Shield, FileText } from "lucide-react-native"
import { useTheme } from "../context/ThemeContext"
import ExpenseCard from "../components/ExpenseCard"
import { mockExpenses, mockVehicles } from "../data/mockData"

const ExpenseTrackerScreen = () => {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filterVisible, setFilterVisible] = useState(false)

  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesVehicle = selectedVehicle ? expense.vehicleId === selectedVehicle : true
    const matchesCategory = selectedCategory ? expense.category === selectedCategory : true
    return matchesVehicle && matchesCategory
  })

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const categories = [
    { id: "fuel", label: "Fuel", icon: Droplet },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "repair", label: "Repair", icon: Wrench },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "tax", label: "Tax", icon: Shield },
    { id: "other", label: "Other", icon: FileText },
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
    summaryCard: {
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
    totalAmount: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
    },
    totalLabel: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginTop: 4,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
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
        <Text style={styles.headerTitle}>Expense Tracker</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.totalAmount}>{formatCurrency(totalExpenses)}</Text>
        <Text style={styles.totalLabel}>
          {selectedVehicle || selectedCategory ? "Filtered Expenses" : "Total Expenses"}
        </Text>

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

            <Text style={styles.filterTitle}>Filter by Category</Text>
            <View style={styles.filterChipsRow}>
              {categories.map((category) => {
                const isActive = selectedCategory === category.id
                const Icon = category.icon
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
                    onPress={() => setSelectedCategory(isActive ? null : category.id)}
                  >
                    <Icon size={16} color={isActive ? "#fff" : colors.text} />
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive ? styles.activeFilterChipText : styles.inactiveFilterChipText,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

        {filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseCard expense={item} onPress={(id) => console.log("Expense pressed:", id)} />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <DollarSign size={48} color={colors.muted} />
            <Text style={styles.emptyStateText}>No expenses found. Adjust your filters or add a new expense.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default ExpenseTrackerScreen
