
import { supabase } from "@/integrations/supabase/client";
import { Property } from "./propertyTypes";

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
    
    // Add property_type to each property object
    return data.map(property => {
      // Create a new object with all properties from the returned data
      // and explicitly add the property_type field if it doesn't exist
      return {
        ...property,
        property_type: 'apartment' // Since the column doesn't exist, use a default value
      } as Property;
    });
  } catch (error) {
    console.error("Error in getLandlordProperties:", error);
    return [];
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase.from("properties").select("*");
      
    if (error) {
      console.error("Error fetching all properties:", error);
      return [];
    }
    
    // Add property_type to each property object
    return data.map(property => {
      // Create a new object with all properties from the returned data
      // and explicitly add the property_type field if it doesn't exist
      return {
        ...property,
        property_type: 'apartment' // Since the column doesn't exist, use a default value
      } as Property;
    });
  } catch (error) {
    console.error("Error in getAllProperties:", error);
    return [];
  }
};
