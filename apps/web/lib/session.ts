"use server"

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export type Session = {
    user: {
      id: string;
      name: string;
    //   role: Role;
    };
    // accessToken: string;
    // refreshToken: string;
};

const secretKey = process.env.SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);
export async function createSession(payload:Session) {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await new SignJWT(payload).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(encodedKey);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiredAt,
        sameSite: "strict",
        path: "/",
      });

}

export async function getSession(){
    const cookie = (await cookies()).get("session")?.value
    if(!cookie)return null;

    try{
        const { payload } = await jwtVerify(
            cookie,
            encodedKey,
            {
                algorithms: ["HS256"],
            }
        );

        return payload as Session

    }catch(err){
        console.error("Failed to verify the session", err);
        redirect("/auth/sigin");
    }
}

export async function deleteSession(){
    (await cookies()).delete("session");
}