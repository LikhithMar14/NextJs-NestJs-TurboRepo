"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";

import { LoginFormSchema } from "@/lib/types";
import { signIn } from "@/actions/auth/login";
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

const SigninForm = () => {
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginFormSchema>) => {
    startTransition(async () => {
      try {
        const response = await signIn(data);
        if(response.success){
          toast.success(response.message,{
            richColors: true
          });
        }else{
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("Signin failed. Please try again.");
      } finally {
        form.reset();
      }
    });
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md ">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-4">
        Sign In
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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

export default SigninForm;
