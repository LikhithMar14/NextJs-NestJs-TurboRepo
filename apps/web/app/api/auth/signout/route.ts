import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    console.log("HIT SIGNOUT")
    const response = await  authFetch(`http://localhost:8000/auth/signout`,{
        method:"POST"
    });
    console.log("Response from signout",response)
    if(response.ok)await deleteSession();

    revalidatePath("/","layout");
    revalidatePath("/","page");
    return NextResponse.redirect(new URL("/",req.nextUrl))
}