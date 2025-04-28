"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Calendar, Car, Bike, ChevronDown, Check } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTheme } from "../context/ThemeContext"
import { mockVehicles } from "../data/mockData"
import type { Vehicle } from "../types"

const AddEditVehicleScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const vehicleId = (route.params as any)?.vehicleId
  const existingVehicle = vehicleId ? mockVehicles.find((v) => v.id === vehicleId) : null

  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({
    type: "car",
    color: "#3b82f6",
    ...existingVehicle,
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateField, setDateField] = useState<string>("")
  const [typeDropdownVisible, setTypeDropdownVisible] = useState(false)

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      setVehicle({
        ...vehicle,
        [dateField]: selectedDate.toISOString().split("T")[0],
      })
    }
  }

  const showDatepicker = (field: string) => {
    setDateField(field)
    setShowDatePicker(true)
  }

  const vehicleTypes = [
    { value: "car", label: "Car", icon: Car },
    { value: "bike", label: "Bike", icon: Bike },
    { value: "scooter", label: "Scooter", icon: Bike },
  ]

  const handleSave = () => {
    console.log("Saving vehicle:", vehicle)
    navigation.goBack()
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.muted,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    dateInput: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      justifyContent: "space-between",
    },
    dateInputText: {
      fontSize: 16,
      color: colors.text,
    },
    typeSelector: {
      position: "relative",
    },
    typeSelectorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    typeSelectorText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    typeDropdown: {
      position: "absolute",
      top: 56,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      zIndex: 10,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    typeOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 4,
    },
    colorSelector: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 8,
    },
    colorOption: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 12,
      marginBottom: 12,
      borderWidth: 2,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 24,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    halfWidth: {
      width: "48%",
    },
  })

  const colorOptions = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#22c55e", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#64748b", // slate
  ]

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. My Honda City"
              placeholderTextColor={colors.muted}
              value={vehicle.name}
              onChangeText={(text) => setVehicle({ ...vehicle, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Vehicle Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={styles.typeSelectorButton}
                onPress={() => setTypeDropdownVisible(!typeDropdownVisible)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {vehicle.type === "car" && <Car size={20} color={colors.text} />}
                  {vehicle.type === "bike" && <Bike size={20} color={colors.text} />}
                  {vehicle.type === "scooter" && <Bike size={20} color={colors.text} />}
                  <Text style={styles.typeSelectorText}>
                    {vehicleTypes.find((t) => t.value === vehicle.type)?.label || "Select Type"}
                  </Text>
                </View>
                <ChevronDown size={20} color={colors.text} />
              </TouchableOpacity>

              {typeDropdownVisible && (
                <View style={styles.typeDropdown}>
                  {vehicleTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        vehicle.type === type.value && { backgroundColor: colors.primary + "20" },
                      ]}
                      onPress={() => {
                        setVehicle({ ...vehicle, type: type.value as any })
                        setTypeDropdownVisible(false)
                      }}
                    >
                      <type.icon size={20} color={colors.text} />
                      <Text style={styles.typeSelectorText}>{type.label}</Text>
                      {vehicle.type === type.value && (
                        <Check size={20} color={colors.primary} style={{ marginLeft: "auto" }} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Make</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Honda"
                placeholderTextColor={colors.muted}
                value={vehicle.make}
                onChangeText={(text) => setVehicle({ ...vehicle, make: text })}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Model</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. City"
                placeholderTextColor={colors.muted}
                value={vehicle.model}
                onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Year</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2020"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                value={vehicle.year?.toString()}
                onChangeText={(text) => setVehicle({ ...vehicle, year: Number.parseInt(text) || undefined })}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Registration Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. MH02AB1234"
                placeholderTextColor={colors.muted}
                value={vehicle.registrationNumber}
                onChangeText={(text) => setVehicle({ ...vehicle, registrationNumber: text })}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorSelector}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    vehicle.color === color && { borderColor: colors.text },
                    vehicle.color !== color && { borderColor: "transparent" },
                  ]}
                  onPress={() => setVehicle({ ...vehicle, color })}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purchase Date</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => showDatepicker("purchaseDate")}>
              <Text style={styles.dateInputText}>
                {vehicle.purchaseDate ? formatDate(vehicle.purchaseDate) : "Select date"}
              </Text>
              <Calendar size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Insurance Expiry</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => showDatepicker("insuranceExpiry")}>
              <Text style={styles.dateInputText}>
                {vehicle.insuranceExpiry ? formatDate(vehicle.insuranceExpiry) : "Select date"}
              </Text>
              <Calendar size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PUC Expiry</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => showDatepicker("pucExpiry")}>
              <Text style={styles.dateInputText}>
                {vehicle.pucExpiry ? formatDate(vehicle.pucExpiry) : "Select date"}
              </Text>
              <Calendar size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Warranty End</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => showDatepicker("warrantyEnd")}>
              <Text style={styles.dateInputText}>
                {vehicle.warrantyEnd ? formatDate(vehicle.warrantyEnd) : "Select date"}
              </Text>
              <Calendar size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Vehicle</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={
            vehicle[dateField as keyof typeof vehicle]
              ? new Date(vehicle[dateField as keyof typeof vehicle] as string)
              : new Date()
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </KeyboardAvoidingView>
  )
}

export default AddEditVehicleScreen
