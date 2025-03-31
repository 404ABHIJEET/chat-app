import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {

    await dbConnect()

    try {
        const {name, email, username, password} = await request.json()
        const result = await UserModel.findOne({
            email: email
        })
        if(result) {
            return NextResponse.json({
                success: false,
                message: "User already exists with this email."
            }, {status: 201})
        }
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
            message: "User created successfuylly."
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong, try again later.",
            error: error
        }, {status: 500})
    }
}