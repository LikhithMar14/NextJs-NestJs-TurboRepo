import { createSession, getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";


export async function GET(req:NextRequest){
    console.log("HIT HIT HIT HIT HIT")
    const {searchParams} = new URL(req.url)
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")
    const userId = searchParams.get("userId")
    const name = searchParams.get("name")

    if(!accessToken || !refreshToken || !userId || !name)throw new Error("Google Oauth failed")
    
    await createSession({
        user:{
            id:userId,
            name:name
        },
        accessToken,
        refreshToken
    });

    return redirect("/")

}   