import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { SettingsFrom } from "./components/settings-form";

interface SettingsPageProps {
  params: Promise<{
    storeId: string;
  }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { storeId } = await params;

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-0 p-8 pt-6">
        <SettingsFrom initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;