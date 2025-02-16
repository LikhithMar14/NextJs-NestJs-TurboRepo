"use server"

import { BACKEND_URL } from "@/lib/constants";
import { FormResponse, SignupFormSchema } from "@/lib/types"
import { redirect } from "next/navigation";
import { z } from "zod"


export const signUp = async(values:z.infer<typeof SignupFormSchema>):Promise<FormResponse> => {
    const validatedFields = SignupFormSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            success:false,
            message:validatedFields.error.message
        };
    }
    const response = await fetch(
        `${BACKEND_URL}/auth/signup`,
        {
            method:"Post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(validatedFields.data)
        }
    );
    if(response.ok){

        redirect("/auth/signin");
    }else{

        return {
            message:response.status === 409 ? "The user is already exists!":response.statusText,
            success:false  
        };
    }
}