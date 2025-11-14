// Type definitions for the delivery tracking system

export interface Rider {
  id: string;
  riderId: string;
  name: string;
  phone: string;
  zone?: string[];
  active: boolean;
  joinedDate: string;
  trips?: string[];
  dailySummaries?: string[];
  periods?: string[];
}

export interface Zone {
  id: string;
  zoneName: string;
  riders?: string[];
  defaultDistance?: number;
  coordinates?: string;
  tripsPickup?: string[];
  tripsDelivery?: string[];
}

export interface Trip {
  id: string;
  tripId: number;
  rider: string[];
  date: string;
  period?: string;
  pickupLocation?: string[];
  deliveryLocation?: string[];
  pickupTime?: string;
  arrivalTime?: string;
  deliveryTimeRider?: string;
  deliveryTimeCustomer?: string;
  distance?: number;
  expectedDeliveryTime?: number;
  customerConfirmed?: boolean;
  notes?: string;
  dailySummaries?: string[];
}

export interface DailySummary {
  id: string;
  summaryId: number;
  date: string;
  rider: string[];
  trips?: string[];
  totalTrips?: number;
  punctualDays?: number;
  reportingTime?: string;
}

export interface PeriodReport {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  riders?: string[];
  averagePeriodScore?: number;
  export?: any[];
}

export interface PerformanceMetrics {
  workPeriod: string;
  averageRideScore: number;
  totalTrips: number;
  topDay: {
    date: string;
    score: number;
  };
  mostFrequentZone: string;
  punctuality: {
    isPunctual: boolean;
    reportsBefore830: boolean;
    punctualDaysCount: number;
    totalDays: number;
  };
  availability: {
    isActive: boolean;
    activeDays: number;
    totalWorkdays: number;
  };
  overallRating: number;
}

export interface TripWithDetails extends Trip {
  riderName?: string;
  pickupZoneName?: string;
  deliveryZoneName?: string;
  onTimeScore?: number;
  availabilityScore?: number;
  tripScore?: number;
}

export interface DayPerformance {
  date: string;
  trips: TripWithDetails[];
  score: number;
  punctual: boolean;
  reportingTime?: string;
}
