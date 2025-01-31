"use client";
import AuthForm from "@/components/AuthForm";
import { signInWithCredentails } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/validation";

const page = () => (
  <AuthForm
    defaultValues={{
      email: "ahmedelsayed@gmail.com",
      password: "123456789",
    }}
    schema={signInSchema}
    type="SignIn"
    onSubmit={signInWithCredentails}
  />
);

export default page;
