function Card({link, title, description }: { link: string; title: string; description: string }) {
  return(
    <a href={link}>
      <div className="flex h-48">
        {/* 白い表面 */}
        
        <div className="bg-white box-border w-60 p-4 rounded-xl z-30 ">
          <div className="flex items-center mb-2">

            <p className="text-xl font-bold">{title}</p>
          </div> 
          <p className="text-gray-600">
            {description}
          </p>
        </div>
        {/* 灰色の層 */}
        <div className="bg-gray-200 w-8 rounded-r-xl -ml-3 z-20"></div>
        {/* オレンジの層 */}
        <div className="bg-orange-400 w-8 rounded-r-xl -ml-3 z-10"></div>
      </div>
    </a>
  )
}

export default function Home() {
    return (
    <div className="bg-green-900">
      <p className="text-4xl text-center text-white pt-10 font-bold">便利なツールで麻雀をもっと楽しく</p>
      <p className="text-lg text-center text-green-50 pt-3 font-bold">点数計算、牌効率シミュレーション、牌譜管理など、実戦や練習で役立つ機能をまとめています。</p>
      <a href="#function">
        <button className="bg-amber-100 px-4 py-1 rounded-sm block mx-auto mb-10 mt-10 w-96 font-bold text-red-700">・機能を見る・</button>
      </a>
      
      <div className="flex justify-around mb-10">

        <img src="/24841217_m.jpg" alt="No image" className="w-[30%] ml-10 object-contain rounded-4xl"/>
        <p className="text-white w-[40%] flex items-center text-sm leading-8 md:leading-14 md:text-lg">
          このサイトでは麻雀の基本ルールや役一覧をわかりやすく解説し、初心者でも安心して学べます。さらに、符と翻を入力するだけで自動的に点数を計算できるツールや、戦術記事・用語集も揃っており、幅広いプレイヤーに役立つ内容を提供しています。
        </p>
      </div>
      

      
      {/* 機能一覧 */}
      <a id="function"></a>
      <div className="flex justify-center pb-15"> 
         
        <div className="gap-15 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 ">
          {/* カード1 */}
          <div>
            <Card
              link="https://www.google.com/?hl=ja"
              title="点数計算ツール"
              description="和了時の点数を符・翻から自動計算。リーチ・ツモ・振り込みも対応"
            />
          </div>
          {/* カード2 */}
          <div>
            <Card
              link="https://www.google.com/?hl=ja"
              title="牌効率シミュレーター"
              description="指定した手牌から最適打牌や残りツモの期待値を表示します（理論ベース）"
            />
          </div>
          {/* カード3 */}
          <div>
            <Card
              link="https://www.google.com/?hl=ja" 
              title="残り枚数カウンター"
              description="オープン/クローズで残枚を管理。リーチ判断や待ちの読みをサポート"
            />
          </div>
          {/* カード4 */}
          <div>
            <Card
              link="https://www.google.com/?hl=ja" 
              title="牌譜保存・共有"
              description="局ごとの牌譜を保存してリンク共有。復習や検討に便利です"
            />
          </div>
          {/* カード5 */}
          <div>
            <Card
              link="https://www.google.com/?hl=ja" 
              title="練習モード（問題集）"
              description="局面ごとに最適手を考えるトレーニング。解答と解説付き"
            />
          </div>
          
          {/* カード6 */}
          <div>
            <Card
              link="https://www.google.com/?hl=ja" 
              title="役一覧・フィルター"
              description="役の条件や符計算例を検索。初心者向けの説明も充実"
            />
          </div>    
        </div>
      </div>
    </div>
  );
}
