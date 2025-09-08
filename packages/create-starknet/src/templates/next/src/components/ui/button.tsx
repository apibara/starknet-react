"use client";
import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};
