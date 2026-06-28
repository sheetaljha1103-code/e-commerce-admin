import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import next from "next";
import { Label } from "radix-ui";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string, billboardId: string }> }
) {
  const { storeId } = await params;

 try {
    const { userId } = await auth();

    const body = await req.json();

    const { label, imageUrl } = body;


    if (!storeId) {
    return new NextResponse("Store id is required", { status: 400 });
  }

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }

     if (!imageUrl) {
      return new NextResponse("image Url is required", { status: 400 });
    }

    if (!(await params).billboardId) {
        return new NextResponse("Billboard id is required", {status:400});
    }

    return NextResponse.json({ success: true });
 
    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: (await params).billboardId,
        
    },
     data: {
      label,
      imageUrl
    },
  });

  return NextResponse.json(billboard)

  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}