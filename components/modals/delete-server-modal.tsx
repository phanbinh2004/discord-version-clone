"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";


export const DeleteModal = () => {
    const {isOpen,onClose,type, data}= useModal();
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();
    const { server } = data;
    const isModalOpen = isOpen && type === "deleteServer";

    const handleDeleteServer = async () =>{
        try {
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            router.refresh();
            router.push("/");
            onClose();
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen}  onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Your Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br /> 
                    <span className="font-semibold text-indigo-500">{server?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4 mt-6">
                    <div className="flex items-center justify-between w-full">
                        <Button 
                            className=""
                            disabled={isLoading}
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className=""
                            disabled={isLoading}
                            variant="primary"
                            onClick={handleDeleteServer}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
