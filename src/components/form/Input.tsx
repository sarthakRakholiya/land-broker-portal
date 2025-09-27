import React from "react";
import { UseFormRegister, FieldPath, FieldValues } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  register: UseFormRegister<T>;
  name: FieldPath<T>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Input = <T extends FieldValues>({
  label,
  type = "text",
  placeholder,
  register,
  name,
  error,
  required = false,
  disabled = false,
  className = "",
}: InputProps<T>) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-primary-700"
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-primary-50 disabled:text-primary-500 disabled:cursor-not-allowed
          ${
            error
              ? "border-error-300 bg-error-50 focus:ring-error-500"
              : "border-primary-300 hover:border-primary-400"
          }
          ${className}
        `}
        {...register(name)}
      />
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-error-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};
