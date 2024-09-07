'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {  // Capitalized the component name
    const { data, status } = useSession();
    const router = useRouter();
  
    if (status === "loading") {
      return <div>Loading...</div>;
    }
  
    if (status === "unauthenticated") {
      router.push("/login");  // Changed to "/login" for proper path
      return null;
    }
  
    return (
      <div>{data?.user?.name}</div>
    );
}

export default Page;

