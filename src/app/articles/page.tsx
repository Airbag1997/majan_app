"use client"

import React, { useState } from "react";

export default function Home() {
    const [open, setOpen] = useState(false)

    return (
        <div className="bg-green-900 pt-[30px] pb-[30px]">
            <h1 className="text-[32px] text-white font-bold ml-[30px] mb-[30px]">記事一覧ページ</h1>
            <div className="flex flex-col
                            w-[50vw] max-w-[400px]
                            bg-white 
                            border-r-8 border-b-10 border-[#ffc53f] rounded-[5px] 
                            p-[15px] mx-auto my-[20px]">
                <p className="text-[#ff4949dd] text-[18px] mx-auto">もくじ</p>
                <details className="mt-[10px]">
                    <summary className="flex items-center cursor-pointer" onClick={() => setOpen(!open)}>

                        <span className={`text-[#ff4949dd] text-[14px] duration-300 ${open && "rotate-90"}`}>▶</span>
                        {open ?
                            <span className="text-[14px] text-[#ff4949dd] pl-[5px]">close</span>
                            :
                            <span className="text-[14px] text-[#ff4949dd] pl-[5px]">open</span>
                        }
                    </summary>
                    <ul className="list-disc pl-5 text[3f9cff">
                        <li><a href="#anchor1" className="text-[#313131] hover:text-[#ff4949dd]">タイトル1</a></li>
                        <li><a href="#anchor2" className="text-[#313131] hover:text-[#ff4949dd]">タイトル2</a></li>
                        <li><a href="#anchor3" className="text-[#313131] hover:text-[#ff4949dd]">タイトル3</a></li>
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
                                hover:bg-[#f5faff]
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
                                hover:bg-[#f5faff]
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
                                hover:bg-[#f5faff]
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