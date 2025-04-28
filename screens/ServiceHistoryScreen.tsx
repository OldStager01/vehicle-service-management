import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  Plus,
  Edit,
  Trash2,
  CalendarIcon,
  DollarSign,
  Calendar,
  FileText,
  PenTool,
  MapPin,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useServices } from "../hooks/useFirestore";
import { Service } from "../models/Service";

const ServiceHistoryScreen = () => {
  const route = useRoute();
  const { vehicleId, vehicleName } = route.params as {
    vehicleId: string;
    vehicleName: string;
  };

  const {
    services,
    loading,
    error,
    refresh,
    addService,
    updateService,
    deleteService,
  } = useServices(vehicleId);

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [serviceType, setServiceType] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date());
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const resetForm = () => {
    setServiceType("");
    setServiceDate(new Date());
    setMileage("");
    setCost("");
    setNotes("");
    setWorkshopName("");
    setEditingService(null);
  };

  const handleOpenModal = (service?: Service) => {
    resetForm();

    if (service) {
      setEditingService(service);
      setServiceType(service.serviceType);
      setServiceDate(new Date(service.serviceDate));
      setMileage(service.mileage.toString());
      setCost(service.cost.toString());
      setNotes(service.notes || "");
      setWorkshopName(service.workshopName || "");
    }

    setModalVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setServiceDate(selectedDate);
    }
  };

  const handleSaveService = async () => {
    // Validate inputs
    if (!serviceType || !mileage || !cost) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isNaN(Number(mileage)) || Number(mileage) < 0) {
      Alert.alert("Error", "Please enter a valid mileage");
      return;
    }

    if (isNaN(Number(cost)) || Number(cost) < 0) {
      Alert.alert("Error", "Please enter a valid cost");
      return;
    }

    try {
      const serviceData: Partial<Service> = {
        serviceType,
        serviceDate,
        mileage: Number(mileage),
        cost: Number(cost),
        notes: notes || undefined,
        workshopName: workshopName || undefined,
        vehicleId,
      };

      if (editingService?.id) {
        await updateService(editingService.id, serviceData);
        Alert.alert("Success", "Service record updated successfully");
      } else {
        await addService(serviceData as any);
        Alert.alert("Success", "Service record added successfully");
      }

      setModalVisible(false);
      resetForm();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmDeleteService = (id: string, serviceType: string) => {
    Alert.alert(
      "Delete Service Record",
      `Are you sure you want to delete this ${serviceType} record?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteService(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteService(id);
      Alert.alert("Success", "Service record deleted successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Service History</Text>
          <Text style={styles.vehicleName}>{vehicleName}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : services.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PenTool size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No service records yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => handleOpenModal()}
          >
            <Text style={styles.emptyButtonText}>Add First Service Record</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={services.sort(
            (a, b) =>
              new Date(b.serviceDate).getTime() -
              new Date(a.serviceDate).getTime()
          )}
          keyExtractor={(item) => item.id || ""}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.serviceType}>{item.serviceType}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleOpenModal(item)}
                    style={styles.actionButton}
                  >
                    <Edit size={18} color="#64748b" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      confirmDeleteService(item.id || "", item.serviceType)
                    }
                    style={styles.actionButton}
                  >
                    <Trash2 size={18} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Calendar size={16} color="#64748b" />
                  <Text style={styles.infoText}>
                    {formatDate(item.serviceDate)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <DollarSign size={16} color="#64748b" />
                  <Text style={styles.infoText}>
                    {formatCurrency(item.cost)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <PenTool size={16} color="#64748b" />
                  <Text style={styles.infoText}>{item.mileage} km</Text>
                </View>
                {item.workshopName && (
                  <View style={styles.infoRow}>
                    <MapPin size={16} color="#64748b" />
                    <Text style={styles.infoText}>{item.workshopName}</Text>
                  </View>
                )}
                {item.notes && (
                  <View style={styles.notesContainer}>
                    <View style={styles.infoRow}>
                      <FileText size={16} color="#64748b" />
                      <Text style={styles.infoText}>Notes</Text>
                    </View>
                    <Text style={styles.notes}>{item.notes}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingService ? "Edit Service Record" : "Add Service Record"}
            </Text>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Type *</Text>
                <TextInput
                  style={styles.input}
                  value={serviceType}
                  onChangeText={setServiceType}
                  placeholder="e.g., Oil Change, Brake Service"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Date *</Text>
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
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mileage (km) *</Text>
                <TextInput
                  style={styles.input}
                  value={mileage}
                  onChangeText={setMileage}
                  placeholder="e.g., 25000"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Cost ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="e.g., 150"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Workshop Name</Text>
                <TextInput
                  style={styles.input}
                  value={workshopName}
                  onChangeText={setWorkshopName}
                  placeholder="e.g., Midas, Jiffy Lube"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any additional notes here"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveService}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
  },
  vehicleName: {
    fontSize: 14,
    color: "#64748b",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  cardActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  cardBody: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#334155",
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  notes: {
    marginLeft: 26,
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  modalForm: {
    paddingHorizontal: 16,
    maxHeight: 500,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    backgroundColor: "#f8fafc",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  datePickerButton: {
    backgroundColor: "#f8fafc",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: "#0f172a",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cancelButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ServiceHistoryScreen;
