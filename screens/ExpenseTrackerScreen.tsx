import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Plus,
  CalendarIcon,
  DollarSign,
  FileText,
  Tag,
  Edit,
  Trash2,
} from "lucide-react-native";
import { useExpenses } from "../hooks/useFirestore";
import { useVehicles } from "../hooks/useFirestore";
import { Expense } from "../models/Expense";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const ExpenseTrackerScreen = () => {
  const { vehicles } = useVehicles();
  const {
    expenses,
    loading,
    error,
    refresh,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form fields
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [expenseType, setExpenseType] = useState<
    "fuel" | "maintenance" | "insurance" | "tax" | "other"
  >("fuel");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const resetForm = () => {
    setSelectedVehicleId(vehicles.length > 0 ? vehicles[0].id || "" : "");
    setExpenseType("fuel");
    setAmount("");
    setDate(new Date());
    setNotes("");
    setEditingExpense(null);
  };

  const handleOpenModal = (expense?: Expense) => {
    resetForm();

    if (expense) {
      setEditingExpense(expense);
      setSelectedVehicleId(expense.vehicleId);
      setExpenseType(expense.expenseType);
      setAmount(expense.amount.toString());
      setDate(new Date(expense.date));
      setNotes(expense.notes || "");
    } else if (vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id || "");
    }

    setModalVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSaveExpense = async () => {
    // Validate inputs
    if (!selectedVehicleId || !amount) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      const expenseData: Partial<Expense> = {
        vehicleId: selectedVehicleId,
        expenseType,
        amount: parseFloat(amount),
        date,
        notes: notes || undefined,
      };

      if (editingExpense?.id) {
        await updateExpense(editingExpense.id, expenseData);
        Alert.alert("Success", "Expense updated successfully");
      } else {
        await addExpense(expenseData as any);
        Alert.alert("Success", "Expense added successfully");
      }

      setModalVisible(false);
      resetForm();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const confirmDeleteExpense = (id: string, type: string) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete this ${type} expense?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteExpense(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      Alert.alert("Success", "Expense deleted successfully");
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

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

  const getExpenseTypeIcon = (type: string) => {
    switch (type) {
      case "fuel":
        return <DollarSign size={24} color="#ef4444" />;
      case "maintenance":
        return <DollarSign size={24} color="#3b82f6" />;
      case "insurance":
        return <DollarSign size={24} color="#10b981" />;
      case "tax":
        return <DollarSign size={24} color="#f59e0b" />;
      default:
        return <DollarSign size={24} color="#8b5cf6" />;
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
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
        <Text style={styles.title}>Expense Tracker</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Total Expenses</Text>
        <Text style={styles.summaryAmount}>
          {formatCurrency(getTotalExpenses())}
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : expenses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <DollarSign size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No expenses recorded yet</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => handleOpenModal()}
          >
            <Text style={styles.emptyButtonText}>Add First Expense</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={expenses.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          keyExtractor={(item) => item.id || ""}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleOpenModal(item)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.expenseTypeContainer}>
                  {getExpenseTypeIcon(item.expenseType)}
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseType}>
                      {item.expenseType.charAt(0).toUpperCase() +
                        item.expenseType.slice(1)}
                    </Text>
                    <Text style={styles.vehicleInfo}>
                      {getVehicleName(item.vehicleId)}
                    </Text>
                  </View>
                </View>
                <View style={styles.amountContainer}>
                  <Text style={styles.amount}>
                    {formatCurrency(item.amount)}
                  </Text>
                  <Text style={styles.date}>{formatDate(item.date)}</Text>
                </View>
              </View>

              {item.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notes}>{item.notes}</Text>
                </View>
              )}

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    confirmDeleteExpense(item.id || "", item.expenseType)
                  }
                >
                  <Trash2 size={16} color="#ef4444" />
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </Text>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle *</Text>
                {vehicles.length > 0 ? (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedVehicleId}
                      onValueChange={(itemValue) =>
                        setSelectedVehicleId(itemValue)
                      }
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
                    <Text style={styles.noVehiclesText}>
                      No vehicles found. Please add a vehicle first.
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expense Type *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={expenseType}
                    onValueChange={(itemValue) =>
                      setExpenseType(itemValue as any)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Fuel" value="fuel" />
                    <Picker.Item label="Maintenance" value="maintenance" />
                    <Picker.Item label="Insurance" value="insurance" />
                    <Picker.Item label="Tax" value="tax" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Amount ($) *</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="e.g., 45.50"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date *</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>{formatDate(date)}</Text>
                  <CalendarIcon size={18} color="#64748b" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
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
                style={[
                  styles.saveButton,
                  vehicles.length === 0 && styles.disabledButton,
                ]}
                onPress={handleSaveExpense}
                disabled={vehicles.length === 0}
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    backgroundColor: "#3b82f6",
    padding: 20,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 14,
    color: "#e0f2fe",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
  },
  expenseTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenseDetails: {
    marginLeft: 12,
  },
  expenseType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  vehicleInfo: {
    fontSize: 13,
    color: "#64748b",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: "#64748b",
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  notes: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  cardActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
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
  pickerContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  picker: {
    height: 48,
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
  disabledButton: {
    backgroundColor: "#93c5fd",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noVehiclesContainer: {
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  noVehiclesText: {
    color: "#ef4444",
    textAlign: "center",
  },
});

export default ExpenseTrackerScreen;
