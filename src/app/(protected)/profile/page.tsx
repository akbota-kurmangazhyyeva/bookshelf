'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
    const { data,status } = useSession();
    const router = useRouter();
  
    if (status === "loading") {
      return <div>Loading...</div>;
    }
  
    if (status === "unauthenticated") {
      router.push("login");
      return null;
    }
  
  return (
    <div>{data?.user.name}</div>
  )
}

export default page

