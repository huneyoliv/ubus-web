import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[18px] p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-[#C3C6D7]/30 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
