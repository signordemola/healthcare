import React from "react";

interface FormWrapperProps {
  title: string;
  children: React.ReactNode;
}

const FormWrapper = ({ title, children }: FormWrapperProps) => {
  return (
    <section className="w-full">
      <p className="sub-header mb-8">{title}</p>
      <>{children}</>
    </section>
  );
};

export default FormWrapper;
