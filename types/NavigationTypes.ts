import type { Vehicle } from "./index";

/**
 * Root Stack Navigator Param List
 * Defines the parameters for each screen in the stack navigator
 */
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  AddEditVehicle: { vehicle?: Vehicle };
  ServiceHistory: { vehicleId: string; vehicleName: string };
  WorkshopBooking: { vehicleId: string; vehicleName: string };
};

/**
 * Main Tab Navigator Param List
 * Defines the parameters for each screen in the bottom tab navigator
 */
export type MainTabParamList = {
  Home: undefined;
  Vehicles: undefined;
  Expenses: undefined;
  Reminders: undefined;
  Settings: undefined;
};

// Type for navigation prop in functional components
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
