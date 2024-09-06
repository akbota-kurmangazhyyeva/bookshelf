// hooks/useAuth.ts
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export function useAuth() {
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [session]);

  const refreshToken = async () => {
    try {
      const res = await axios.post(`${base_url}/auth/refresh-token`, {
        token: session?.refreshToken,
      });
      if (res.data.access_token) {
        // Update the session with the new access token
        await update({
          ...session,
          accessToken: res.data.access_token,
        });
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, sign out the user
      signOut();
    }
  };

  return {
    session,
    status,
    signIn,
    signOut,
    refreshToken,
  };
}