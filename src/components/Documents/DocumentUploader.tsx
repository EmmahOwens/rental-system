import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { uploadDocument } from "@/utils/documentUtils";
import { useAuth } from "@/hooks/useAuth";
import { FileUploader } from "@/components/Documents/FileUploader";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Document name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  file: z.any()
    .refine((file) => file, {
      message: "Please select a file.",
    })
    .refine((file) => file?.size <= MAX_FILE_SIZE, {
      message: `File size should be less than 5MB.`,
    }),
});

interface DocumentUploaderProps {
  onSuccess?: () => void;
}

export function DocumentUploader({ onSuccess }: DocumentUploaderProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const document = await uploadDocument(
        user.id,
        values.file,
        {
          name: values.name,
          description: values.description,
        }
      );
      
      if (document) {
        toast({
          title: "Document uploaded",
          description: "Your document has been uploaded successfully.",
        });
        form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your document. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Document upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <FileUploader
                  onFileSelect={(file) => onChange(file)}
                  value={value}
                  {...rest}
                />
              </FormControl>
              <FormDescription>
                Upload a document (PDF, Word, Excel, etc.). Max size: 5MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Lease Agreement" {...field} />
              </FormControl>
              <FormDescription>
                Give your document a descriptive name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details about this document..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload Document"}
        </Button>
      </form>
    </Form>
  );
}