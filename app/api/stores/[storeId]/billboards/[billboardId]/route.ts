import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import next from "next";
import { Label } from "radix-ui";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {

  try {
    const { billboardId } = await params;
     console.log(" GET ROUTE HIT");
     
         console.log("billboardId =", billboardId);


    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });


    console.log("billboard =", billboard);


    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;

    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const body = await req.json();

    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params;

    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.delete({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}