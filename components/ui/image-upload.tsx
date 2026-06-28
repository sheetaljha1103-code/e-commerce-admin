"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
             className="relative w-[200px] h-[200px] overflow-hidden rounded-md border"
             >
            <button
              type="button"
              onClick={() => onRemove(url)}
              className="absolute top-2 right-2 z-10"
            >
              <Trash className="h-4 w-4" />
            </button>

            <img
  src={url}
  alt="Uploaded"
  className="w-full h-full object-cover"
  onError={() => console.log("IMAGE LOAD ERROR")}
  onLoad={() => console.log("IMAGE LOADED")}
/>
          </div>
        ))}
      </div>

      <CldUploadWidget
        uploadPreset="ecommerce"
        onSuccess={onUpload}
      >
        {({ open }) => (
          <button
            type="button"
            disabled={disabled}
            onClick={() => open()}
            className="border px-2 py-1 rounded-md flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            Upload an Image
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;