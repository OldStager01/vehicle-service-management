export interface Expense {
  id?: string;
  vehicleId: string;
  userId: string;
  expenseType: 'fuel' | 'maintenance' | 'insurance' | 'tax' | 'other';
  amount: number;
  date: Date;
  notes?: string;
  receiptUrl?: string;
  created: Date;
  updated: Date;
}