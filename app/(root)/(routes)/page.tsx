"use client";
import { Modal } from "@/components/ui/modal";
import { useStoreModalStore } from "@/hooks/use-store-modal";
import { Store } from "lucide-react";
import { useEffect } from "react";


export default function SetupPage() {
  const onOpen = useStoreModalStore((state) => state.onOpen);
  const isOpen = useStoreModalStore((State) => State.isOpen);

  useEffect(() => {
     if (!isOpen) {
      onOpen();
     }
  }, [isOpen, onOpen])
  return (
    <div className="p-6">
      {/* <div className="flex justify-end">
        <Modal
  title="Test"
  description="Test Description"
  isOpen
  onClose={() => {}}
>
  Children
</Modal>
      </div> */}

      <h1 className="text-3xl font-bold mt-6">
        Dashboard
      </h1>
    </div>
  );
}