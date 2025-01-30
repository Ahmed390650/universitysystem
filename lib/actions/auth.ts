"use server";
import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "../workflow";
import config from "../config";
export const signInWithCredentails = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;
  const ip = (await headers()).get("x-fowarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) redirect("/too-fast");
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log({ result });
    if (result?.error) {
      return {
        success: false,
        error: result.error,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    console.log("signin error", error);
    return {
      success: false,
      error: "Something went wrong" + JSON.stringify(error, null, 5),
    };
  }
};
export const signUp = async (params: AuthCredentials) => {
  const { email, password, fullName, universityCard, universityId } = params;
  const ip = (await headers()).get("x-fowarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) redirect("/too-fast");
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    return {
      success: false,
      error: "User already exists",
    };
  }
  const hashPassword = await hash(password, 10);
  try {
    await db.insert(users).values({
      email,
      password: hashPassword,
      fullName,
      universityId,
      universityCard,
    });
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflows/route.ts`,
      body: {
        email,
        fullName,
      },
    });
    await signInWithCredentails({ email, password });

    return {
      success: true,
    };
  } catch (error) {
    console.log("signup error", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
};
