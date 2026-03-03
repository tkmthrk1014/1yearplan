export type Domain = {
  id: number;
  name: string;
  items: Item[];
};

export type Item = {
  id: number;
  domainId: number;
  name: string;
  question: string;
};

export const assessmentData: Domain[] = [
  {
    id: 1,
    name: "健康の保持",
    items: [
      { id: 1, domainId: 1, name: "生活のリズムや生活習慣の形成", question: "規則正しい生活習慣を身につけ、生活のリズムを整えることができますか？" },
      { id: 2, domainId: 1, name: "病気の状態の理解と生活管理", question: "自分の病気や体調の変化を理解し、無理をせずに過ごすことができますか？" },
      { id: 3, domainId: 1, name: "身体各部の状態の理解と養護", question: "自分の体の部位の名前や役割を理解し、大切に扱うことができますか？" },
      { id: 4, domainId: 1, name: "障害の特性の理解と生活環境の調整", question: "自分の障害の特性を理解し、過ごしやすい環境を自分や周りと整えることができますか？" },
      { id: 5, domainId: 1, name: "健康状態の維持・改善", question: "必要な薬や処置を理解し、健康な状態を保つための習慣がありますか？" },
    ],
  },
  {
    id: 2,
    name: "心理的な安定",
    items: [
      { id: 6, domainId: 2, name: "情緒の安定", question: "自分の気持ちを落ち着かせ、パニックにならずに過ごすことができますか？" },
      { id: 7, domainId: 2, name: "状況の理解と変化への対応", question: "予定の変更や初めてのことに対して、落ち着いて対応できますか？" },
      { id: 8, domainId: 2, name: "困難を改善・克服する意欲", question: "難しいことにも「やってみよう」という意欲を持って取り組めますか？" },
    ],
  },
  {
    id: 3,
    name: "人間関係の形成",
    items: [
      { id: 9, domainId: 3, name: "他者とのかかわりの基礎", question: "相手の顔を見たり、挨拶をしたりして、人と関わるきっかけを作れますか？" },
      { id: 10, domainId: 3, name: "他者の意図や感情の理解", question: "相手が何を考えているか、どう感じているかを想像することができますか？" },
      { id: 11, domainId: 3, name: "自己の理解と行動の調整", question: "自分の得意・不得意を知り、自分の行動を振り返って調整できますか？" },
      { id: 12, domainId: 3, name: "集団への参加の基礎", question: "クラスやグループの活動に、ルールを守って楽しく参加できますか？" },
    ],
  },
  {
    id: 4,
    name: "環境の把握",
    items: [
      { id: 13, domainId: 4, name: "保有する感覚の活用", question: "目や耳などの感覚を活かして、周りの様子を捉えることができますか？" },
      { id: 14, domainId: 4, name: "感覚や認知の特性についての理解と対応", question: "まぶしさや音の聞こえ方など、自分の感覚の特徴に合わせた工夫ができますか？" },
      { id: 15, domainId: 4, name: "感覚の補助及び代行手段の活用", question: "メガネや補聴器などの補助具を自分に合った方法で使えますか？" },
      { id: 16, domainId: 4, name: "感覚を総合的に活用した状況の把握と行動", question: "周りの状況に合わせて、自分から安全に動くことができますか？" },
      { id: 17, domainId: 4, name: "認知や行動の手掛かりとなる概念の形成", question: "数や大きさ、順番などの基本的な約束事や考え方を理解していますか？" },
    ],
  },
  {
    id: 5,
    name: "身体の動き",
    items: [
      { id: 18, domainId: 5, name: "姿勢と運動・動作の基本的技能", question: "正しい姿勢を保ち、基本的な運動や動作をスムーズに行えますか？" },
      { id: 19, domainId: 5, name: "姿勢保持と運動・動作の補助的手段の活用", question: "車椅子や杖などの道具を使い、自分の動きを助けることができますか？" },
      { id: 20, domainId: 5, name: "日常生活に必要な基本動作", question: "食事、着替え、手洗いなどの身の回りの動作を自分で行えますか？" },
      { id: 21, domainId: 5, name: "身体の移動能力", question: "歩いたり移動したりして、行きたい場所へ安全に行くことができますか？" },
      { id: 22, domainId: 5, name: "作業に必要な動作と円滑な遂行", question: "指先を使ったり、手足を連動させたりして、作業を最後まで進められますか？" },
    ],
  },
  {
    id: 6,
    name: "コミュニケーション",
    items: [
      { id: 23, domainId: 6, name: "コミュニケーションの基礎的能力", question: "相手の話を聞こうとしたり、伝えようとする意欲がありますか？" },
      { id: 24, domainId: 6, name: "言語の受容と表出", question: "言葉の意味を理解し、自分の思いを言葉で伝えることができますか？" },
      { id: 25, domainId: 6, name: "言語の形成と活用", question: "文字や文章、身ぶりなどを使って、より分かりやすく伝えられますか？" },
      { id: 26, domainId: 6, name: "コミュニケーション手段の選択と活用", question: "写真や絵カードなど、自分に合った伝え方を選んで使えますか？" },
      { id: 27, domainId: 6, name: "状況に応じたコミュニケーション", question: "その場の状況に応じた言葉遣いや態度で、相手とやり取りできますか？" },
    ],
  },
];
