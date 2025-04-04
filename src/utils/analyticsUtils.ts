import { supabase } from '@/integrations/supabase/client';

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

    // Get tenancies to calculate occupancy
    const { data: tenancies, error: tenanciesError } = await supabase
      .from('tenancies')
      .select(`
        id, 
        status, 
        rent_amount,
        property_id
      `)
      .eq('active', true);

    if (tenanciesError) throw tenanciesError;

    // Calculate metrics
    const totalProperties = properties?.length || 0;
    const totalRooms = properties?.reduce((acc, property) => acc + property.bedrooms, 0) || 0;
    const totalUnits = totalRooms; // Assuming one room = one unit for simplicity
    
    const occupiedUnits = tenancies?.filter(t => 
      properties?.some(p => p.id === t.property_id)
    ).length || 0;
    
    const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
    
    const totalRent = tenancies?.reduce((acc, t) => acc + (t.rent_amount || 0), 0) || 0;
    const averageRent = occupiedUnits > 0 ? totalRent / occupiedUnits : 0;

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
 * Get tenant's payment statistics
 */
export async function getTenantPaymentStats(tenantId: string) {
  try {
    // Get all tenant's payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        payment_date,
        status,
        tenancy_id,
        tenancy:tenancies(*)
      `)
      .eq('tenancy:tenancies.tenant_id', tenantId);

    if (paymentsError) throw paymentsError;

    // Calculate statistics
    const totalPaid = payments?.reduce((acc, payment) => {
      return payment.status === 'completed' ? acc + payment.amount : acc;
    }, 0) || 0;

    const onTimePayments = payments?.filter(p => p.status === 'completed' && new Date(p.payment_date) <= new Date()).length || 0;
    const latePayments = payments?.filter(p => p.status === 'completed' && new Date(p.payment_date) > new Date()).length || 0;
    const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;

    return {
      totalPaid,
      onTimePayments,
      latePayments,
      pendingPayments,
      paymentHistory: payments || []
    };
  } catch (error) {
    console.error('Error getting tenant payment stats:', error);
    throw error;
  }
}

/**
 * Generate property occupancy report
 */
export async function getOccupancyReport(landlordId: string) {
  try {
    // Get properties
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', landlordId);

    if (propertiesError) throw propertiesError;

    // Get active tenancies
    const { data: tenancies, error: tenanciesError } = await supabase
      .from('tenancies')
      .select(`
        id, 
        property_id,
        active,
        tenant_id
      `)
      .eq('active', true);

    if (tenanciesError) throw tenanciesError;

    // Map occupancy data
    const occupancyData = properties?.map(property => {
      const totalUnits = property.bedrooms; // Assuming one bedroom = one unit
      const occupiedUnits = tenancies?.filter(t => t.property_id === property.id).length || 0;
      const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

      return {
        propertyId: property.id,
        propertyName: property.name,
        totalUnits,
        occupiedUnits,
        vacantUnits: totalUnits - occupiedUnits,
        occupancyRate
      };
    }) || [];

    return occupancyData;
  } catch (error) {
    console.error('Error generating occupancy report:', error);
    throw error;
  }
}

/**
 * Get property revenue data
 */
export async function getPropertyRevenue(landlordId: string, timeframe: 'month' | 'quarter' | 'year' = 'month') {
  try {
    // Get all properties for this landlord
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, name, landlord_id')
      .eq('landlord_id', landlordId);

    if (propertiesError) throw propertiesError;

    // Get all tenancies
    const { data: tenancies, error: tenanciesError } = await supabase
      .from('tenancies')
      .select(`
        id,
        property_id,
        rent_amount
      `)
      .eq('active', true)
      .in('property_id', properties?.map(p => p.id) || []);

    if (tenanciesError) throw tenanciesError;

    // Get payments for the relevant time period
    const startDate = new Date();
    if (timeframe === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === 'quarter') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('id, amount, payment_date, tenancy_id, status')
      .in('tenancy_id', tenancies?.map(t => t.id) || [])
      .eq('status', 'completed')
      .gte('payment_date', startDate.toISOString());

    if (paymentsError) throw paymentsError;

    // Prepare revenue data per property
    const revenueData = properties?.map(property => {
      const propertyTenancies = tenancies?.filter(t => t.property_id === property.id) || [];
      const tenancyIds = propertyTenancies.map(t => t.id);
      
      // Get payments for this property
      const propertyPayments = payments?.filter(p => tenancyIds.includes(p.tenancy_id)) || [];
      const totalRevenue = propertyPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Calculate expected revenue
      const expectedMonthlyRevenue = propertyTenancies.reduce((sum, t) => sum + (t.rent_amount || 0), 0);
      let expectedTotalRevenue = expectedMonthlyRevenue;
      
      if (timeframe === 'month') {
        // No change, it's just one month
      } else if (timeframe === 'quarter') {
        expectedTotalRevenue *= 3;
      } else { // year
        expectedTotalRevenue *= 12;
      }

      return {
        propertyId: property.id,
        propertyName: property.name,
        expectedRevenue: expectedTotalRevenue,
        actualRevenue: totalRevenue,
        difference: totalRevenue - expectedTotalRevenue,
        collectionRate: expectedTotalRevenue > 0 ? (totalRevenue / expectedTotalRevenue) * 100 : 0
      };
    }) || [];

    return revenueData;
  } catch (error) {
    console.error('Error generating revenue report:', error);
    throw error;
  }
}
