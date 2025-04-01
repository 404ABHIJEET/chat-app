import { Loader2 } from "lucide-react"

const Loading = () => {
    return (
        <div className="h-screen flex justify-center items-center">
            <Loader2 type="spin" />
        </div>
    )
}

export default Loading