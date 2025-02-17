"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";

import { SignupFormSchema } from "@/lib/types";
import { signUp } from "@/actions/auth/signup";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "../ui/SubmitButton";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignupFormSchema>) => {
    startTransition(async () => {
      try {
        const response = await signUp(data);
        if (response.success) {
          toast.success(response.message);
          if (response.redirect) {
            router.push(response.redirect); 
          }
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.log("Error: ",error)
        toast.error("Signup failed. Please try again.");
      }finally{
        form.reset()
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md ">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
        Sign Up
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-white">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                    className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton isPending={isPending} />
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
