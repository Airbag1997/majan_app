"use client"

import React, { useState } from "react";

export default function Home() {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-green-900 pt-[30px] pb-[30px] px-[5%]">
            <h1 className="text-[32px] text-red-600 font-bold text-center rounded-[5px] py-[10px] bg-white">記事一覧ページ</h1>
            <div className="flex flex-col
                            w-[50vw] max-w-[400px]
                            bg-white 
                            border-r-8 border-b-10 border-[#ffc53f] rounded-[5px] 
                            p-[15px] mx-auto my-[20px]">
                <p className="text-red-600 text-[18px] mx-auto">目次</p>
                <details className="mt-[10px]">
                    <summary className="flex items-center cursor-pointer" onClick={() => setOpen(!open)}>

                        <span className={`text-red-600 text-[14px] duration-300 ${open && "rotate-90"}`}>▶</span>
                        {open ?
                            <span className="text-[14px] text-red-600 pl-[5px]">close</span>
                            :
                            <span className="text-[14px] text-red-600 pl-[5px]">open</span>
                        }
                    </summary>
                    <ul className="list-disc pl-5 text-[#313131]">
                        <li><a href="#anchor1" className="text-[#313131] hover:text-red-600">タイトル1</a></li>
                        <li><a href="#anchor2" className="text-[#313131] hover:text-red-600">タイトル2</a></li>
                        <li><a href="#anchor3" className="text-[#313131] hover:text-red-600">タイトル3</a></li>
                    </ul>
                </details>
            </div>

            <a href="" className="block 
                                bg-[#fafafa] 
                                mx-auto my-[30px] 
                                px-[25px] py-[15px] 
                                w-[80vw] max-w-[900px] min-w-[400px] 
                                border-r-8 border-b-10 border-[#ffc53f] rounded-[5px] 
                                text-[#313131] 
                                hover:bg-[#fffae7]
                                ">
                <h2 id="anchor1" className="text-[24px] font-bold">タイトル1</h2>
                <p className="text-[16px] my-[15px]">本文の頭数行、または記事の紹介文を書く。これはサンブル文です。これはサンブル文です。これはサンプル文です。</p>
                <div className="text-[12px] 
                                pb-[5px]
                                flex justify-between">
                    <div>（必要であれば著者名）</div>
                    <div>2025/9/3</div>
                </div>
            </a>
            <a href="" className="block 
                                bg-[#fafafa] 
                                mx-auto my-[30px] 
                                px-[25px] py-[15px] 
                                w-[80vw] max-w-[900px] min-w-[400px] 
                                border-r-8 border-b-10 border-[#ffc53f] rounded-[5px] 
                                text-[#313131] 
                                hover:bg-[#fffae7]
                                ">
                <h2 id="anchor2" className="text-[24px] font-bold">タイトル2</h2>
                <p className="text-[16px] my-[15px]">本文の頭数行、または記事の紹介文を書く。これはサンブル文です。これはサンブル文です。これはサンプル文です。</p>
                <div className="text-[12px] 
                                pb-[5px]
                                flex justify-between">
                    <div>（必要であれば著者名）</div>
                    <div>2025/9/3</div>
                </div>
            </a>
            <a href="" className="block 
                                bg-[#fafafa] 
                                mx-auto my-[30px] 
                                px-[25px] py-[15px] 
                                w-[80vw] max-w-[900px] min-w-[400px] 
                                border-r-8 border-b-10 border-[#ffc53f] rounded-[5px] 
                                text-[#313131] 
                                hover:bg-[#fffae7]
                                ">
                <h2 id="anchor3" className="text-[24px] font-bold">タイトル3</h2>
                <p className="text-[16px] my-[15px]">本文の頭数行、または記事の紹介文を書く。これはサンブル文です。これはサンブル文です。これはサンプル文です。</p>
                <div className="text-[12px] 
                                pb-[5px]
                                flex justify-between">
                    <div>（必要であれば著者名）</div>
                    <div>2025/9/3</div>
                </div>
            </a>
        </div>
    );
}