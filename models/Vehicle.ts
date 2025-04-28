export interface Vehicle {
  id?: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  fuelType?: string;
  mileage?: number;
  purchaseDate?: Date;
  imageUrl?: string;
  created: Date;
  updated: Date;
}