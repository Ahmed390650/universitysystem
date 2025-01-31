"use client";
import AuthForm from "@/components/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { signOutSchema } from "@/lib/validation";
import React from "react";

const page = () => (
  <AuthForm
    schema={signOutSchema}
    type="SignUp"
    defaultValues={{
      email: "ahmedelsayed@gmail.com",
      password: "123456789",
      fullName: "Ahmed elsayed",
      universityCard: "",
      universityId: 123,
    }}
    onSubmit={signUp}
  />
);

export default page;
