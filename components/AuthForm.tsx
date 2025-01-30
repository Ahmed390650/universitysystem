"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";
import { Button } from "./ui/button";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader, Loader2 } from "lucide-react";
interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SignIn" | "SignUp";
}
const AuthForm = <T extends FieldValues>({
  defaultValues,
  onSubmit,
  schema,
  type,
}: Props<T>) => {
  const isSignIn = type === "SignIn";
  const router = useRouter();
  const { toast } = useToast();
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.success) {
      toast({
        title: "success",
        description: isSignIn
          ? "You have logged in successfully"
          : "You have signed up successfully",
      });
      router.push("/");
    } else {
      toast({
        title: `Error ${isSignIn ? "logging in" : "signing up"}`,
        description: result.error ?? "An error occurred",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome Back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100 text-base">
        {isSignIn
          ? "Access the vast collection of resources,and stay updated"
          : "Please complete all fields and upload a valid university id to gain acces to the library"}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, (e) => {
            console.log(e);
            console.log(form.getValues());
          })}
          className="space-y-6 w-full">
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field.name === "universityCard" ? (
                      <ImageUpload onChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}></FormField>
          ))}
          <Button
            type="submit"
            aria-disabled={form.formState.isSubmitting}
            className="form-btn aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50">
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : isSignIn ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>
      <p className="text-center text-base font-medium">
        {isSignIn ? "Don't have an account? " : "Already have an account? "}
        <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
