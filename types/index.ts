export interface Vehicle {
  id: string
  name: string
  type: "car" | "bike" | "scooter"
  make: string
  model: string
  year: number
  registrationNumber: string
  purchaseDate: string
  insuranceExpiry: string
  pucExpiry: string
  warrantyEnd: string
  color: string
  image?: string
}

export interface ServiceRecord {
  id: string
  vehicleId: string
  date: string
  type: "regular" | "repair" | "emergency"
  description: string
  workshop: string
  cost: number
  odometer: number
  notes?: string
}

export interface Expense {
  id: string
  vehicleId: string
  date: string
  category: "fuel" | "maintenance" | "repair" | "insurance" | "tax" | "other"
  amount: number
  description: string
  odometer?: number
}

export interface Reminder {
  id: string
  vehicleId: string
  title: string
  description?: string
  date: string
  type: "service" | "insurance" | "puc" | "tax" | "other"
  status: "upcoming" | "overdue" | "completed" | "snoozed"
  snoozedUntil?: string
}

export interface Workshop {
  id: string
  name: string
  address: string
  phone: string
  rating: number
  services: string[]
  distance?: number
}

export interface UserProfile {
  name: string
  email: string
  phone?: string
  avatar?: string
  notificationPreferences: {
    email: boolean
    push: boolean
    reminderDays: number
  }
}
