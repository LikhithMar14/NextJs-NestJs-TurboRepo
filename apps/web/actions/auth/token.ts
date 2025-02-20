import { BACKEND_URL } from "@/lib/constants"
import { updateToken } from "@/lib/session";

export const refreshToken = async (
    oldRefreshToken: string
  ) => {
    try {
      const response = await fetch(
        "http://localhost:8000/auth/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: oldRefreshToken,
          }),
        }
      );

      console.log("Response from the refresh: ",response)
      if (!response.ok) {
        throw new Error(
          "Failed to refresh token" + response.statusText
        );
      }
  
      const { accessToken, refreshToken } =
        await response.json();

        const updateRes = await fetch(
          "http://localhost:3000/api/auth/update",
          {
            method: "POST",
            body: JSON.stringify({
              accessToken,
              refreshToken,
            }),
          }
        );
        if (!updateRes.ok)
          throw new Error("Failed to update the tokens");
    
        return accessToken;
      } catch (err) {
        console.error("Refresh Token failed:", err);
        return null;
      }
};