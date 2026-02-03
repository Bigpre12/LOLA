"use client";

import { Input, Textarea } from "@/components/ui";
import { InputField } from "@/types";
import { useCallback, useState } from "react";

interface InputRendererProps {
  fields: InputField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  errors?: Record<string, string>;
}

export function InputRenderer({ fields, values, onChange, errors = {} }: InputRendererProps) {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(value) => onChange(field.key, value)}
          error={errors[field.key]}
        />
      ))}
    </div>
  );
}

interface FieldRendererProps {
  field: InputField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  switch (field.type) {
    case "text":
      return (
        <Input
          id={field.key}
          label={field.label + (field.required ? " *" : "")}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          error={error}
        />
      );

    case "textarea":
      return (
        <Textarea
          id={field.key}
          label={field.label + (field.required ? " *" : "")}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          error={error}
        />
      );

    case "image":
      return (
        <ImageUploader
          id={field.key}
          label={field.label + (field.required ? " *" : "")}
          value={value as string | File | undefined}
          onChange={onChange}
          error={error}
        />
      );

    default:
      return null;
  }
}

interface ImageUploaderProps {
  id: string;
  label: string;
  value: string | File | undefined;
  onChange: (value: File | string) => void;
  error?: string;
}

function ImageUploader({ id, label, value, onChange, error }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onChange(file);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          isDragging
            ? "border-violet-500 bg-violet-500/10"
            : error
            ? "border-red-500 bg-red-500/5"
            : "border-slate-700 hover:border-slate-600"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onChange("");
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div>
            <svg
              className="mx-auto h-12 w-12 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-slate-400">
              Drag and drop an image, or{" "}
              <label
                htmlFor={id}
                className="text-violet-400 hover:text-violet-300 cursor-pointer"
              >
                browse
              </label>
            </p>
            <p className="mt-1 text-xs text-slate-500">PNG, JPG up to 10MB</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}
