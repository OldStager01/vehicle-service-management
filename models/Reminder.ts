export interface Reminder {
  id?: string;
  vehicleId: string;
  userId: string;
  reminderType: 'service' | 'insurance' | 'tax' | 'other';
  title: string;
  dueDate: Date;
  notifyBefore?: number; // days before to notify
  completed: boolean;
  notes?: string;
  created: Date;
  updated: Date;
}