import { redirect } from "next/dist/server/api-utils"
import { z } from "zod"
export default function Home() {
    async function sendMessage(formData: FormData){
        'use server'
        const schema = z.object({
            Email: z.string().email("メールアドレスが正しくありません"),
        })
        const Name = formData.get('Name')
        console.log("Name:", Name)
        const Email = formData.get('Email')
        console.log("Email:", Email)
        const Message = formData.get('Message')
        console.log("Message:", Message)
        const result = schema.safeParse({
            Email: formData.get("Email")
        })
        console.log("result:", result.success ? "成功" : result.error.message)
    }
    return (
        <div className="min-h-screen bg-green-600 flex items-center justify-center">
            <form action={sendMessage} className="flex flex-col gap-4 text-center items-center">
                <p className="w-50 bg-yellow-100 text-red-500">お問い合わせ</p>
                <input type="text" placeholder="Name" name="Name" className="border-4 p-2 rounded-md w-100 text-white"></input>
                <input type="text" placeholder="Email" name="Email" className="border-4 p-2 rounded-md w-100"></input>
                <textarea placeholder="Message" name="Message" className="border-4 p-2 h-50 w-100 rounded-md"></textarea>
                <button type="submit" className="w-24 h-6 bg-yellow-100 text-red-500 text-center">送信</button>
            </form>
        </div>
    );
}