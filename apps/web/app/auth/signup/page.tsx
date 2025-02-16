import SignupForm from "@/components/auth/signupForm";
import { Sign } from "crypto";
import Link from "next/link";
import React from "react";

const SignUpPage = () => {
  return (
    <div>
      <SignupForm/>
      <div className="flex justify-between text-sm ">
        <p>Already have an account?</p>
        <Link className="underline ml-2" href={"/auth/signin"}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;