
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProperty, updateProperty } from "@/utils/propertyUtils";
import { useToast } from "@/components/ui/use-toast";

// Updated schema to include all required fields from Property type
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Property name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zip: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  property_type: z.string({
    required_error: "Please select a property type",
  }),
  bedrooms: z.coerce.number().min(0, {
    message: "Bedrooms must be 0 or more.",
  }),
  bathrooms: z.coerce.number().min(0, {
    message: "Bathrooms must be 0 or more.",
  }),
  monthly_rent: z.coerce.number().min(0, {
    message: "Monthly rent must be 0 or more.",
  }),
  description: z.string().optional(),
});

interface PropertyFormProps {
  landlordId: string;
  property?: any;
  onSuccess?: () => void;
}

export function PropertyForm({ landlordId, property, onSuccess }: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditing = !!property;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: property?.name || "",
      address: property?.address || "",
      city: property?.city || "",
      state: property?.state || "",
      zip: property?.zip || "",
      property_type: property?.property_type || "",
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      monthly_rent: property?.monthly_rent || 0,
      description: property?.description || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let result;
      
      if (isEditing) {
        result = await updateProperty(property.id, values);
      } else {
        // Now passing all required fields to createProperty
        result = await createProperty(landlordId, {
          name: values.name,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
          property_type: values.property_type,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          monthly_rent: values.monthly_rent,
          description: values.description || "",
        });
      }
      
      if (result) {
        toast({
          title: isEditing ? "Property updated" : "Property created",
          description: isEditing 
            ? "Your property has been updated successfully." 
            : "Your property has been created successfully.",
        });
        if (!isEditing) form.reset();
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Error",
          description: isEditing 
            ? "There was an error updating your property. Please try again." 
            : "There was an error creating your property. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Property submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Sunset Apartments" {...field} />
              </FormControl>
              <FormDescription>
                Enter a name for your property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 123 Main Street" {...field} />
              </FormControl>
              <FormDescription>
                The physical address of the property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Kampala" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Central" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 10001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="monthly_rent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rent</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="property_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apartment">Apartment Building</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of property
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
                  placeholder="Describe your property..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide details about your property
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Property" : "Create Property"}
        </Button>
      </form>
    </Form>
  );
}
