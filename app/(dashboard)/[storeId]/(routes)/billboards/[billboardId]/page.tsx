
import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardsPage = async ({
  params,
}: {
  params: Promise<{
    billboardId: string;
  }>;
}) => {
  const { billboardId } = await params;

  console.log("PARAM billboardId =", billboardId);

const billboard =
  billboardId === "new"
    ? null
    : await prismadb.billboard.findUnique({
        where: {
          id: billboardId,
        },
      });

console.log("FOUND BILLBOARD =", billboard);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardsPage;