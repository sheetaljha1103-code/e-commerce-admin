import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import prismadb from "@/lib/prismadb";


export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const billboards = await prismadb.billboard.findMany();

  const store = await prismadb.store.findFirst({
    where: {
        userId
    }
  });

  if (store) {
    redirect(`/${store.id}`)
  }

  return(
    <>
    {children}
    </>
  )
}