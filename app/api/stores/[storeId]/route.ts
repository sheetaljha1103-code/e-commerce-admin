import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import next from "next";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params;

  if (!storeId) {
    return new NextResponse("Store id is required", { status: 400 });
  }

 try {
    const { userId } = await auth();

    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    return NextResponse.json({ success: true });
 
    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId: "abc", 
    },
     data: {
    name: "new name",
    },
  });

  return NextResponse.json(store)

  } catch (error) {
    console.log("[STORE_PATCH_ERROR]", error);
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