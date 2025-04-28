import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Car, Plus, Info, Edit, Trash2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useVehicles } from "../hooks/useFirestore";

const VehicleListScreen = () => {
  const navigation = useNavigation();
  const { vehicles, loading, error, refresh, deleteVehicle } = useVehicles();
  const [refreshing, setRefreshing] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Vehicle data in component:", vehicles);
  }, [vehicles]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleAddVehicle = () => {
    navigation.navigate("AddEditVehicle", {});
  };

  const handleServiceHistory = (vehicleId, make, model) => {
    navigation.navigate("ServiceHistory", {
      vehicleId,
      vehicleName: `${make} ${model}`,
    });
  };

  const handleEditVehicle = (vehicle) => {
    navigation.navigate("AddEditVehicle", { vehicle });
  };

  const confirmDeleteVehicle = (id, make, model) => {
    Alert.alert(
      "Delete Vehicle",
      `Are you sure you want to delete ${make} ${model}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteVehicle(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await deleteVehicle(id);
      Alert.alert("Success", "Vehicle deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Render vehicle card
  const renderVehicleItem = ({ item }) => {
    // Ensure we have all necessary data
    const vehicleId = item?.id || "";
    const make = item?.make || "Unknown";
    const model = item?.model || "Vehicle";
    const licensePlate = item?.licensePlate || "No plate";
    const year = item?.year || "";
    const imageUrl = item?.imageUrl;

    return (
      <View style={styles.card}>
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleInfo}>
            {/* Vehicle Image */}
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.vehicleImage}
                defaultSource={require("../assets/car-placeholder.png")}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Car size={24} color="#94a3b8" />
              </View>
            )}

            {/* Vehicle Details */}
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>
                {make} {model}
              </Text>
              <Text style={styles.vehiclePlate}>{licensePlate}</Text>
              {year && <Text style={styles.vehicleYear}>{year}</Text>}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.infoButton]}
            onPress={() => handleServiceHistory(vehicleId, make, model)}
          >
            <Info size={16} color="#3b82f6" />
            <Text style={styles.actionText}>Service History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditVehicle(item)}
          >
            <Edit size={16} color="#10b981" />
            <Text style={[styles.actionText, { color: "#10b981" }]}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => confirmDeleteVehicle(vehicleId, make, model)}
          >
            <Trash2 size={16} color="#ef4444" />
            <Text style={[styles.actionText, { color: "#ef4444" }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Add Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Vehicles</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Handle Error State */}
      {error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : vehicles.length === 0 ? (
        /* Handle Empty State */
        <View style={styles.messageContainer}>
          <Car size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No vehicles added yet</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddVehicle}
          >
            <Text style={styles.buttonText}>Add Your First Vehicle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Vehicle List */
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id || Math.random().toString()}
          renderItem={renderVehicleItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <Text style={styles.countText}>
              {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}{" "}
              found
            </Text>
          }
        />
      )}
    </SafeAreaView>
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
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  listContent: {
    padding: 16,
  },
  countText: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  vehicleHeader: {
    marginBottom: 16,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    marginRight: 12,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 2,
  },
  vehicleYear: {
    fontSize: 14,
    color: "#64748b",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  infoButton: {
    backgroundColor: "#eff6ff",
  },
  editButton: {
    backgroundColor: "#ecfdf5",
  },
  deleteButton: {
    backgroundColor: "#fef2f2",
  },
  actionText: {
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 12,
    color: "#3b82f6",
  },
  messageContainer: {
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
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default VehicleListScreen;
