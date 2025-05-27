import NavBar from "@/components/navbar";
import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavBar>{children}</NavBar>
  );
}