import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-3 py-2 bg-blue-500 rounded-md text-white disabled:opacity-50 ${props.className}`}
    >
      {children}
    </button>
  );
};
