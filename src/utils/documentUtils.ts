
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

// Mock implementations for document operations
// These would be replaced with actual implementations once the documents table is created

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
    console.log(`Mock: Uploading document for user ${userId}`);
    
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `documents/${userId}/${fileName}`;
    
    // Create shared_with object if users to share with are provided
    let sharedWith = {};
    if (metadata.shared_with && metadata.shared_with.length > 0) {
      sharedWith = metadata.shared_with.reduce((acc, userId) => {
        return { ...acc, [userId]: 'read' };
      }, {});
    }
    
    // Mock document creation
    return {
      id: uuidv4(),
      owner_id: userId,
      name: metadata.name || file.name,
      description: metadata.description,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      shared_with: sharedWith,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in uploadDocument:", error);
    return null;
  }
};

export const getDocumentUrl = async (filePath: string): Promise<string | null> => {
  try {
    // Mock URL generation
    return `https://mock-storage.com/${filePath}?token=${uuidv4()}`;
  } catch (error) {
    console.error("Error in getDocumentUrl:", error);
    return null;
  }
};

export const getUserDocuments = async (userId: string): Promise<Document[]> => {
  try {
    console.log(`Mock: Getting documents for user ${userId}`);
    
    // Mock documents for the user
    return [
      {
        id: uuidv4(),
        owner_id: userId,
        name: "Lease Agreement.pdf",
        description: "Rental agreement for Oak Apartments",
        file_path: `documents/${userId}/lease-agreement.pdf`,
        file_type: "application/pdf",
        file_size: 1024 * 1024 * 2, // 2MB
        shared_with: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        owner_id: userId,
        name: "Payment Receipt.pdf",
        description: "March rent payment receipt",
        file_path: `documents/${userId}/payment-receipt.pdf`,
        file_type: "application/pdf",
        file_size: 1024 * 512, // 512KB
        shared_with: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    return [];
  }
};

export const getSharedDocuments = async (userId: string): Promise<Document[]> => {
  try {
    console.log(`Mock: Getting shared documents for user ${userId}`);
    
    // Mock shared documents
    return [
      {
        id: uuidv4(),
        owner_id: "other-user-id",
        name: "Building Rules.pdf",
        description: "Building rules and regulations",
        file_path: `documents/other-user-id/building-rules.pdf`,
        file_type: "application/pdf",
        file_size: 1024 * 1024, // 1MB
        shared_with: { [userId]: 'read' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  } catch (error) {
    console.error("Error in getSharedDocuments:", error);
    return [];
  }
};

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    console.log(`Mock: Deleting document ${documentId}`);
    return true;
  } catch (error) {
    console.error("Error in deleteDocument:", error);
    return false;
  }
};
