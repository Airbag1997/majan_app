import React from 'react';
import './page.css'; // CSSファイルをインポート

import Section from './section';

const App: React.FC = () => {
  return (
    <div className="app-container">
    
      <div className="flex flex-col min-h-100">
        
        <main className="main-content">
          <Section title="🀄️ 麻雀はどんなゲーム？">
            <p>麻雀は、4人で遊ぶカードゲームのようなものです。ただし、使うのはトランプではなく、<strong>「牌（パイ）」</strong>と呼ばれる専用の道具。山から牌を引いたり、他のプレイヤーが捨てた牌をもらったりしながら、特定の形に揃えることを目指します。</p>
            <p>この「特定の形」というのが、麻雀の基本的なゴールです。難しいルールや役は、後からゆっくり覚えれば大丈夫！まずは、牌を揃えてみましょう。</p>
          </Section>

          <Section title="🎲 麻雀の道具紹介">
            <p>麻雀を始める前に、基本的な道具を見てみましょう。</p>
            <ul>
              <li><strong>牌（パイ）</strong>: 麻雀のカードです。数字の牌や、風、三元牌といった字牌があります。</li>
              <li><strong>点棒（てんぼう）</strong>: プレイヤーの得点（持ち点）を表す棒です。</li>
              <li><strong>サイコロ</strong>: 親を決める時や、牌の山からどこから取り始めるかを決める時に使います。</li>
              <li><strong>卓（たく）</strong>: 麻雀をプレイするための専用のテーブルです。</li>
            </ul>
          </Section>

          <Section title="🚀 麻雀の最終目標">
            <p>麻雀の最終目標は、<strong>「アガリ」</strong>と呼ばれる特定の形を完成させることです。</p>
            <p>アガリの形は、基本的に<strong>「4つのグループと1つのアタマ」</strong>からできています。この形を一番早く作った人が、その局の勝者となります。</p>
            <div className="example">
              <p><strong>例：</strong></p>
              <p>グループ1（萬子の2,3,4） + グループ2（筒子の5,5,5） + グループ3（索子の7,8,9） + グループ4（白,白,白） + アタマ（東,東）</p>
              <p>このような形を完成させることが目標です。この時点では、どの牌がどのグループになるかなど、深く考えなくても大丈夫です。</p>
            </div>
          </Section>
        </main>
        
      </div>
    
    </div>
  );
};

export default App;

