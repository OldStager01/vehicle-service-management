import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home, Car, DollarSign, Bell, Settings } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

// Screens
import HomeScreen from "../screens/HomeScreen";
import VehicleListScreen from "../screens/VehicleListScreen";
import AddEditVehicleScreen from "../screens/AddEditVehicleScreen";
import ServiceHistoryScreen from "../screens/ServiceHistoryScreen";
import ExpenseTrackerScreen from "../screens/ExpenseTrackerScreen";
import RemindersScreen from "../screens/RemindersScreen";
import WorkshopBookingScreen from "../screens/WorkshopBookingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// Theme and Auth Context
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Navigation Types
import type {
  RootStackParamList,
  MainTabParamList,
} from "../types/NavigationTypes";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Vehicles"
        component={VehicleListScreen}
        options={{
          tabBarIcon: ({ color }) => <Car size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseTrackerScreen}
        options={{
          tabBarIcon: ({ color }) => <DollarSign size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  // Show loading state while authentication state is being determined
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <>
      {user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddEditVehicle"
            component={AddEditVehicleScreen}
            options={({ route }: any) => ({
              title: route.params?.vehicle ? "Edit Vehicle" : "Add Vehicle",
              headerBackTitle: "Back",
            })}
          />
          <Stack.Screen
            name="ServiceHistory"
            component={ServiceHistoryScreen}
            options={{ title: "Service History" }}
          />
          <Stack.Screen
            name="WorkshopBooking"
            component={WorkshopBookingScreen}
            options={{ title: "Book Workshop" }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SafeAreaProvider style={{ paddingTop: 30 }}>
          <AppNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
