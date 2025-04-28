import type { Vehicle, ServiceRecord, Expense, Reminder, Workshop } from "../types"

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "My Honda City",
    type: "car",
    make: "Honda",
    model: "City",
    year: 2020,
    registrationNumber: "MH02AB1234",
    purchaseDate: "2020-05-15",
    insuranceExpiry: "2023-05-14",
    pucExpiry: "2023-01-15",
    warrantyEnd: "2025-05-14",
    color: "#3b82f6",
  },
  {
    id: "2",
    name: "Royal Enfield",
    type: "bike",
    make: "Royal Enfield",
    model: "Classic 350",
    year: 2021,
    registrationNumber: "MH02CD5678",
    purchaseDate: "2021-03-10",
    insuranceExpiry: "2023-03-09",
    pucExpiry: "2023-02-10",
    warrantyEnd: "2023-03-09",
    color: "#ef4444",
  },
  {
    id: "3",
    name: "Family Car",
    type: "car",
    make: "Hyundai",
    model: "Creta",
    year: 2019,
    registrationNumber: "MH02EF9012",
    purchaseDate: "2019-11-20",
    insuranceExpiry: "2022-11-19",
    pucExpiry: "2022-12-20",
    warrantyEnd: "2024-11-19",
    color: "#22c55e",
  },
]

export const mockServiceRecords: ServiceRecord[] = [
  {
    id: "1",
    vehicleId: "1",
    date: "2022-11-15",
    type: "regular",
    description: "Regular service - Oil change, filter replacement",
    workshop: "Honda Service Center",
    cost: 3500,
    odometer: 15000,
  },
  {
    id: "2",
    vehicleId: "1",
    date: "2022-05-20",
    type: "regular",
    description: "Regular service - Oil change, brake check",
    workshop: "Honda Service Center",
    cost: 2800,
    odometer: 10000,
  },
  {
    id: "3",
    vehicleId: "2",
    date: "2022-09-05",
    type: "repair",
    description: "Chain replacement and adjustment",
    workshop: "Royal Enfield Service",
    cost: 1200,
    odometer: 8000,
  },
  {
    id: "4",
    vehicleId: "3",
    date: "2022-10-10",
    type: "emergency",
    description: "Battery replacement",
    workshop: "Roadside Assistance",
    cost: 5500,
    odometer: 25000,
    notes: "Emergency service call",
  },
]

export const mockExpenses: Expense[] = [
  {
    id: "1",
    vehicleId: "1",
    date: "2022-12-01",
    category: "fuel",
    amount: 1500,
    description: "Petrol refill",
    odometer: 16500,
  },
  {
    id: "2",
    vehicleId: "1",
    date: "2022-11-15",
    category: "maintenance",
    amount: 3500,
    description: "Regular service",
    odometer: 15000,
  },
  {
    id: "3",
    vehicleId: "2",
    date: "2022-11-25",
    category: "fuel",
    amount: 500,
    description: "Petrol refill",
    odometer: 9000,
  },
  {
    id: "4",
    vehicleId: "3",
    date: "2022-11-10",
    category: "insurance",
    amount: 12000,
    description: "Annual insurance renewal",
  },
]

export const mockReminders: Reminder[] = [
  {
    id: "1",
    vehicleId: "1",
    title: "Insurance Renewal",
    description: "Renew insurance for Honda City",
    date: "2023-05-14",
    type: "insurance",
    status: "upcoming",
  },
  {
    id: "2",
    vehicleId: "1",
    title: "PUC Check",
    description: "Get PUC certificate renewed",
    date: "2023-01-15",
    type: "puc",
    status: "upcoming",
  },
  {
    id: "3",
    vehicleId: "2",
    title: "Regular Service",
    description: "10,000 km service due",
    date: "2022-12-10",
    type: "service",
    status: "overdue",
  },
  {
    id: "4",
    vehicleId: "3",
    title: "Insurance Renewal",
    description: "Renew insurance for Hyundai Creta",
    date: "2022-11-19",
    type: "insurance",
    status: "overdue",
  },
]

export const mockWorkshops: Workshop[] = [
  {
    id: "1",
    name: "Honda Authorized Service Center",
    address: "123 Main St, Mumbai",
    phone: "+91 9876543210",
    rating: 4.5,
    services: ["Regular Service", "Repairs", "Body Work"],
    distance: 2.5,
  },
  {
    id: "2",
    name: "Royal Enfield Service",
    address: "456 Park Ave, Mumbai",
    phone: "+91 9876543211",
    rating: 4.2,
    services: ["Regular Service", "Repairs", "Customization"],
    distance: 3.8,
  },
  {
    id: "3",
    name: "Quick Service Center",
    address: "789 Market St, Mumbai",
    phone: "+91 9876543212",
    rating: 3.8,
    services: ["Regular Service", "Oil Change", "Tire Replacement"],
    distance: 1.2,
  },
  {
    id: "4",
    name: "Premium Auto Care",
    address: "101 Lake Rd, Mumbai",
    phone: "+91 9876543213",
    rating: 4.7,
    services: ["Premium Service", "Detailing", "Advanced Diagnostics"],
    distance: 5.0,
  },
]

export const mockUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543214",
  notificationPreferences: {
    email: true,
    push: true,
    reminderDays: 7,
  },
}

interface UserProfile {
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
