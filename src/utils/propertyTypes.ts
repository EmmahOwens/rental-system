
// Common property and property unit types

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
