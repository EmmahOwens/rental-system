import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  property_type: string; // Ensuring property_type is defined as required
  created_at: string;
  updated_at: string;
  units_count?: number;
  landlord?: {
    first_name: string;
    last_name: string;
  };
  // Include other fields from the properties table
  bathrooms: number;
  bedrooms: number;
  state: string;
  zip: string;
  monthly_rent: number;
  image_url?: string;
  square_feet?: number;
}

export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  size_sqft?: number;
  status: 'available' | 'occupied' | 'maintenance';
  tenant_id?: string;
  created_at: string;
  updated_at: string;
  property?: Property;
  tenant?: {
    first_name: string;
    last_name: string;
  };
}

export const createProperty = async (
  landlordId: string,
  propertyData: Omit<Property, 'id' | 'landlord_id' | 'created_at' | 'updated_at'>
): Promise<Property | null> => {
  try {
    console.log(`Mock: Creating property for landlord ${landlordId}`);
    
    return {
      id: `mock-${Date.now()}`,
      landlord_id: landlordId,
      name: propertyData.name,
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      zip: propertyData.zip,
      bathrooms: propertyData.bathrooms,
      bedrooms: propertyData.bedrooms,
      monthly_rent: propertyData.monthly_rent,
      property_type: propertyData.property_type,
      description: propertyData.description || "",
      image_url: propertyData.image_url,
      square_feet: propertyData.square_feet,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in createProperty:", error);
    return null;
  }
};

export const updateProperty = async (
  propertyId: string,
  propertyData: Partial<Omit<Property, 'id' | 'landlord_id' | 'created_at' | 'updated_at'>>
): Promise<Property | null> => {
  try {
    console.log(`Mock: Updating property ${propertyId}`);
    
    return {
      id: propertyId,
      landlord_id: 'mock-landlord-id',
      name: propertyData.name || 'Property Name',
      address: propertyData.address || '123 Main St',
      city: propertyData.city || 'City',
      state: propertyData.state || 'State',
      zip: propertyData.zip || '12345',
      property_type: propertyData.property_type || 'apartment',
      description: propertyData.description,
      bathrooms: propertyData.bathrooms || 2,
      bedrooms: propertyData.bedrooms || 2,
      monthly_rent: propertyData.monthly_rent || 1000,
      image_url: propertyData.image_url,
      square_feet: propertyData.square_feet,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in updateProperty:", error);
    return null;
  }
};

export const getLandlordProperties = async (landlordId: string): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select(`*`)
      .eq("landlord_id", landlordId);
      
    if (error) {
      console.error("Error fetching landlord properties:", error);
      return [];
    }
    
    // Add property_type field to each property if not already set
    return data.map(property => ({
      ...property,
      property_type: property.property_type || 'apartment'
    })) as Property[];
  } catch (error) {
    console.error("Error in getLandlordProperties:", error);
    return [];
  }
};

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

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase.from("properties").select("*");
      
    if (error) {
      console.error("Error fetching all properties:", error);
      return [];
    }
    
    // Add property_type field to each property if not already set
    return data.map(property => ({
      ...property,
      property_type: property.property_type || 'apartment'
    })) as Property[];
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    return [];
  }
};
