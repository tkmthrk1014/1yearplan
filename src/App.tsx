import React, { useState } from 'react';
import { assessmentData, type Item } from './data/assessment';
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
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
  const [aiSuggestions, setAiSuggestions] = useState<Record<number, string>>({});
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const currentDomain = assessmentData[currentDomainIdx];

  const handleAnswer = (itemId: number, score: number) => {
    setAnswers(prev => ({ ...prev, [itemId]: score }));
  };

  const isDomainComplete = currentDomain.items.every(item => answers[item.id] !== undefined);

  const getIdentifiedIssues = () => {
    // Items with score <= 2 are considered "issues"
    return Object.entries(answers)
      .filter(([, score]) => score <= 2)
      .map(([itemId]) => {
        const item = assessmentData.flatMap(d => d.items).find(i => i.id === Number(itemId));
        return item;
      })
      .filter((item): item is Item => !!item);
  };

  const generateLessonPlan = (item: Item): string => {
    const domain = assessmentData[item.domainId - 1];
    const score = answers[item.id];
    const difficulty = score === 1 ? 'とても難しい' : '難しい';

    return `### 【${childName}さん（${grade}）のための自立活動 授業案】

---

#### 📋 対象項目
- **区分：** ${domain.name}
- **項目：** ${item.officialName}

#### 📖 指導要領の内容
${item.guideline}

#### 📊 アセスメント結果
現在の評価：**${difficulty}**（${score}/4）

---

#### 1. 指導目標（ねらい）
「${item.officialName}」に関する力を、${childName}さんの実態に即してスモールステップで育てることを目標とします。${grade}の発達段階を考慮し、日常生活や学習場面での般化を重視します。

#### 2. 授業構成（45分）

**【導入】（5分）「今日の自分チェック」**
- 視覚的なスケール（表情カード・色カード）を用いて、今日の体調や気持ちを確認します。
- 前回の振り返りカードを見返し、「前回できたこと」を一緒に確認して自信につなげます。

**【展開①】（15分）「知る・わかる活動」**
- 「${item.name}」に関する具体的な場面をイラストや写真で提示します。
- 「こんなときどうする？」のワークシートを使い、適切な行動や考え方を視覚的に学びます。
- タブレット端末やICT教材を活用し、インタラクティブに理解を深めます。

**【展開②】（15分）「やってみる活動」**
- 学んだ内容を、ロールプレイやシミュレーション形式で実践します。
- 教師がモデルを示した後、${childName}さんが実際にやってみます。
- 成功体験を重視し、必要に応じて手順を細分化（スモールステップ）します。
- ペア活動やグループ活動を取り入れ、自然な場面での般化を促します。

**【まとめ】（10分）「ふりかえりタイム」**
- 「できたことカード」に今日の成果を記録します。
- がんばりシールを貼り、視覚的に達成感を味わえるようにします。
- 次回の目標を一緒に確認し、見通しを持たせます。

#### 3. 指導上の留意点・配慮事項
- **環境調整：** 刺激に敏感な場合は、パーティションやイヤーマフを活用し、集中できる環境を整えます。
- **視覚的支援：** 指示は簡潔にし、写真やイラストを多用した手順書（タスク表）を提示します。
- **個別対応：** ${childName}さんの特性に合わせ、代替手段（指差し、カード等）の使用も積極的に認めます。
- **肯定的評価：** できたことを具体的に褒め、自己肯定感の向上を図ります。

#### 4. 教材・準備物
- 表情カード、振り返りカード、がんばりシール
- ワークシート（「こんなときどうする？」シート）
- タブレット端末（ICT教材）
- イラスト・写真カード
- タスク表（手順書）

#### 5. 評価の観点
- ${item.officialName}に関して、理解が深まったか
- 実践場面で、支援を受けながらも取り組む姿が見られたか
- 振り返りにおいて、自分の変化に気づくことができたか`;
  };

  const handleConsultAI = async (item: Item) => {
    setSelectedIssueId(item.id);
    setIsConsulting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const plan = generateLessonPlan(item);
    setAiSuggestions(prev => ({ ...prev, [item.id]: plan }));
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
                  アセスメントを開始する <ChevronRight size={18} />
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
                <h2>アセスメント結果: {childName}さん（{grade}）</h2>
                <p style={{ color: 'var(--text-sub)' }}>分析に基づき、重点的に取り組むべき課題を抽出しました。</p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={20} color="var(--accent)" /> 重点指導項目
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {getIdentifiedIssues().length > 0 ? (
                    getIdentifiedIssues().map(item => {
                      const domain = assessmentData[item.domainId - 1];
                      const score = answers[item.id];
                      return (
                        <div key={item.id} className="card" style={{ marginBottom: '0.5rem', padding: '1.25rem', background: '#fff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                              {domain.name}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: score === 1 ? '#dc2626' : '#f59e0b',
                              background: score === 1 ? '#fef2f2' : '#fffbeb',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '1rem'
                            }}>
                              {score === 1 ? 'とても難しい' : '難しい'}
                            </span>
                          </div>
                          <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                            {item.officialName}
                          </p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.7', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', borderLeft: '3px solid var(--primary-light)' }}>
                            <BookOpen size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                            <strong>指導要領：</strong>{item.guideline}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p>特に課題として挙げられる項目はありません。全体的に良好な状態です。</p>
                  )}
                </div>
              </div>

              {getIdentifiedIssues().length > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    className="btn-primary"
                    onClick={() => setStep('consultation')}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}
                  >
                    <Sparkles size={24} /> 項目ごとにAI授業案を作成する
                  </button>
                </div>
              )}
              <button
                className="btn-secondary"
                onClick={() => setStep('assessment')}
                style={{ marginTop: '1rem', border: 'none', width: '100%' }}
              >
                回答を修正する
              </button>
            </motion.div>
          )}

          {step === 'consultation' && (
            <motion.div
              key="consultation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Sparkles size={24} color="var(--primary)" />
                <h2 style={{ margin: 0 }}>AI授業案 - 項目別</h2>
              </div>
              <p style={{ color: 'var(--text-sub)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                各項目のボタンをクリックすると、その項目に特化した授業案が生成されます。
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {getIdentifiedIssues().map(item => {
                  const domain = assessmentData[item.domainId - 1];
                  const hasSuggestion = aiSuggestions[item.id] !== undefined;
                  const isCurrentlyLoading = isConsulting && selectedIssueId === item.id;

                  return (
                    <div key={item.id} className="card" style={{ padding: '1.25rem', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                          {domain.name}
                        </span>
                        {hasSuggestion && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 700 }}>
                            ✅ 生成済み
                          </span>
                        )}
                      </div>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{item.officialName}</p>

                      {!hasSuggestion && !isCurrentlyLoading && (
                        <button
                          className="btn-primary"
                          onClick={() => handleConsultAI(item)}
                          disabled={isConsulting}
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem',
                            opacity: isConsulting ? 0.5 : 1
                          }}
                        >
                          <Sparkles size={16} /> この項目の授業案を生成
                        </button>
                      )}

                      {isCurrentlyLoading && (
                        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ width: '32px', height: '32px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 0.75rem' }}
                          />
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>
                            学習指導要領に基づき授業案を生成しています...
                          </p>
                        </div>
                      )}

                      {hasSuggestion && (
                        <div className="fade-in">
                          <div
                            style={{
                              whiteSpace: 'pre-wrap',
                              background: '#f8fafc',
                              padding: '1.5rem',
                              borderRadius: '0.5rem',
                              fontSize: '0.9rem',
                              lineHeight: '1.8',
                              borderLeft: '4px solid var(--primary)',
                              marginTop: '0.75rem',
                              maxHeight: '500px',
                              overflowY: 'auto'
                            }}
                          >
                            {aiSuggestions[item.id]}
                          </div>
                          <button
                            className="btn-secondary"
                            onClick={() => window.print()}
                            style={{ marginTop: '0.75rem', width: '100%', fontSize: '0.85rem' }}
                          >
                            この授業案を印刷・PDF保存
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button className="btn-secondary" onClick={() => setStep('results')} style={{ flex: 1 }}>
                  <ChevronLeft size={16} /> 結果に戻る
                </button>
              </div>
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
