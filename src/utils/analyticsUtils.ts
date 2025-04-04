import { supabase } from '@/integrations/supabase/client';

// Define the analytics summary interface
export interface AnalyticsSummary {
  totalProperties?: number;
  totalTenants?: number;
  occupancyRate?: number;
  totalRevenue?: number;
  pendingPayments?: number;
  revenueByMonth?: {
    month: string;
    paid: number;
    pending: number;
  }[];
  occupancyByProperty?: {
    property: string;
    occupied: number;
    total: number;
  }[];
  maintenanceStats?: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

/**
 * Get overview metrics for a landlord
 */
export async function getLandlordMetrics(landlordId: string): Promise<PropertyMetrics> {
  try {
    // Get properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', landlordId);

    if (propertiesError) throw propertiesError;

    const totalProperties = properties?.length || 0;
    const totalRooms = properties?.reduce((acc, property) => acc + property.bedrooms, 0) || 0;
    const occupancyRate = 75; // Demo value
    const averageRent = 850; // Demo value

    return {
      totalProperties,
      totalRooms,
      occupancyRate,
      averageRent
    };
  } catch (error) {
    console.error('Error getting landlord metrics:', error);
    throw error;
  }
}

/**
 * Generate property occupancy report
 */
export async function getOccupancyReport(landlordId: string) {
  // Simplified implementation
  return [
    { propertyId: '1', propertyName: 'Oak Apartments', totalUnits: 10, occupiedUnits: 8, vacantUnits: 2, occupancyRate: 80 },
    { propertyId: '2', propertyName: 'Maple Residences', totalUnits: 15, occupiedUnits: 12, vacantUnits: 3, occupancyRate: 80 },
  ];
}

/**
 * Get landlord analytics data 
 */
export async function getLandlordAnalytics(landlordId: string): Promise<AnalyticsSummary> {
  try {
    const metrics = await getLandlordMetrics(landlordId);
    
    // This is simplified mock data for the demo
    return {
      totalProperties: metrics.totalProperties,
      totalTenants: 15,
      occupancyRate: metrics.occupancyRate,
      totalRevenue: 12500,
      pendingPayments: 2300,
      revenueByMonth: [
        { month: 'Jan', paid: 10000, pending: 1500 },
        { month: 'Feb', paid: 11000, pending: 1200 },
        { month: 'Mar', paid: 12500, pending: 2300 },
      ],
      occupancyByProperty: [
        { property: 'Oak Apartments', occupied: 8, total: 10 },
        { property: 'Maple Residences', occupied: 12, total: 15 },
      ],
      maintenanceStats: {
        pending: 5,
        inProgress: 3,
        completed: 12,
        cancelled: 1
      }
    };
  } catch (error) {
    console.error('Error getting landlord analytics:', error);
    return {};
  }
}

/**
 * Get tenant analytics data
 */
export async function getTenantAnalytics(tenantId: string): Promise<AnalyticsSummary> {
  try {
    // This is simplified mock data for the demo
    return {
      totalRevenue: 3600,
      pendingPayments: 1200,
      revenueByMonth: [
        { month: 'Jan', paid: 1200, pending: 0 },
        { month: 'Feb', paid: 1200, pending: 0 },
        { month: 'Mar', paid: 1200, pending: 1200 },
      ],
      maintenanceStats: {
        pending: 1,
        inProgress: 1,
        completed: 3,
        cancelled: 0
      }
    };
  } catch (error) {
    console.error('Error getting tenant analytics:', error);
    return {};
  }
}

interface PropertyMetrics {
  totalProperties: number;
  totalRooms: number;
  occupancyRate: number;
  averageRent: number;
}

interface UnitWithProperty {
  id: string;
  status: string;
  rent_amount: number;
  property: {
    name: string;
    // Other property fields
  };
}
