"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModalStore } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModalStore();

  const [loding, setLoading]= useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      throw new Error("x")
      
      const response = await axios.post("/api/stores", values);
      window.location.assign(`/${response.data.id}`)
      toast.success("Store created")
    } catch (error) {
        toast.error("Somthing went wrong")
    }finally{
      setLoading(false)
    }

  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loding}
                      placeholder="E-Commerce"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
             <Button 
                disabled={loding}
                variant = "outline" 
                onClick={storeModal.onClose}>
              Cancel
              </Button>
             <Button disabled={loding} type = "submit">Continue</Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};