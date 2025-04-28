import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CalendarIcon, MapPin, ArrowRight, Car, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useVehicles } from '../hooks/useFirestore';
import { Picker } from '@react-native-picker/picker';
import { Service } from '../models/Service';
import { useServices } from '../hooks/useFirestore';

const WorkshopBookingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { vehicleId: routeVehicleId, vehicleName } = route.params as { vehicleId: string, vehicleName: string };
  
  const { vehicles } = useVehicles();
  const { addService } = useServices(routeVehicleId);
  
  const [vehicleId, setVehicleId] = useState(routeVehicleId || '');
  const [serviceType, setServiceType] = useState('Regular Service');
  const [serviceDate, setServiceDate] = useState(new Date());
  const [serviceTime, setServiceTime] = useState(new Date());
  const [workshopName, setWorkshopName] = useState('');
  const [notes, setNotes] = useState('');
  const [mileage, setMileage] = useState('');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (routeVehicleId) {
      setVehicleId(routeVehicleId);
    } else if (vehicles.length > 0) {
      setVehicleId(vehicles[0].id || '');
    }
  }, [routeVehicleId, vehicles]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setServiceDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setServiceTime(selectedTime);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBookService = async () => {
    if (!vehicleId || !serviceType || !workshopName || !mileage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(mileage)) || Number(mileage) < 0) {
      Alert.alert('Error', 'Please enter a valid mileage');
      return;
    }

    // Combine date and time
    const combinedDateTime = new Date(serviceDate);
    combinedDateTime.setHours(
      serviceTime.getHours(),
      serviceTime.getMinutes()
    );

    try {
      setLoading(true);

      // Create a service booking record
      const serviceData: Partial<Service> = {
        vehicleId,
        serviceType,
        serviceDate: combinedDateTime,
        mileage: Number(mileage),
        cost: 0, // Cost will be updated after service
        workshopName,
        notes: notes || undefined,
      };

      await addService(serviceData as any);

      Alert.alert(
        'Booking Successful',
        `Your ${serviceType} has been booked at ${workshopName} for ${formatDate(combinedDateTime)} at ${formatTime(combinedDateTime)}.`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const serviceTypes = [
    'Regular Service',
    'Oil Change',
    'Brake Service',
    'Tire Replacement',
    'Battery Replacement',
    'Air Conditioning',
    'Engine Repair',
    'Transmission Service',
    'Other'
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formTitle}>
          <Text style={styles.title}>Book Workshop Service</Text>
          <Text style={styles.subtitle}>Schedule a service for your vehicle</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle *</Text>
          {vehicles.length > 0 ? (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={vehicleId}
                onValueChange={(value) => setVehicleId(value)}
                style={styles.picker}
              >
                {vehicles.map((vehicle) => (
                  <Picker.Item 
                    key={vehicle.id} 
                    label={`${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`} 
                    value={vehicle.id} 
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <View style={styles.noVehiclesContainer}>
              <Car size={24} color="#64748b" />
              <Text style={styles.noVehiclesText}>No vehicles found. Please add a vehicle first.</Text>
            </View>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Service Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={serviceType}
              onValueChange={(value) => setServiceType(value)}
              style={styles.picker}
            >
              {serviceTypes.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Mileage (km) *</Text>
          <TextInput
            style={styles.input}
            value={mileage}
            onChangeText={setMileage}
            placeholder="e.g., 25000"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Workshop Name *</Text>
          <TextInput
            style={styles.input}
            value={workshopName}
            onChangeText={setWorkshopName}
            placeholder="e.g., City Auto Service"
          />
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {formatDate(serviceDate)}
              </Text>
              <CalendarIcon size={18} color="#64748b" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={serviceDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Time *</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {formatTime(serviceTime)}
              </Text>
              <Clock size={18} color="#64748b" />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={serviceTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any special requirements or notes..."
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, vehicles.length === 0 && styles.disabledButton]}
          onPress={handleBookService}
          disabled={loading || vehicles.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Book Service</Text>
              <ArrowRight size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  form: {
    padding: 16,
  },
  formTitle: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#334155',
  },
  input: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  datePickerButton: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3b82f6',
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  noVehiclesContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noVehiclesText: {
    color: '#ef4444',
    fontSize: 14,
    marginLeft: 12,
  },
});

export default WorkshopBookingScreen;