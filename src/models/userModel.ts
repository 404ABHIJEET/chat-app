import mongoose, {Schema, Document} from "mongoose";
import { Message, MessageSchema } from "./messageSchema";

export interface User extends Document {
    name: string,
    username: string,
    email: string,
    password: string
    approved: boolean
    usernames: {username: string, messages: Message[]}[]
    token: string,
    createdAt: Date
}

export const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    approved: {
        type: Boolean,
        required: [true, "Request is not accepted yet"]
    },
    usernames: [{
        username: {
            type: String,
            required: true
        },
        messages: [MessageSchema]
    }],
    token: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel