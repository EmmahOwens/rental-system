import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Document {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  shared_with?: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const uploadDocument = async (
  userId: string,
  file: File,
  metadata: {
    name?: string;
    description?: string;
    shared_with?: string[];
  }
): Promise<Document | null> => {
  try {
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `documents/${userId}/${fileName}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }
    
    // Create shared_with object if users to share with are provided
    let sharedWith = {};
    if (metadata.shared_with && metadata.shared_with.length > 0) {
      sharedWith = metadata.shared_with.reduce((acc, userId) => {
        return { ...acc, [userId]: 'read' };
      }, {});
    }
    
    // Create document record in the database
    const { data, error } = await supabase
      .from("documents")
      .insert({
        owner_id: userId,
        name: metadata.name || file.name,
        description: metadata.description,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        shared_with: sharedWith
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating document record:", error);
      // Delete the uploaded file if the record creation fails
      await supabase.storage.from('documents').remove([filePath]);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    return null;
  }
};

export const getDocumentUrl = async (filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour
      
    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error("Error in getDocumentUrl:", error);
    return null;
  }
};

export const getUserDocuments = async (userId: string): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    return [];
  }
};

export const getSharedDocuments = async (userId: string): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .filter('shared_with', 'cs', `{"${userId}":`)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching shared documents:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getSharedDocuments:", error);
    return [];
  }
};

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // First get the document to get the file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("file_path")
      .eq("id", documentId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching document for deletion:", fetchError);
      return false;
    }
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
      
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
      return false;
    }
    
    // Delete the document record
    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);
      
    if (error) {
      console.error("Error deleting document record:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return false;
  }
};