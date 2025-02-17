import { BACKEND_URL } from "@/lib/constants"
import { updateToken } from "@/lib/session";

export const refreshToken = async(oldRefreshToken:string) => {
    try{
        const response = await fetch(`${BACKEND_URL}/auth/refresh`,{
            method:"POST",
            body:JSON.stringify({
                refreshToken:oldRefreshToken
            })

        })

        if(!response.ok){
            throw new Error("Failed to refresh the token")
        }

        const  { accessToken,refreshToken } = await response.json();
        //update the session with new tokens

        await updateToken({accessToken,refreshToken});

        return accessToken

    }catch(err){
        console.error("Refresh Token Failed: ",err);
        return null;
    }
}