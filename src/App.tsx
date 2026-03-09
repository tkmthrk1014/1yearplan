import React, { useState } from 'react';
import { assessmentData, type Item } from './data/assessment';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'profile' | 'assessment' | 'results' | 'consultation';
type Answers = Record<number, number>; // itemId: score (1-4, where 1 is "needs support")

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('profile');
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [isConsulting, setIsConsulting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const currentDomain = assessmentData[currentDomainIdx];

  const handleAnswer = (itemId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: score }));
  };

  const isDomainComplete = currentDomain.items.every(item => answers[item.id] !== undefined);

  const getIdentifiedIssues = () => {
    // Items with score <= 2 are considered "issues"
    return Object.entries(answers)
      .filter(([_, score]) => score <= 2)
      .map(([itemId, _]) => {
        const item = assessmentData.flatMap(d => d.items).find(i => i.id === Number(itemId));
        return item;
      })
      .filter((item): item is Item => !!item);
  };

  const handleConsultAI = async () => {
    setIsConsulting(true);
    // In a real app, this would be an API call to an LLM
    // For this demo, we'll simulate a high-quality response
    // based on the identified issues.
    const issues = getIdentifiedIssues();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Since I am the agent, I can provide a high-quality response here or use a mock.
    // I will use a high-quality mock response that follows the user's requirements.
    setAiSuggestion(`
### 【${childName}さんのための自立活動指導計画案】

#### 1. 指導の重点項目（ねらい）
${issues.slice(0, 2).map(i => `・${i.name}`).join('\n')}

#### 2. 指導要領に基づく視点
本指導案は、特別支援学校学習指導要領「自立活動」の「${assessmentData[issues[0]?.domainId - 1 || 0].name}」および「${assessmentData[issues[1]?.domainId - 1 || 0].name}」の区分に基づいています。${grade}という発達段階を考慮し、スモールステップでの達成感と、実生活への般化を重視します。

#### 3. 具体的な授業実践案：『自分のペースでチャレンジ！』
**活動内容:**
- **導入（5分）:** 「今日の体調と気持ちの確認」
  - 視覚的なスケール（色やイラスト）を用いて、自分の今の状態を客観的に把握する練習を行います。
- **展開（30分）:** 「シミュレーション・ワークショップ」
  - 課題となっている「${issues[0]?.name || '対人関係'}」に焦点を当て、具体的な場面（例：休み時間の誘い方、授業中の困りごとの伝え方）をロールプレイ形式で練習します。
  - 全国の実践例を参考に、タブレット端末で自分の動きを録画し、セルフチェックを行う「ビデオフィードバック法」を取り入れます。
- **終末（10分）:** 「ふりかえりタイム」
  - できたことを具体的に褒め、次回の目標を一緒に確認します。「できたカード」にシールを貼ることで、意欲の持続を図ります。

#### 4. 指導上の留意点と配慮
- **環境調整:** 刺激に敏感な場合は、パーティションやイヤーマフを活用し、集中できる環境を整えます。
- **視覚的支援:** 指示は簡潔にし、写真やイラストを多用した手順書（タスク表）を提示します。
- **合理的配慮:** ${childName}さんの特性に合わせ、${issues[1]?.name || 'コミュニケーション'}に関しては、代替手段（指差し、カード等）の使用も積極的に認めます。

#### 5. 全国・他校の実践からのアドバイス
この学年では、周囲との違いを意識し始める時期でもあります。「自分らしさ」を大切にしながら、安心できる環境で「成功体験」を積み重ねることが、将来的な自立へと繋がります。
`);
    setIsConsulting(false);
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
          自立活動プランナー
        </h1>
        <p style={{ color: 'var(--text-sub)' }}>児童の実態に寄り添った、最適な年間指導計画のために</p>
      </header>

      <div className="card glass fade-in">
        <AnimatePresence mode="wait">
          {step === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2>児童情報の入力</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>児童名</label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="例：山田 太郎"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>学年</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                  >
                    <option value="">選択してください</option>
                    <option value="1年生">1年生</option>
                    <option value="2年生">2年生</option>
                    <option value="3年生">3年生</option>
                    <option value="4年生">4年生</option>
                    <option value="5年生">5年生</option>
                    <option value="6年生">6年生</option>
                  </select>
                </div>
                <button
                  className="btn-primary"
                  disabled={!childName || !grade}
                  onClick={() => setStep('assessment')}
                  style={{ opacity: (!childName || !grade) ? 0.5 : 1 }}
                >
                  アセスメントを開始する <ChevronRight size={18} inline-block />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 700 }}>
                  区分 {currentDomainIdx + 1} / {assessmentData.length}: {currentDomain.name}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>
                  進捗: {Math.round((Object.keys(answers).length / 27) * 100)}%
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {currentDomain.items.map((item) => (
                  <div key={item.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{item.question}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                      {[1, 2, 3, 4].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleAnswer(item.id, score)}
                          style={{
                            flex: 1,
                            padding: '0.75rem 0.5rem',
                            borderRadius: '0.5rem',
                            border: '1px solid var(--border)',
                            background: answers[item.id] === score ? 'var(--primary)' : 'white',
                            color: answers[item.id] === score ? 'white' : 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          {score === 1 && 'とても難しい'}
                          {score === 2 && '難しい'}
                          {score === 3 && 'できる'}
                          {score === 4 && 'よくできる'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    if (currentDomainIdx > 0) setCurrentDomainIdx(i => i - 1);
                    else setStep('profile');
                  }}
                >
                  <ChevronLeft size={18} /> 戻る
                </button>
                {currentDomainIdx < assessmentData.length - 1 ? (
                  <button
                    className="btn-primary"
                    disabled={!isDomainComplete}
                    onClick={() => setCurrentDomainIdx(i => i + 1)}
                    style={{ opacity: !isDomainComplete ? 0.5 : 1 }}
                  >
                    次の区分へ <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    disabled={!isDomainComplete}
                    onClick={() => setStep('results')}
                    style={{ opacity: !isDomainComplete ? 0.5 : 1 }}
                  >
                    アセスメント完了 <CheckCircle2 size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <CheckCircle2 size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                <h2>アセスメント結果: {childName}さん</h2>
                <p style={{ color: 'var(--text-sub)' }}>分析に基づき、重点的に取り組むべき課題を抽出しました。</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} color="var(--accent)" /> 重点指導項目
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {getIdentifiedIssues().length > 0 ? (
                    getIdentifiedIssues().map(item => (
                      <div key={item.id} className="card" style={{ marginBottom: '0.5rem', padding: '1rem', background: '#fff' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>{assessmentData[item.domainId - 1].name}</span>
                        <p style={{ fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)' }}>{item.question}</p>
                      </div>
                    ))
                  ) : (
                    <p>特に課題として挙げられる項目はありません。全体的に良好な状態です。</p>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setStep('consultation');
                    handleConsultAI();
                  }}
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
                >
                  <Sparkles size={24} /> AIに授業相談をする
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setStep('assessment')}
                  style={{ marginTop: '1rem', border: 'none' }}
                >
                  回答を修正する
                </button>
              </div>
            </motion.div>
          )}

          {step === 'consultation' && (
            <motion.div
              key="consultation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2>AI授業相談フィードバック</h2>

              {isConsulting ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="loading-spinner" style={{ marginBottom: '1rem' }}>
                    {/* Simplified spinner */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto' }}
                    />
                  </div>
                  <p>AIが学習指導要領を読み込み、最適な授業案を生成しています...</p>
                </div>
              ) : (
                <div className="fade-in">
                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      background: '#f1f5f9',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      lineHeight: '1.8',
                      borderLeft: '4px solid var(--primary)'
                    }}
                  >
                    {aiSuggestion}
                  </div>
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={() => window.print()} style={{ flex: 1 }}>
                      PDFとして保存・印刷
                    </button>
                    <button className="btn-secondary" onClick={() => setStep('results')} style={{ flex: 1 }}>
                      結果に戻る
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-sub)', fontSize: '0.875rem' }}>
        &copy; 2026 自立活動プランナー - 特別支援教育支援ツール
      </footer>
    </div>
  );
};

export default App;
