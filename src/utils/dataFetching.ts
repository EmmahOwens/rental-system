
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

// Type-safe table names to ensure we only use tables that exist
type TableName = 
  | "profiles" 
  | "properties" 
  | "payments" 
  | "tenancies" 
  | "rental_applications" 
  | "maintenance_requests" 
  | "messages" 
  | "calendar_events" 
  | "memory_timeline" 
  | "memory_details" 
  | "love_notes";

// Simple flat options type to avoid circular references
type DataFetchOptions = {
  column?: string;
  value?: string | number;
  select?: string;
  orderColumn?: string;
  orderAscending?: boolean;
  limit?: number;
  single?: boolean;
};

/**
 * A utility hook for data fetching with automatic error handling and refresh capabilities
 */
export function useSupabaseFetch<T>(
  tableName: TableName,
  options?: DataFetchOptions
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase.from(tableName).select(options?.select || '*');
      
      if (options?.column && options?.value !== undefined) {
        query = query.eq(options.column, options.value);
      }
      
      if (options?.orderColumn) {
        query = query.order(options.orderColumn, { 
          ascending: options.orderAscending ?? true 
        });
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data: response, error: supabaseError } = options?.single 
        ? await query.single() 
        : await query;
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      setData(response as T);
    } catch (err) {
      console.error(`Error fetching from ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: "Error fetching data",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableName, options?.column, options?.value]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * A utility function for data mutation with automatic error handling
 */
export async function mutateSupabaseData<T>(
  operation: 'insert' | 'update' | 'delete' | 'upsert',
  tableName: TableName,
  data?: any,
  options?: {
    column?: string;
    value?: string | number;
    returning?: string;
  }
): Promise<T | null> {
  try {
    let query;
    
    switch (operation) {
      case 'insert':
        query = supabase.from(tableName).insert(data);
        break;
      case 'update':
        query = supabase.from(tableName).update(data);
        if (options?.column && options?.value !== undefined) {
          query = query.eq(options.column, options.value);
        }
        break;
      case 'delete':
        query = supabase.from(tableName).delete();
        if (options?.column && options?.value !== undefined) {
          query = query.eq(options.column, options.value);
        }
        break;
      case 'upsert':
        query = supabase.from(tableName).upsert(data);
        break;
      default:
        throw new Error(`Invalid operation: ${operation}`);
    }
    
    if (options?.returning) {
      query = query.select(options.returning);
    }
    
    const { data: response, error: supabaseError } = await query;
    
    if (supabaseError) {
      toast({
        title: "Operation failed",
        description: supabaseError.message,
        variant: "destructive"
      });
      throw new Error(supabaseError.message);
    }
    
    toast({
      title: "Success",
      description: `${operation.charAt(0).toUpperCase() + operation.slice(1)} operation completed successfully`,
    });
    
    return response as T;
  } catch (err) {
    console.error(`Error in ${operation} operation on ${tableName}:`, err);
    throw err;
  }
}
