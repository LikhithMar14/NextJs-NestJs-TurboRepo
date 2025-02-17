"use server"

import { BACKEND_URL } from "@/lib/constants";
import { createSession } from "@/lib/session";
import { FormResponse, LoginFormSchema } from "@/lib/types"
import { z } from "zod"

export const signIn = async(values:z.infer<typeof LoginFormSchema>):Promise<FormResponse> => {
    const validatedFields = LoginFormSchema.safeParse(values);
    if(!validatedFields.success){
        return {
            success:false,
            message:validatedFields.error.message
        };
    }

    const response = await fetch(
        `${BACKEND_URL}/auth/signin`,
        {
            method:"Post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(validatedFields.data)
        }
    );
    if(response.ok){
        const result  = await response.json();
        console.log(result)
        console.log("Refresh Token from login action ",result.refreshToken)
        await createSession({
            user:{
                id:result.id,
                name:result.name,
            },
            accessToken:result.accessToken,
            refreshToken:result.refreshToken
        })
        return {
            success:true,
            message:"Signin successful"
        }
    }else{
        return {
            success:false,
            message:response.status === 401 ? "Invalid Credentials" : response.statusText
        }
    }
}

