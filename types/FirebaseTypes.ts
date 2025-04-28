import { Vehicle } from '../models/Vehicle';
import { Service } from '../models/Service';
import { Expense } from '../models/Expense';
import { Reminder } from '../models/Reminder';

export interface FirestoreQueryOptions {
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  startAfter?: any;
}

export interface FirestoreCollections {
  vehicles: Vehicle;
  services: Service;
  expenses: Expense;
  reminders: Reminder;
}