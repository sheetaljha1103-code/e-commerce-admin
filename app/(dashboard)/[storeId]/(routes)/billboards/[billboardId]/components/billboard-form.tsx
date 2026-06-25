"use client";

import * as z from "zod";
import axios from "axios";
import React, { useState } from "react";
import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/image-upload";
import { useOrigin } from "@/hooks/use-origin";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  imageUrl: z.string().min(1, "Image is required"),
});

type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );

        toast.success("Billboard updated.");
      } else {
        await axios.post(
          `/api/${params.storeId}/billboards`,
          data
        );

        toast.success("Billboard created.");
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/billboards`);

      toast.success("Billboard deleted.");
    } catch (error) {
      toast.error(
        "Make sure you removed all categories using this billboard first."
      );
      console.log(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between">
        <Heading
          title={initialData ? "Edit Billboard" : "Create Billboard"}
          description={
            initialData
              ? "Edit a billboard"
              : "Add a new billboard"
          }
        />

        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>

                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url: string) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>

                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="Billboard label"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            {initialData ? "Save Changes" : "Create"}
          </Button>
        </form>
      </Form>

      <Separator className="my-4" />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}/billboards`}
        variant="public"
      />
    </>
  );
};