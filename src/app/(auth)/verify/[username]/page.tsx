"use client"

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, {AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormItem, FormField, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>(); //means i need only username from params nothing else

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      if (response.data.success) {
        toast.success("Success", {
          description: response.data.message,
        });
        router.replace(`/sign-in`)
      }
    } catch (error) {
        console.error("error in user signup", error);
        
              const axiosError = error as AxiosError<ApiResponse>;
        
              let errorMessage = axiosError.response?.data.message;
        
              toast.error("Verification Failed", {
                description: errorMessage,
              });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Verification code"
                      {...field}
                    />
                  </FormControl>
                    
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  )
};

export default VerifyAccount;
