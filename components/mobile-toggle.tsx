import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {NavigationSidebar} from "@/components/navigation/navigation-sidebar";
import {ServerSidebar} from "@/components/server/server-sidebar";


export const MobileToggle = ({
    serverId
}: {
    serverId :string;
}) =>{
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px] bg-red">
                    {/* @ts-expect-error Async Server Component */}
                    <NavigationSidebar/>
                </div>
                {/* @ts-expect-error Async Server Component */}
                <ServerSidebar serverId={serverId}/>
            </SheetContent>
        </Sheet>
    )
}