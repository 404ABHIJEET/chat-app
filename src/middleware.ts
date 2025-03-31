import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";

export async function middleware(req: NextRequest) {
    
    await dbConnect(); 

    const token = req.cookies.get("token_chat_app")?.value; 
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY as string;
        const decoded = jwt.verify(token, secretKey) as { id: string; exp: number };

        if (Date.now() >= decoded.exp * 1000) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        const user = await UserModel.findById(decoded.id);
        if (!user || user.token !== token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/chat/:path*", "/request:path"],
};
