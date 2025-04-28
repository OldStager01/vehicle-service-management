import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Switch
} from 'react-native';
import { Plus, Calendar, Clock, CheckSquare, FileText, Bell, Edit, Trash2 } from 'lucide-react-native';
import { useReminders, useVehicles } from '../hooks/useFirestore';
import { Reminder } from '../models/Reminder';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const RemindersScreen = () => {
  const { vehicles } = useVehicles();
  const { reminders, loading, error, refresh, addReminder, updateReminder, deleteReminder } = useReminders();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  
  // Form fields
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [reminderType, setReminderType] = useState<'service' | 'insurance' | 'tax' | 'other'>('service');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [notifyBefore, setNotifyBefore] = useState('7');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const resetForm = () => {
    setSelectedVehicleId(vehicles.length > 0 ? vehicles[0].id || '' : '');
    setReminderType('service');
    setTitle('');
    setDueDate(new Date());
    setNotifyBefore('7');
    setNotes('');
    setCompleted(false);
    setEditingReminder(null);
  };

  const handleOpenModal = (reminder?: Reminder) => {
    resetForm();
    
    if (reminder) {
      setEditingReminder(reminder);
      setSelectedVehicleId(reminder.vehicleId);
      setReminderType(reminder.reminderType);
      setTitle(reminder.title);
      setDueDate(new Date(reminder.dueDate));
      setNotifyBefore((reminder.notifyBefore || 7).toString());
      setNotes(reminder.notes || '');
      setCompleted(reminder.completed);
    } else if (vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id || '');
    }
    
    setModalVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSaveReminder = async () => {
    // Validate inputs
    if (!selectedVehicleId || !title) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    try {
      const reminderData: Partial<Reminder> = {
        vehicleId: selectedVehicleId,
        reminderType,
        title,
        dueDate,
        notifyBefore: parseInt(notifyBefore),
        notes: notes || undefined,
        completed,
      };
      
      if (editingReminder?.id) {
        await updateReminder(editingReminder.id, reminderData);
        Alert.alert('Success', 'Reminder updated successfully');
      } else {
        await addReminder(reminderData as any);
        Alert.alert('Success', 'Reminder added successfully');
      }
      
      setModalVisible(false);
      resetForm();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    try {
      await updateReminder(reminder.id || '', { 
        completed: !reminder.completed,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmDeleteReminder = (id: string, title: string) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete the reminder "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => handleDeleteReminder(id),
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteReminder(id);
      Alert.alert('Success', 'Reminder deleted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const getReminderStatusStyle = (reminder: Reminder) => {
    if (reminder.completed) {
      return styles.statusCompleted;
    }
    
    const daysLeft = getDaysUntilDue(reminder.dueDate);
    
    if (daysLeft < 0) {
      return styles.statusOverdue;
    }
    
    if (daysLeft <= 7) {
      return styles.statusUpcoming;
    }
    
    return styles.statusFuture;
  };

  const getReminderStatusText = (reminder: Reminder) => {
    if (reminder.completed) {
      return 'Completed';
    }
    
    const daysLeft = getDaysUntilDue(reminder.dueDate);
    
    if (daysLeft < 0) {
      return `Overdue by ${Math.abs(daysLeft)} days`;
    }
    
    if (daysLeft === 0) {
      return 'Due today';
    }
    
    return `Due in ${daysLeft} days`;
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
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
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
      ) : reminders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No reminders set yet</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => handleOpenModal()}>
            <Text style={styles.emptyButtonText}>Add First Reminder</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reminders.sort((a, b) => {
            // Sort by completion status first
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            
            // Then sort by due date
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          })}
          keyExtractor={(item) => item.id || ''}
          renderItem={({ item }) => (
            <View style={[styles.card, item.completed && styles.completedCard]}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => handleToggleComplete(item)}
              >
                <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                  {item.completed && <CheckSquare size={20} color="#fff" />}
                </View>
              </TouchableOpacity>

              <View style={styles.reminderContent}>
                <View style={styles.reminderHeader}>
                  <Text style={[styles.reminderTitle, item.completed && styles.completedText]}>
                    {item.title}
                  </Text>
                  <View style={[styles.statusBadge, getReminderStatusStyle(item)]}>
                    <Text style={styles.statusText}>{getReminderStatusText(item)}</Text>
                  </View>
                </View>

                <View style={styles.reminderDetails}>
                  <Text style={styles.vehicleInfo}>{getVehicleName(item.vehicleId)}</Text>
                  <View style={styles.dateContainer}>
                    <Calendar size={14} color="#64748b" />
                    <Text style={styles.dateText}>{formatDate(item.dueDate)}</Text>
                  </View>
                </View>

                {item.notes && (
                  <Text style={styles.notes}>{item.notes}</Text>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenModal(item)}
                  >
                    <Edit size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => confirmDeleteReminder(item.id || '', item.title)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                    <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
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
              {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
            </Text>

            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle *</Text>
                {vehicles.length > 0 ? (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedVehicleId}
                      onValueChange={(itemValue) => setSelectedVehicleId(itemValue)}
                      style={styles.picker}
                    >
                      {vehicles.map(vehicle => (
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
                    <Text style={styles.noVehiclesText}>No vehicles found. Please add a vehicle first.</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reminder Type *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={reminderType}
                    onValueChange={(itemValue) => setReminderType(itemValue as any)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Service" value="service" />
                    <Picker.Item label="Insurance" value="insurance" />
                    <Picker.Item label="Tax" value="tax" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="e.g., Oil Change, Insurance Renewal"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Due Date *</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerText}>
                    {formatDate(dueDate)}
                  </Text>
                  <Calendar size={18} color="#64748b" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notify Before (days)</Text>
                <TextInput
                  style={styles.input}
                  value={notifyBefore}
                  onChangeText={setNotifyBefore}
                  placeholder="e.g., 7"
                  keyboardType="numeric"
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

              {editingReminder && (
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Mark as Completed</Text>
                  <Switch
                    value={completed}
                    onValueChange={setCompleted}
                    trackColor={{ false: '#cbd5e1', true: '#93c5fd' }}
                    thumbColor={completed ? '#3b82f6' : '#f4f4f5'}
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, vehicles.length === 0 && styles.disabledButton]}
                onPress={handleSaveReminder}
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
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
  },
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#f8fafc',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#94a3b8',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  reminderContent: {
    flex: 1,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusOverdue: {
    backgroundColor: '#fee2e2',
  },
  statusUpcoming: {
    backgroundColor: '#fef3c7',
  },
  statusFuture: {
    backgroundColor: '#dbeafe',
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
  },
  reminderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontWeight: '500',
    marginBottom: 6,
    color: '#334155',
  },
  input: {
    backgroundColor: '#f8fafc',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  datePickerButton: {
    backgroundColor: '#f8fafc',
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noVehiclesContainer: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noVehiclesText: {
    color: '#ef4444',
    textAlign: 'center',
  }
});

export default RemindersScreen;