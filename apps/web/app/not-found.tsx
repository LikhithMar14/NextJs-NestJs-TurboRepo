"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]); 

  return <div>Redirecting...</div>;
};

export default PageNotFound;
