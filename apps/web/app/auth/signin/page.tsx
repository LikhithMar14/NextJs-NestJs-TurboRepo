import React from "react";
import SignInForm from "@/components/auth/signinForm";
import { BACKEND_URL } from "@/lib/constants";

const SignInPage = () => {
  return (
    <div>
      <SignInForm />
      <hr />
    </div>
  );
};

export default SignInPage;
