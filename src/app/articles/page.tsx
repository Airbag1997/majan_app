"use client"

import React, { useState } from "react";

export default function Home() {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <h1 className="text-[32px] font-bold m-[30px]">記事一覧ページ</h1>
            <div className="flex flex-col
                            w-[50vw] 
                            border border-dashed border-[#3f9cff] rounded-[10px] 
                            p-[15px] mx-auto my-[20px]">
                <p className="text-[#3f9cff] text-[18px] mx-auto">もくじ</p>
                <details className="mt-[10px]">
                    <summary className="flex items-center cursor-pointer" onClick={() => setOpen(!open)}>

                        <span className={`text-[#3f9cff] text-[14px] duration-300 ${open && "rotate-90"}`}>▶</span>
                        {open ?
                            <span className="text-[14px] text-[#3f9cff] pl-[5px]">close</span>
                            :
                            <span className="text-[14px] text-[#3f9cff] pl-[5px]">open</span>
                        }
                    </summary>
                    <ul className="list-disc pl-5 text[3f9cff">
                        <li><a href="#anker1" className="text-[#313131] hover:text-[#3f9cff]">タイトル1</a></li>
                        <li><a href="" className="text-[#313131] hover:text-[#3f9cff]">タイトル2</a></li>
                        <li><a href="" className="text-[#313131] hover:text-[#3f9cff]">タイトル3</a></li>
                    </ul>
                </details>
            </div>

            <a href="" className="block 
                                bg-[#fafafa] 
                                mx-auto my-[30px] 
                                px-[25px] py-[15px] 
                                w-[80vw] max-w-[900px] min-w-[400px] 
                                border border-[#969696] rounded-[10px] 
                                text-[#313131] 
                                hover:bg-[#f5faff]
                                ">
                <h2 id="anker1" className="text-[24px] font-bold">タイトル1</h2>
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