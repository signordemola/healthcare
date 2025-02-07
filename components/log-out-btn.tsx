"use client";

import React from "react";
import { Button } from "./ui/button";
import { logout } from "@/actions/logout ";

const LogOutButton = () => {
  return (
    <>
      <Button
        variant={`outline`}
        size={`lg`}
        className="w-full"
        onClick={async () => await logout()}
      >
        
        <span className="py-4">Log Out</span>
      </Button>
    </>
  );
};

export default LogOutButton;
