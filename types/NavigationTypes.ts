import type { Vehicle } from "./index"

/**
 * Root Stack Navigator Param List
 * Defines the parameters for each screen in the stack navigator
 */
export type RootStackParamList = {
  // Main tab navigator (no parameters)
  Main: undefined

  // Add/Edit Vehicle Screen
  // vehicleId is optional - if provided, edit mode; if not, add mode
  AddEditVehicle: {
    vehicleId?: string
    vehicle?: Vehicle
  }

  // Service History Screen
  // Requires vehicleId to display service history for a specific vehicle
  ServiceHistory: {
    vehicleId: string
  }

  // Workshop Booking Screen
  // vehicleId is optional - if provided, pre-selects the vehicle
  WorkshopBooking: {
    vehicleId?: string
    serviceType?: string
  }

  // Expense Detail Screen (if you want to add this in the future)
  ExpenseDetail?: {
    expenseId: string
  }

  // Service Detail Screen (if you want to add this in the future)
  ServiceDetail?: {
    serviceId: string
  }
}

/**
 * Main Tab Navigator Param List
 * Defines the parameters for each screen in the bottom tab navigator
 */
export type MainTabParamList = {
  // Home Dashboard
  Home: undefined

  // Vehicle List Screen
  Vehicles: undefined

  // Expense Tracker Screen
  Expenses: undefined

  // Reminders Screen
  Reminders: undefined

  // Settings/Profile Screen
  Settings: undefined
}

// Type for navigation prop in functional components
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
