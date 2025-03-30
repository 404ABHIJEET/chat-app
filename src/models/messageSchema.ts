import {Document, Schema} from "mongoose";

export interface Message extends Document {
    usernames: string[]
    content: string,
    createdAt: Date
}

export const MessageSchema: Schema<Message> = new Schema({
    usernames: {
        type: [String],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})