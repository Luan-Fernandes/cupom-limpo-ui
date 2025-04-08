"use client";

import { TextField } from "@mui/material";
import { ReactNode } from "react";

interface InputProps {
  label: string;
}
export function Input({ label }: InputProps) {
  return (
    <div>
      <TextField
        id="outlined-basic"
        label={label}
        variant="outlined"
        className="relative w-[400px] "
      />
    </div>
  );
}
