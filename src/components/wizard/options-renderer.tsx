"use client";

import { Slider } from "@/components/ui";
import { OptionField, SliderOptionField, SelectOptionField, CheckboxOptionField } from "@/types";
import { cn } from "@/lib/utils";

interface OptionsRendererProps {
  fields: OptionField[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function OptionsRenderer({ fields, values, onChange }: OptionsRendererProps) {
  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <OptionFieldRenderer
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(value) => onChange(field.key, value)}
        />
      ))}
    </div>
  );
}

interface OptionFieldRendererProps {
  field: OptionField;
  value: unknown;
  onChange: (value: unknown) => void;
}

function OptionFieldRenderer({ field, value, onChange }: OptionFieldRendererProps) {
  switch (field.type) {
    case "slider":
      return (
        <SliderField
          field={field as SliderOptionField}
          value={(value as number) ?? field.default}
          onChange={onChange}
        />
      );

    case "select":
      return (
        <SelectField
          field={field as SelectOptionField}
          value={(value as string) ?? field.default}
          onChange={onChange}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          field={field as CheckboxOptionField}
          value={(value as boolean) ?? field.default}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
}

interface SliderFieldProps {
  field: SliderOptionField;
  value: number;
  onChange: (value: number) => void;
}

function SliderField({ field, value, onChange }: SliderFieldProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
      <Slider
        id={field.key}
        label={field.label}
        value={value}
        onChange={onChange}
        min={field.min}
        max={field.max}
        step={field.step || 1}
      />
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>{field.min}</span>
        <span>{field.max}</span>
      </div>
    </div>
  );
}

interface SelectFieldProps {
  field: SelectOptionField;
  value: string;
  onChange: (value: string) => void;
}

function SelectField({ field, value, onChange }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={field.key} className="block text-sm font-medium text-slate-300 mb-2">
        {field.label}
      </label>
      <select
        id={field.key}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
      >
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxFieldProps {
  field: CheckboxOptionField;
  value: boolean;
  onChange: (value: boolean) => void;
}

function CheckboxField({ field, value, onChange }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={field.key}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          value
            ? "bg-violet-500 border-violet-500"
            : "border-slate-600 group-hover:border-slate-500"
        )}
      >
        {value && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        id={field.key}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="hidden"
      />
      <span className="text-slate-300">{field.label}</span>
    </label>
  );
}
