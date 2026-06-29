"use client"

import * as z from "zod"
import React, { useState } from "react"
import axios from "axios"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import { Billboard } from "@prisma/client"
import ImageUpload from "@/components/ui/image-upload";


interface BillboardFormProps {
  initialData: Billboard | null
}

const formSchema = z.object({
  label: z.string().min(1, "Label is required"),
  imageUrl: z.string().min(1, "Image is required"),
})

type BillboardFormValues = z.infer<typeof formSchema>

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log('initialData', initialData)
  const title = initialData ? "Edit billboard" : "Create billboard"
  const description = initialData
    ? "Edit billboard details"
    : "Add a new billboard"
  const toastMessage = initialData
    ? "Billboard updated."
    : "Billboard created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  })

console.log("IMAGE URL:", form.watch("imageUrl"));

 const getBillboard = async () => {
  try {
    const response = await axios.get(
      `/api/stores/${params.storeId}/billboards/${params.billboardId}`
    );

    console.log("GET RESPONSE:", response.data);

    toast.success("Billboard fetched.");
  } catch (error) {
    toast.error("Failed to fetch billboard.");
  }
};

  const onSubmit = async (data: BillboardFormValues) => {
    console.log("SUBMIT DATA:", data);
      console.log(data);
    try { 
      setLoading(true)

      if (initialData) {
        await axios.patch(
          `/api/stores/${params.storeId}/billboards/${params.billboardId}`,
          data
        )
      } else {
        await axios.post(`/api/stores/${params.storeId}/billboards`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)

      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      )

      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success("Billboard deleted.")
    } catch (error) {
      toast.error(
        "Make sure no categories are using this billboard first."
      )
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

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
        title={title}
        description={description}
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

    <Separator />

    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid grid-cols-3 gap-8">
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
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  disabled={loading}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                />
                
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button onClick={getBillboard}>
        Test GET
       </Button>

        <Button disabled={loading} type="submit">
          {action}
        </Button>
      </form>
    </Form>
  </>
)

}