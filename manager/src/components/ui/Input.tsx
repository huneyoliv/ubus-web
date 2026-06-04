import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-[#434655]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-2.5 bg-white border rounded-[12px] text-[#131B2E] transition-all duration-200 outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 ${
          error ? 'border-[#BA1A1A] focus:border-[#BA1A1A] focus:ring-[#BA1A1A]/15' : 'border-[#C3C6D7]'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-[#BA1A1A]">{error}</span>}
    </div>
  );
}
