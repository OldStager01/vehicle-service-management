import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import * as firestoreService from "../firebase/firestore";
import { Vehicle } from "../models/Vehicle";
import { Service } from "../models/Service";
import { Expense } from "../models/Expense";
import { Reminder } from "../models/Reminder";

// Hook for Vehicles
export const useVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getVehicles(user.uid);
      setVehicles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (
    vehicle: Omit<Vehicle, "userId" | "created" | "updated">
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const newVehicle: Vehicle = {
        ...vehicle,
        userId: user.uid,
        created: new Date(),
        updated: new Date(),
      };

      const id = await firestoreService.addVehicle(newVehicle);
      await fetchVehicles();
      return id;
    } catch (err: any) {
      console.log(err);
      setError(err.message);
      throw err;
    }
  };

  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.updateVehicle(id, {
        ...vehicleData,
        updated: new Date(),
      });
      await fetchVehicles();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.deleteVehicle(id);
      await fetchVehicles();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    vehicles,
    loading,
    error,
    refresh: fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};

// Hook for Services
export const useServices = (vehicleId?: string) => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    if (!user || !vehicleId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getServices(vehicleId);
      setServices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, vehicleId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const addService = async (
    service: Omit<Service, "userId" | "created" | "updated">
  ) => {
    if (!user || !vehicleId)
      throw new Error("User not authenticated or vehicle not specified");

    try {
      const newService: Service = {
        ...service,
        vehicleId,
        userId: user.uid,
        created: new Date(),
        updated: new Date(),
      };

      const id = await firestoreService.addService(newService);
      await fetchServices();
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.updateService(id, {
        ...serviceData,
        updated: new Date(),
      });
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.deleteService(id);
      await fetchServices();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    refresh: fetchServices,
    addService,
    updateService,
    deleteService,
  };
};

// Hook for Expenses
export const useExpenses = (vehicleId?: string) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getExpenses(user.uid, vehicleId);
      setExpenses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, vehicleId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (
    expense: Omit<Expense, "userId" | "created" | "updated">
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const newExpense: Expense = {
        ...expense,
        userId: user.uid,
        created: new Date(),
        updated: new Date(),
      };

      const id = await firestoreService.addExpense(newExpense);
      await fetchExpenses();
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.updateExpense(id, {
        ...expenseData,
        updated: new Date(),
      });
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.deleteExpense(id);
      await fetchExpenses();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    expenses,
    loading,
    error,
    refresh: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};

// Hook for Reminders
export const useReminders = (vehicleId?: string) => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await firestoreService.getReminders(user.uid, vehicleId);
      setReminders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, vehicleId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const addReminder = async (
    reminder: Omit<Reminder, "userId" | "created" | "updated">
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const newReminder: Reminder = {
        ...reminder,
        userId: user.uid,
        created: new Date(),
        updated: new Date(),
      };

      const id = await firestoreService.addReminder(newReminder);
      await fetchReminders();
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateReminder = async (
    id: string,
    reminderData: Partial<Reminder>
  ) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.updateReminder(id, {
        ...reminderData,
        updated: new Date(),
      });
      await fetchReminders();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteReminder = async (id: string) => {
    if (!user) throw new Error("User not authenticated");

    try {
      await firestoreService.deleteReminder(id);
      await fetchReminders();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    reminders,
    loading,
    error,
    refresh: fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
  };
};
