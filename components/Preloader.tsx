"use client";
import { useEffect, useState } from "react";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return <div className="preloader bg-preloader" />;
};

export default Preloader;
