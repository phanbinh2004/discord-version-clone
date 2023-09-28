
import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(
    req: Request,
    {params}:{params: {memberId: string}}
    ){
    try{
        
        const profile = await currentProfile();
        
        const { searchParams } = new URL(req.url);
        const {name,type} = await req.json();
        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }

        if(!serverId){
            return new NextResponse("Server ID missing",{status: 400})
        }

        if(name === "general"){
            return new NextResponse("Name cannot be 'general",{status: 400})
        }

        let server = await db.server.update({
            where: {
                id: serverId,
                member: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                },
            },
            data: {
                channel: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            },
        });
        
        return NextResponse.json(server);

    }catch(error){
        console.log("[CHANNELS_POST]",error);
        return new NextResponse("Internal Error",{status: 500});
    }
}

export async function DELETE(
    req: Request,
    {params}:{params: {memberId: string}}
    ){
    try{
        const profile = await currentProfile();
        
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized",{status: 401})
        }

        if(!serverId){
            return new NextResponse("Server ID missing",{status: 400})
        }

        if(!params.memberId){
            return new NextResponse("Member ID missing",{status: 400})
        }

        let server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                member: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });
        
        return NextResponse.json(server);
        
    }catch(error){
        console.log("[MEMBER_DELETE]",error);
        return new NextResponse("Internal Error",{status: 500});
    }
}