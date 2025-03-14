import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  landlord_id: string;
  name: string;
  address: string;
  city: string;
  description?: string;
  property_type: string;
  created_at: string;
  updated_at: string;
  units_count?: number;
  landlord?: {
    first_name: string;
    last_name: string;
  };
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
    const { data, error } = await supabase
      .from("properties")
      .insert({
        landlord_id: landlordId,
        ...propertyData
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating property:", error);
      return null;
    }
    
    return data;
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
    const { data, error } = await supabase
      .from("properties")
      .update(propertyData)
      .eq("id", propertyId)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating property:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in updateProperty:", error);
    return null;
  }
};

export const getLandlordProperties = async (landlordId: string): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        units_count:property_units(count)
      `)
      .eq("landlord_id", landlordId);
      
    if (error) {
      console.error("Error fetching landlord properties:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getLandlordProperties:", error);
    return [];
  }
};

export const createPropertyUnit = async (
  propertyId: string,
  unitData: Omit<PropertyUnit, 'id' | 'property_id' | 'created_at' | 'updated_at'>
): Promise<PropertyUnit | null> => {
  try {
    const { data, error } = await supabase
      .from("property_units")
      .insert({
        property_id: propertyId,
        ...unitData
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating property unit:", error);
      return null;
    }
    
    return data;
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
    const { data, error } = await supabase
      .from("property_units")
      .update({
        tenant_id: tenantId,
        status: 'occupied'
      })
      .eq("id", unitId)
      .select()
      .single();
      
    if (error) {
      console.error("Error assigning tenant to unit:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in assignTenantToUnit:", error);
    return null;
  }
};

export const getPropertyUnits = async (propertyId: string): Promise<PropertyUnit[]> => {
  try {
    const { data, error } = await supabase
      .from("property_units")
      .select(`
        *,
        tenant:profiles(first_name, last_name)
      `)
      .eq("property_id", propertyId);
      
    if (error) {
      console.error("Error fetching property units:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getPropertyUnits:", error);
    return [];
  }
};

export const getTenantUnit = async (tenantId: string): Promise<PropertyUnit | null> => {
  try {
    const { data, error } = await supabase
      .from("property_units")
      .select(`
        *,
        property:properties(*)
      `)
      .eq("tenant_id", tenantId)
      .single();
      
    if (error) {
      console.error("Error fetching tenant unit:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getTenantUnit:", error);
    return null;
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        *,
        landlord:profiles(first_name, last_name),
        units_count:property_units(count),
        available_units:property_units(count)
      `)
      .eq("property_units.status", "available");
      
    if (error) {
      console.error("Error fetching all properties:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    return [];
  }
};