import dbConnect from "@/lib/dbConnect"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import UserModel, { User } from "@/models/userModel"
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {

    await dbConnect()

    try {
        const { identifier, password} = await request.json()
        const result: User | null = await UserModel.findOne({
            $or:[
                {email: identifier},
                {username: identifier}
            ]
        })
        if(result) {
            const isPasswordMatch = await bcrypt.compare(password, result.password)
            if(isPasswordMatch) {
                const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET_KEY ?? "", { expiresIn: "1h" });
                result.token = token
                await result.save()
                const response = NextResponse.json({
                    success: true,
                    message: "Login successfully.",
                    data: {
                        token: token
                    }
                }, {status: 200})
                response.cookies.set("token_chat_app", token, {
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === "production", 
                    sameSite: "strict", 
                    path: "/", 
                    maxAge: 3600, 
                });
                return response
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Invalid password."
                }, {status: 201})
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "User doesn't exist."
            }, {status: 202})
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong, try again later."
        }, {status: 500})
    }
}