"use server"

import { authFetch } from "@/lib/authFetch";
import { getSession } from "@/lib/session"


const getProfile = async() => {
    // const session = await getSession();
    // const response =  await fetch(`${process.env.BACKEND_URL}/auth/protected`,{
    //     headers:{
    //         authorization:`Bearer ${session?.accessToken}`
    //     }
    // });



    const response = await authFetch(`${process.env.BACKEND_URL}/auth/protected`)
    console.log(response)
    const result = await response.json();
    return result
}
export default getProfile