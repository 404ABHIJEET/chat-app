import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    
    await dbConnect()

    try {
        const { id, token } = await request.json()
        const result = await UserModel.findOne({
            $and: [
                {_id: id},
                {token: token}
            ]
        })
        if(result && result.username) {
            return NextResponse.json({
                success: true,
                message: "User is authenticated"
            }, {status: 200})
        }
        return NextResponse.json({
            success: false,
            message: "User not found."
        }, {status: 200})
    } catch(erro: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to check authentication."
        }, {status: 500})
    }
}