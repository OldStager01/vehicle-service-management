"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Calendar, Clock, MapPin, Star, ChevronDown, Check } from "lucide-react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useTheme } from "../context/ThemeContext"
import { mockVehicles, mockWorkshops } from "../data/mockData"

const WorkshopBookingScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { colors } = useTheme()
  const vehicleId = (route.params as any)?.vehicleId

  const [selectedVehicle, setSelectedVehicle] = useState(vehicleId || "")
  const [selectedWorkshop, setSelectedWorkshop] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [serviceType, setServiceType] = useState("")
  const [notes, setNotes] = useState("")

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [vehicleDropdownVisible, setVehicleDropdownVisible] = useState(false)
  const [workshopDropdownVisible, setWorkshopDropdownVisible] = useState(false)
  const [serviceTypeDropdownVisible, setServiceTypeDropdownVisible] = useState(false)

  const serviceTypes = [
    "Regular Service",
    "Oil Change",
    "Brake Service",
    "Tire Replacement",
    "Battery Replacement",
    "Engine Repair",
    "Other",
  ]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selectedDate) {
      setSelectedDate(selectedDate)
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios")
    if (selectedTime) {
      setSelectedTime(selectedTime)
    }
  }

  const handleBooking = () => {
    console.log("Booking workshop:", {
      vehicleId: selectedVehicle,
      workshopId: selectedWorkshop,
      date: selectedDate,
      time: selectedTime,
      serviceType,
      notes,
    })
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
    dateTimeInput: {
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
    dateTimeInputText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdown: {
      position: "relative",
    },
    dropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    dropdownText: {
      fontSize: 16,
      color: colors.text,
    },
    dropdownContent: {
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
      maxHeight: 200,
    },
    dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 4,
    },
    workshopItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    workshopName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    workshopAddress: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    workshopRating: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    workshopRatingText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 4,
    },
    workshopDistance: {
      fontSize: 14,
      color: colors.muted,
      marginLeft: 8,
    },
    bookButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 24,
    },
    bookButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
  })

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Vehicle</Text>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setVehicleDropdownVisible(!vehicleDropdownVisible)}
              >
                <Text style={styles.dropdownText}>
                  {selectedVehicle
                    ? mockVehicles.find((v) => v.id === selectedVehicle)?.name || "Select Vehicle"
                    : "Select Vehicle"}
                </Text>
                <ChevronDown size={20} color={colors.text} />
              </TouchableOpacity>

              {vehicleDropdownVisible && (
                <ScrollView style={styles.dropdownContent}>
                  {mockVehicles.map((vehicle) => (
                    <TouchableOpacity
                      key={vehicle.id}
                      style={[
                        styles.dropdownItem,
                        selectedVehicle === vehicle.id && { backgroundColor: colors.primary + "20" },
                      ]}
                      onPress={() => {
                        setSelectedVehicle(vehicle.id)
                        setVehicleDropdownVisible(false)
                      }}
                    >
                      <Text style={styles.dropdownText}>{vehicle.name}</Text>
                      {selectedVehicle === vehicle.id && <Check size={20} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Type</Text>
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setServiceTypeDropdownVisible(!serviceTypeDropdownVisible)}
              >
                <Text style={styles.dropdownText}>{serviceType || "Select Service Type"}</Text>
                <ChevronDown size={20} color={colors.text} />
              </TouchableOpacity>

              {serviceTypeDropdownVisible && (
                <ScrollView style={styles.dropdownContent}>
                  {serviceTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.dropdownItem, serviceType === type && { backgroundColor: colors.primary + "20" }]}
                      onPress={() => {
                        setServiceType(type)
                        setServiceTypeDropdownVisible(false)
                      }}
                    >
                      <Text style={styles.dropdownText}>{type}</Text>
                      {serviceType === type && <Check size={20} color={colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Date</Text>
            <TouchableOpacity style={styles.dateTimeInput} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateTimeInputText}>{formatDate(selectedDate)}</Text>
              <Calendar size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Time</Text>
            <TouchableOpacity style={styles.dateTimeInput} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateTimeInputText}>{formatTime(selectedTime)}</Text>
              <Clock size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              placeholder="Any specific issues or requests..."
              placeholderTextColor={colors.muted}
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Workshop</Text>

          {mockWorkshops.map((workshop) => (
            <TouchableOpacity
              key={workshop.id}
              style={[
                styles.workshopItem,
                selectedWorkshop === workshop.id && { backgroundColor: colors.primary + "10" },
              ]}
              onPress={() => setSelectedWorkshop(workshop.id)}
            >
              <Text style={styles.workshopName}>{workshop.name}</Text>
              <Text style={styles.workshopAddress}>
                <MapPin size={12} color={colors.muted} /> {workshop.address}
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}
              >
                <View style={styles.workshopRating}>
                  <Star size={14} color={colors.warning} fill={colors.warning} />
                  <Text style={styles.workshopRatingText}>{workshop.rating}</Text>
                  <Text style={styles.workshopDistance}>{workshop.distance} km away</Text>
                </View>
                {selectedWorkshop === workshop.id && <Check size={18} color={colors.primary} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.bookButton, (!selectedVehicle || !selectedWorkshop || !serviceType) && { opacity: 0.6 }]}
          onPress={handleBooking}
          disabled={!selectedVehicle || !selectedWorkshop || !serviceType}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker value={selectedTime} mode="time" display="default" onChange={handleTimeChange} />
      )}
    </KeyboardAvoidingView>
  )
}

export default WorkshopBookingScreen
