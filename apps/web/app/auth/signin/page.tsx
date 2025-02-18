import React from "react";
import SignInForm from "@/components/auth/signinForm";
import { BACKEND_URL } from "@/lib/constants";

const SignInPage = () => {
  return (
    <div>
      <SignInForm />
      <hr />
      <a
        className="border px-4 py-2 rounded bg-sky-600 text-white"
        href={`${BACKEND_URL}/auth/google/login`}
      >
        Sign In With Google
      </a>
    </div>
  );
};

export default SignInPage;
