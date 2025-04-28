import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Car,
  DollarSign,
  Bell,
  Calendar,
  PenTool,
  ChevronRight,
} from "lucide-react-native";
import { useVehicles, useExpenses, useReminders } from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    vehicles,
    loading: loadingVehicles,
    refresh: refreshVehicles,
  } = useVehicles();
  const {
    expenses,
    loading: loadingExpenses,
    refresh: refreshExpenses,
  } = useExpenses();
  const {
    reminders,
    loading: loadingReminders,
    refresh: refreshReminders,
  } = useReminders();

  const [refreshing, setRefreshing] = React.useState(false);

  const loading = loadingVehicles || loadingExpenses || loadingReminders;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refreshVehicles(),
      refreshExpenses(),
      refreshReminders(),
    ]);
    setRefreshing(false);
  }, [refreshVehicles, refreshExpenses, refreshReminders]);

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getUpcomingReminders = () => {
    return reminders
      .filter((reminder) => !reminder.completed)
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 3);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
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

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.displayName || "User"}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Car size={24} color="#3b82f6" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{vehicles.length}</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <DollarSign size={24} color="#ef4444" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {formatCurrency(getTotalExpenses())}
            </Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Bell size={24} color="#f59e0b" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>
              {reminders.filter((r) => !r.completed).length}
            </Text>
            <Text style={styles.statLabel}>Active Reminders</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Vehicles</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Vehicles")}>
            <Text style={styles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {vehicles.length === 0 ? (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => navigation.navigate("AddEditVehicle", {})}
          >
            <Car size={24} color="#64748b" />
            <Text style={styles.emptyText}>Add your first vehicle</Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.vehiclesScroll}
          >
            {vehicles.slice(0, 5).map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={styles.vehicleCard}
                onPress={() =>
                  navigation.navigate("ServiceHistory", {
                    vehicleId: vehicle.id || "",
                    vehicleName: `${vehicle.make} ${vehicle.model}`,
                  })
                }
              >
                <View style={styles.vehicleCardContent}>
                  <View style={styles.vehicleIconContainer}>
                    <Car size={24} color="#3b82f6" />
                  </View>
                  <Text style={styles.vehicleName}>
                    {vehicle.make} {vehicle.model}
                  </Text>
                  <Text style={styles.vehiclePlate}>
                    {vehicle.licensePlate}
                  </Text>
                </View>
                <View style={styles.vehicleCardFooter}>
                  <ChevronRight size={18} color="#94a3b8" />
                </View>
              </TouchableOpacity>
            ))}
            {vehicles.length > 0 && (
              <TouchableOpacity
                style={[styles.vehicleCard, styles.addVehicleCard]}
                onPress={() => navigation.navigate("AddEditVehicle", {})}
              >
                <View style={styles.addVehicleContent}>
                  <Text style={styles.addVehicleText}>Add New Vehicle</Text>
                </View>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Reminders")}>
            <Text style={styles.sectionLink}>See All</Text>
          </TouchableOpacity>
        </View>

        {getUpcomingReminders().length === 0 ? (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => navigation.navigate("Reminders")}
          >
            <Bell size={24} color="#64748b" />
            <Text style={styles.emptyText}>No upcoming reminders</Text>
          </TouchableOpacity>
        ) : (
          getUpcomingReminders().map((reminder) => (
            <TouchableOpacity
              key={reminder.id}
              style={styles.reminderCard}
              onPress={() => navigation.navigate("Reminders")}
            >
              <View style={styles.reminderDateContainer}>
                <Calendar size={24} color="#3b82f6" />
              </View>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <View style={styles.reminderDetails}>
                  <Text style={styles.reminderVehicle}>
                    {getVehicleName(reminder.vehicleId)}
                  </Text>
                  <Text style={styles.reminderDate}>
                    {formatDate(reminder.dueDate)}
                  </Text>
                </View>
              </View>
              <View style={styles.reminderStatusContainer}>
                <Text
                  style={[
                    styles.reminderStatus,
                    getDaysUntilDue(reminder.dueDate) <= 0
                      ? styles.overdueStatus
                      : getDaysUntilDue(reminder.dueDate) <= 7
                      ? styles.upcomingStatus
                      : styles.futureStatus,
                  ]}
                >
                  {getDaysUntilDue(reminder.dueDate) <= 0
                    ? "Overdue"
                    : getDaysUntilDue(reminder.dueDate) === 1
                    ? "1 day"
                    : `${getDaysUntilDue(reminder.dueDate)} days`}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("AddEditVehicle", {})}
        >
          <Car size={24} color="#fff" />
          <Text style={styles.actionText}>Add Vehicle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#10b981" }]}
          onPress={() => navigation.navigate("Expenses")}
        >
          <DollarSign size={24} color="#fff" />
          <Text style={styles.actionText}>Track Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#f59e0b" }]}
          onPress={() =>
            navigation.navigate("WorkshopBooking", {
              vehicleId: vehicles.length > 0 ? vehicles[0].id || "" : "",
              vehicleName:
                vehicles.length > 0
                  ? `${vehicles[0].make} ${vehicles[0].model}`
                  : "",
            })
          }
        >
          <PenTool size={24} color="#fff" />
          <Text style={styles.actionText}>Book Service</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: "#3b82f6",
    padding: 24,
    paddingTop: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: "#e0f2fe",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: -20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statInfo: {},
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  sectionLink: {
    fontSize: 14,
    color: "#3b82f6",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
  vehiclesScroll: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  vehicleCard: {
    backgroundColor: "#fff",
    width: 160,
    height: 160,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  vehicleCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  vehicleCardFooter: {
    height: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  addVehicleCard: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addVehicleContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  addVehicleText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  reminderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reminderDateContainer: {
    marginRight: 16,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  reminderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reminderVehicle: {
    fontSize: 14,
    color: "#64748b",
  },
  reminderDate: {
    fontSize: 14,
    color: "#64748b",
  },
  reminderStatusContainer: {
    marginLeft: 8,
  },
  reminderStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
  },
  overdueStatus: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
  },
  upcomingStatus: {
    backgroundColor: "#fef3c7",
    color: "#f59e0b",
  },
  futureStatus: {
    backgroundColor: "#dbeafe",
    color: "#3b82f6",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default HomeScreen;
