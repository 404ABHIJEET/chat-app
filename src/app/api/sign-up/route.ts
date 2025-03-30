import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {

    await dbConnect()

    try {
        const {name, email, username, password} = await request.json()
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new UserModel({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            approved: false
        })
        await user.save()
        return NextResponse.json({
            success: true,
            message: "User created successfuylly"
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failes to create user",
            error: error
        }, {status: 500})
    }
}