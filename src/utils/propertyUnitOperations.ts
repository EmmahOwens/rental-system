
import { PropertyUnit } from "./propertyTypes";

// Mock functions for property units
// These would be replaced with actual implementations once the property_units table is created

export const createPropertyUnit = async (
  propertyId: string,
  unitData: Omit<PropertyUnit, 'id' | 'property_id' | 'created_at' | 'updated_at'>
): Promise<PropertyUnit | null> => {
  try {
    console.log(`Mock: Creating property unit for property ${propertyId}`);
    
    return {
      id: `mock-${Date.now()}`,
      property_id: propertyId,
      unit_number: unitData.unit_number,
      bedrooms: unitData.bedrooms,
      bathrooms: unitData.bathrooms,
      rent_amount: unitData.rent_amount,
      size_sqft: unitData.size_sqft,
      status: unitData.status,
      tenant_id: unitData.tenant_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in createPropertyUnit:", error);
    return null;
  }
};

export const assignTenantToUnit = async (
  unitId: string,
  tenantId: string
): Promise<PropertyUnit | null> => {
  try {
    console.log(`Mock: Assigning tenant ${tenantId} to unit ${unitId}`);
    
    return {
      id: unitId,
      property_id: 'mock-property-id',
      unit_number: '101',
      bedrooms: 2,
      bathrooms: 1,
      rent_amount: 1200,
      status: 'occupied',
      tenant_id: tenantId,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in assignTenantToUnit:", error);
    return null;
  }
};

export const getPropertyUnits = async (propertyId: string): Promise<PropertyUnit[]> => {
  try {
    console.log(`Mock: Getting units for property ${propertyId}`);
    
    return [
      {
        id: `mock-${Date.now()}-1`,
        property_id: propertyId,
        unit_number: '101',
        bedrooms: 2,
        bathrooms: 1,
        rent_amount: 1200,
        size_sqft: 800,
        status: 'occupied',
        tenant_id: 'mock-tenant-id-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenant: {
          first_name: 'Jane',
          last_name: 'Smith'
        }
      },
      {
        id: `mock-${Date.now()}-2`,
        property_id: propertyId,
        unit_number: '102',
        bedrooms: 1,
        bathrooms: 1,
        rent_amount: 950,
        size_sqft: 600,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error("Error in getPropertyUnits:", error);
    return [];
  }
};

export const getTenantUnit = async (tenantId: string): Promise<PropertyUnit | null> => {
  try {
    console.log(`Mock: Getting unit for tenant ${tenantId}`);
    
    return {
      id: `mock-${Date.now()}`,
      property_id: 'mock-property-id',
      unit_number: '101',
      bedrooms: 2,
      bathrooms: 1,
      rent_amount: 1200,
      size_sqft: 800,
      status: 'occupied',
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      property: {
        id: 'mock-property-id',
        landlord_id: 'mock-landlord-id',
        name: 'Oak Apartments',
        address: '123 Main St',
        city: 'City',
        property_type: 'apartment',
        bathrooms: 1,
        bedrooms: 2,
        state: 'State',
        zip: '12345',
        monthly_rent: 1200,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error("Error in getTenantUnit:", error);
    return null;
  }
};
