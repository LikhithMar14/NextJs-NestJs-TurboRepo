"use server";

import { BACKEND_URL } from "@/lib/constants";
import { FormResponse, SignupFormSchema } from "@/lib/types";
import { z } from "zod";

export const signUp = async (values: z.infer<typeof SignupFormSchema>): Promise<FormResponse> => {
    const validatedFields = SignupFormSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.message
        };
    }

    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedFields.data),
    });

    if (response.ok) {
        return {
            success: true,
            message: "Signup successful! Redirecting to Login",
            redirect: "/auth/signin"
        };
    }

    return {
        message: response.status === 409 ? "The user already exists!" : response.statusText,
        success: false  
    };
};