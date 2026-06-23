"use client";

import * as React from "react";
import { Store } from "@prisma/client";
import { PopoverTrigger,
        Popover,
        PopoverContent  } 
        from "@/components/ui/popover";
import { useStoreModalStore } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import {  Check, ChevronsUpDown , 
          Stethoscope,
          StethoscopeIcon, 
          Store as StoreIcon} 
          from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
         Command,
         CommandList, 
         CommandInput,
         CommandEmpty,
         CommandGroup ,
         CommandItem,
        CommandSeparator,
      } from 
      "@/components/ui/command";
import { PlusCircle } from "lucide-react";


type PopoverTriggerProps =
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items?: Store[];
}

const StoreSwitcher = ({
  className,
  items = [],
}: StoreSwitcherProps) => {
  const storeModal = useStoreModalStore();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  );

  const [open, setOpen] = useState(false)

  const onStoreSelect = (store:{value:string, label: string}) => {
    setOpen(false)
    router.push(`/${store.value}`)
  }

  return (
    <Popover open ={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
           <Button
  variant="outline"
  size="sm"
  role="combobox"
  aria-expanded={open}
   aria-label="Select a store"
  className={cn("w-50 justify-between", className)}
>
  <StoreIcon className="mr-2 h-4 w-4" />
  {currentStore?.label}
  

</Button>
       </PopoverTrigger>
       <PopoverContent  className="w-180px p-1"> 
          <Command>
            <CommandList>
              <CommandInput  className="h-3 text-xs" placeholder="Search..."/>
              <CommandEmpty>No store found</CommandEmpty>
               <CommandGroup heading="Stores">
                {formattedItems.map((Store)=> (
                  <CommandItem
                  key={Store.value}
                  onSelect={()=> onStoreSelect(Store)}
                  className="text-sm"
                  >
                  <StoreIcon className="mr-2 h-4 w-4" />
                   {Store.label}
                     <Check
                      className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === Store.value
                       ? "opacity-100"
                       : "opacity-0"
                      )}
                       />
                  </CommandItem>
                ))}
               </CommandGroup>
            </CommandList>
            <CommandSeparator/>
            <CommandList>
              <CommandGroup>
                 <CommandItem
                 onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                 }}
                 >
                 <PlusCircle className= "mr-2 h-5 w-5"/>
                  Create new store
                 </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
       </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;