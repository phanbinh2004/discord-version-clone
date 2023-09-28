"use client";

import qs from "query-string";
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


export const DeleteChannelModal = () => {
    const {isOpen,onClose,type, data}= useModal();
    const [isLoading,setIsLoading] = useState(false);
    const router = useRouter();
    const { server,channel } = data;
    const isModalOpen = isOpen && type === "deleteChannel";

    const handleDeleteChannel = async () =>{
        try {
            setIsLoading(true);

            const url = qs.stringifyUrl({
                url:`/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.delete(url);

            router.refresh();
            router.push(`/servers/${server?.id}`);
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
                        Delete Your Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to do this? <br /> 
                    <span className="font-semibold text-indigo-500">{channel?.name}</span> will be permanently deleted.
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
                            onClick={handleDeleteChannel}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
