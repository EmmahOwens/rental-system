import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  value?: File | null;
  accept?: string;
  maxSize?: number;
}

export function FileUploader({
  onFileSelect,
  value,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file size
    if (file.size > maxSize) {
      alert(`File size exceeds the maximum allowed size (${maxSize / (1024 * 1024)}MB)`);
      return;
    }
    
    // Check file type if accept is specified
    if (accept && accept !== "*") {
      const fileType = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const acceptedTypes = accept.split(',');
      
      if (!acceptedTypes.some(type => 
        type.trim() === fileType || 
        type.trim() === file.type || 
        (type.trim().includes('*') && type.trim().includes(fileType.split('.').pop() || ''))
      )) {
        alert(`File type not accepted. Please upload: ${accept}`);
        return;
      }
    }
    
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const clearFile = () => {
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!value ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
          />
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center mb-1">
            Drag and drop your file here or click to browse
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Supported formats: {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <File className="h-6 w-6 text-primary mr-2" />
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}