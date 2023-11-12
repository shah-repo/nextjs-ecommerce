"use client";
import React, { ComponentProps } from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
} & ComponentProps<"button">;

const FormSubmitButton: React.FC<Props> = ({ children, className }) => {
  return (
    <button
      className={`btn btn-primary ${className}`}
      type="submit"
    >
      {children}
    </button>
  );
};

export default FormSubmitButton;
