"use client";

import React, { ChangeEvent, HTMLInputTypeAttribute, ReactNode, useState } from "react";
import {
  FormControl, 
  InputLabel,   
  OutlinedInput,
  InputAdornment,
  IconButton,    
} from "@mui/material";
import { Eye, EyeClosed } from "lucide-react";

interface InputProps {
  label: string;
  type?: HTMLInputTypeAttribute; 
  onValueChange?: (
    formattedValue: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  value?: string;
}

export function Input({ value, onValueChange, type = "text", label }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); 
  };

  const isPasswordType = type === "password";

  return (
    <FormControl variant="outlined" fullWidth className="relative">
      <InputLabel htmlFor={`outlined-adornment-${label.toLowerCase().replace(/\s/g, '-')}`}>
        {label}
      </InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${label.toLowerCase().replace(/\s/g, '-')}`}
        type={isPasswordType && !showPassword ? "password" : "text"}
        value={value}
        onChange={onValueChange}
        endAdornment={ 
          isPasswordType && ( 
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </IconButton>
            </InputAdornment>
          )
        }
        label={label}
      />
    </FormControl>
  );
}