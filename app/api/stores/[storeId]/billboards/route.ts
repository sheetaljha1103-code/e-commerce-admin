import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import next from "next";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { label, imageUrl } = body;

    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if(!(await params).storeId){
      return new NextResponse(" store id is required", {status: 400})
    }

const storeByUserId = await prismadb.store.findFirst({
  where: {
    id: (await params).storeId,
    userId: userId,
  },
});

 if (!storeByUserId) {
  return new NextResponse("unauthorize", {status: 403});
 }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId :  (await params).storeId
      },
    });

    console.log("DATABASE SAVED:", billboard);

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);

    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string }}
) {
  try {
   
    if(! params.storeId){
      return new NextResponse(" store id is required", {status: 400})
    }

const billboards = await prismadb.billboard.findFirst({
  where: {
    id: params.storeId,
  },
});
  
return NextResponse.json(billboards)
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);

    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}