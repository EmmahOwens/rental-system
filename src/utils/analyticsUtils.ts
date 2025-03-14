import { supabase } from "@/integrations/supabase/client";
import { getPaymentStats } from "@/utils/paymentUtils";

export interface AnalyticsSummary {
  totalProperties?: number;
  totalUnits?: number;
  occupancyRate?: number;
  totalTenants?: number;
  totalRevenue?: number;
  pendingPayments?: number;
  maintenanceStats?: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  revenueByMonth?: Array<{
    month: string;
    paid: number;
    pending: number;
  }>;
  occupancyByProperty?: Array<{
    property: string;
    total: number;
    occupied: number;
    rate: number;
  }>;
}

export const getLandlordAnalytics = async (landlordId: string): Promise<AnalyticsSummary> => {
  try {
    // Get properties count
    const { count: propertiesCount, error: propertiesError } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("landlord_id", landlordId);
      
    if (propertiesError) {
      console.error("Error fetching properties count:", propertiesError);
    }
    
    // Get units data
    const { data: units, error: unitsError } = await supabase
      .from("property_units")
      .select(`
        id,
        status,
        rent_amount,
        property:properties!inner(name, landlord_id)
      `)
      .eq("property.landlord_id", landlordId);
      
    if (unitsError) {
      console.error("Error fetching units data:", unitsError);
    }
    
    // Calculate units stats
    const totalUnits = units?.length || 0;
    const occupiedUnits = units?.filter(unit => unit.status === 'occupied').length || 0;
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
    
    // Define the expected structure of the unit data
    interface UnitWithProperty {
      id: string;
      status: string;
      rent_amount?: number;
      property?: {
        name: string;
      };
    }
    
    // Group by property for occupancy chart
    const occupancyByProperty = units?.reduce((acc: Record<string, any>, unit: UnitWithProperty) => {
      const propertyName = unit.property ? unit.property.name : 'Unknown';
      
      if (!acc[propertyName]) {
        acc[propertyName] = { property: propertyName, total: 0, occupied: 0, rate: 0 };
      }
      
      acc[propertyName].total += 1;
      if (unit.status === 'occupied') {
        acc[propertyName].occupied += 1;
      }
      
      return acc;
    }, {}) || {}; // Add empty object as fallback when units is null/undefined
    
    // Calculate rates for each property
    Object.values(occupancyByProperty || {}).forEach((prop: any) => {
      prop.rate = prop.total > 0 ? (prop.occupied / prop.total) * 100 : 0;
    });
    
    // Get tenants count
    const { count: tenantsCount, error: tenantsError } = await supabase
      .from("tenant_landlord_connections")
      .select("id", { count: "exact", head: true })
      .eq("landlord_id", landlordId)
      .eq("status", "active");
      
    if (tenantsError) {
      console.error("Error fetching tenants count:", tenantsError);
    }
    
    // Get maintenance requests stats
    const { data: maintenanceData, error: maintenanceError } = await supabase
      .from("maintenance_requests")
      .select("status")
      .eq("landlord_id", landlordId);
      
    if (maintenanceError) {
      console.error("Error fetching maintenance data:", maintenanceError);
    }
    
    const maintenanceStats = {
      pending: maintenanceData?.filter(req => req.status === 'pending').length || 0,
      inProgress: maintenanceData?.filter(req => req.status === 'in_progress').length || 0,
      completed: maintenanceData?.filter(req => req.status === 'completed').length || 0,
      cancelled: maintenanceData?.filter(req => req.status === 'cancelled').length || 0
    };
    
    // Get payment stats
    const paymentStats = await getPaymentStats(landlordId, 'landlord');
    
    return {
      totalProperties: propertiesCount || 0,
      totalUnits,
      occupancyRate,
      totalTenants: tenantsCount || 0,
      totalRevenue: paymentStats?.totalPaid || 0,
      pendingPayments: paymentStats?.pendingAmount || 0,
      maintenanceStats,
      revenueByMonth: paymentStats?.monthlyData || [],
      occupancyByProperty: Object.values(occupancyByProperty || {})
    };
  } catch (error) {
    console.error("Error in getLandlordAnalytics:", error);
    return {};
  }
};

export const getTenantAnalytics = async (tenantId: string): Promise<AnalyticsSummary> => {
  try {
    // Get payment stats
    const paymentStats = await getPaymentStats(tenantId, 'tenant');
    
    // Get maintenance requests stats
    const { data: maintenanceData, error: maintenanceError } = await supabase
      .from("maintenance_requests")
      .select("status")
      .eq("tenant_id", tenantId);
      
    if (maintenanceError) {
      console.error("Error fetching maintenance data:", maintenanceError);
    }
    
    const maintenanceStats = {
      pending: maintenanceData?.filter(req => req.status === 'pending').length || 0,
      inProgress: maintenanceData?.filter(req => req.status === 'in_progress').length || 0,
      completed: maintenanceData?.filter(req => req.status === 'completed').length || 0,
      cancelled: maintenanceData?.filter(req => req.status === 'cancelled').length || 0
    };
    
    return {
      totalRevenue: paymentStats?.totalPaid || 0,
      pendingPayments: paymentStats?.pendingAmount || 0,
      maintenanceStats,
      revenueByMonth: paymentStats?.monthlyData || []
    };
  } catch (error) {
    console.error("Error in getTenantAnalytics:", error);
    return {};
  }
};