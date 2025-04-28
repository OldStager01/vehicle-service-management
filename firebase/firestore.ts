import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
  FirestoreError,
} from "firebase/firestore";
import { firestore } from "./config";
import { Vehicle } from "../models/Vehicle";
import { Service } from "../models/Service";
import { Expense } from "../models/Expense";
import { Reminder } from "../models/Reminder";

// Generic converter functions
const fromFirestore = (data: any): any => {
  const result: any = { ...data };

  // Convert Firestore Timestamps to JS Dates
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
  });

  return result;
};

const toFirestore = (data: any): any => {
  const result: any = { ...data };

  // Remove id if it exists to prevent it being stored twice
  if (result.id) {
    delete result.id;
  }

  // Add timestamps for created/updated if they don't exist
  if (!result.created) {
    result.created = serverTimestamp();
  }
  result.updated = serverTimestamp();

  return result;
};

// Vehicles CRUD operations
export const getVehicles = async (userId: string): Promise<Vehicle[]> => {
  try {
    const q = query(
      collection(firestore, "vehicles")
      // where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...fromFirestore(data) } as Vehicle;
    });
  } catch (error: any) {
    throw new Error(`Failed to get vehicles: ${error.message}`);
  }
};

export const getVehicle = async (vehicleId: string): Promise<Vehicle> => {
  try {
    const docRef = doc(firestore, "vehicles", vehicleId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return { id: docSnap.id, ...fromFirestore(data) } as Vehicle;
    } else {
      throw new Error("Vehicle not found");
    }
  } catch (error: any) {
    throw new Error(`Failed to get vehicle: ${error.message}`);
  }
};

export const addVehicle = async (vehicle: Vehicle): Promise<string> => {
  try {
    vehicle.imageUrl = "url";
    const docRef = await addDoc(
      collection(firestore, "vehicles"),
      toFirestore(vehicle)
    );
    return docRef.id;
  } catch (error: any) {
    console.log(error);
    throw new Error(`Failed to add vehicle: ${error.message}`);
  }
};

export const updateVehicle = async (
  id: string,
  vehicle: Partial<Vehicle>
): Promise<void> => {
  try {
    const docRef = doc(firestore, "vehicles", id);
    await updateDoc(docRef, toFirestore(vehicle));
  } catch (error: any) {
    throw new Error(`Failed to update vehicle: ${error.message}`);
  }
};

export const deleteVehicle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "vehicles", id);
    await deleteDoc(docRef);
  } catch (error: any) {
    throw new Error(`Failed to delete vehicle: ${error.message}`);
  }
};

// Service History CRUD operations
export const getServices = async (vehicleId: string): Promise<Service[]> => {
  try {
    const q = query(
      collection(firestore, "services"),
      where("vehicleId", "==", vehicleId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...fromFirestore(data) } as Service;
    });
  } catch (error: any) {
    throw new Error(`Failed to get services: ${error.message}`);
  }
};

export const addService = async (service: Service): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(firestore, "services"),
      toFirestore(service)
    );
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to add service: ${error.message}`);
  }
};

export const updateService = async (
  id: string,
  service: Partial<Service>
): Promise<void> => {
  try {
    const docRef = doc(firestore, "services", id);
    await updateDoc(docRef, toFirestore(service));
  } catch (error: any) {
    throw new Error(`Failed to update service: ${error.message}`);
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "services", id);
    await deleteDoc(docRef);
  } catch (error: any) {
    throw new Error(`Failed to delete service: ${error.message}`);
  }
};

// Expenses CRUD operations
export const getExpenses = async (
  userId: string,
  vehicleId?: string
): Promise<Expense[]> => {
  try {
    let q;
    if (vehicleId) {
      q = query(
        collection(firestore, "expenses"),
        where("userId", "==", userId),
        where("vehicleId", "==", vehicleId)
      );
    } else {
      q = query(
        collection(firestore, "expenses"),
        where("userId", "==", userId)
      );
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...fromFirestore(data) } as Expense;
    });
  } catch (error: any) {
    throw new Error(`Failed to get expenses: ${error.message}`);
  }
};

export const addExpense = async (expense: Expense): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(firestore, "expenses"),
      toFirestore(expense)
    );
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to add expense: ${error.message}`);
  }
};

export const updateExpense = async (
  id: string,
  expense: Partial<Expense>
): Promise<void> => {
  try {
    const docRef = doc(firestore, "expenses", id);
    await updateDoc(docRef, toFirestore(expense));
  } catch (error: any) {
    throw new Error(`Failed to update expense: ${error.message}`);
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "expenses", id);
    await deleteDoc(docRef);
  } catch (error: any) {
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
};

// Reminders CRUD operations
export const getReminders = async (
  userId: string,
  vehicleId?: string
): Promise<Reminder[]> => {
  try {
    let q;
    if (vehicleId) {
      q = query(
        collection(firestore, "reminders"),
        where("userId", "==", userId),
        where("vehicleId", "==", vehicleId)
      );
    } else {
      q = query(
        collection(firestore, "reminders"),
        where("userId", "==", userId)
      );
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...fromFirestore(data) } as Reminder;
    });
  } catch (error: any) {
    throw new Error(`Failed to get reminders: ${error.message}`);
  }
};

export const addReminder = async (reminder: Reminder): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(firestore, "reminders"),
      toFirestore(reminder)
    );
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Failed to add reminder: ${error.message}`);
  }
};

export const updateReminder = async (
  id: string,
  reminder: Partial<Reminder>
): Promise<void> => {
  try {
    const docRef = doc(firestore, "reminders", id);
    await updateDoc(docRef, toFirestore(reminder));
  } catch (error: any) {
    throw new Error(`Failed to update reminder: ${error.message}`);
  }
};

export const deleteReminder = async (id: string): Promise<void> => {
  try {
    const docRef = doc(firestore, "reminders", id);
    await deleteDoc(docRef);
  } catch (error: any) {
    throw new Error(`Failed to delete reminder: ${error.message}`);
  }
};
