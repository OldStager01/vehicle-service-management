export interface Service {
  id?: string;
  vehicleId: string;
  userId: string;
  serviceType: string;
  serviceDate: Date;
  mileage: number;
  cost: number;
  notes?: string;
  workshopName?: string;
  receiptUrl?: string;
  created: Date;
  updated: Date;
}