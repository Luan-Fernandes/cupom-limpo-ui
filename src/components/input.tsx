"use client";

import { TextField } from "@mui/material";
import React, { ChangeEvent, HTMLInputTypeAttribute, ReactNode } from "react";

interface InputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  onValueChange?: (
    formattedValue: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string;
}
export function Input({ value, onValueChange, type, label }: InputProps) {
  return (
    <TextField
      value={value}
      onChange={onValueChange}
      id="outlined-basic"
      label={label}
      type={type}
      variant="outlined"
      className="relative"
      fullWidth
    />
  );
}
