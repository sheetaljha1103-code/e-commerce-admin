import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColum } from "./components/columns";
import {format} from "date-fns"

const BillboardsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

 const formattedBillboard: BillboardColum[] = billboards.map((item) => ({
  id: item.id,
  label: item.label,
  createdAT: format(item.createdAt, "MMM do, yyyy"),
}));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboard} />
        
      </div>
    </div>
  );
};

export default BillboardsPage;