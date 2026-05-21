import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, AlertCircle, TrendingUp, ShieldAlert, PieChart, ArrowRight, 
  RefreshCcw, Home, Sparkles, Flame, Percent, HelpCircle, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Clock, Star, LineChart, CheckCircle2, DollarSign,
  ShieldCheck, Download, Printer, Clipboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DiagnosisResult, Holding } from './types';

const COLORS = ['#DC2626', '#1E293B', '#334155', '#475569', '#64748B', '#94A3B8'];

// Real-Time stock indices benchmark (pasted from choice stock)
const INDICES_DATA = [
  { name: '다우 지수', value: '50,009.35', change: '+645.47', percent: '+1.31%', isUp: true },
  { name: '나스닥 지수', value: '26,270.36', change: '+399.65', percent: '+1.54%', isUp: true },
  { name: 'S&P 500', value: '7,432.97', change: '+79.36', percent: '+1.08%', isUp: true },
  { name: '원/달러', value: '1,505.90', change: '+7.40', percent: '+0.49%', isUp: true },
  { name: '다우 선물', value: '50,010.00', change: '+84.00', percent: '+0.17%', isUp: true },
  { name: '나스닥 선물', value: '29,266.00', change: '+124.50', percent: '+0.43%', isUp: true },
  { name: 'S&P500 선물', value: '7,435.50', change: '+16.25', percent: '+0.22%', isUp: true }
];

// Pasted rising stocks
const RISING_STOCKS = [
  { name: '클라리테브', symbol: 'CTEV', price: '21.24', change: '+31.11%', reason: 'AI 매매신호 포착' },
  { name: 'CCSC테크놀로지', symbol: 'CCTG', price: '0.59', change: '+27.98%', reason: '어닝콜 서프라이즈' },
  { name: '비트코인디포', symbol: 'BTM', price: '0.72', change: '+27.53%', reason: '가상자산 유동성 급증' },
  { name: '디지마크코퍼레이션', symbol: 'DMRC', price: '12.05', change: '+26.31%', reason: '특허 알고리즘 시너지' },
  { name: '캡스톤홀딩', symbol: 'CAPS', price: '0.39', change: '+26.23%', reason: '골든크로스 상단 돌파' }
];

// Pasted investment recipe cards
const RECIPES_DATA = [
  { title: '발굴! 성장주', desc: '성장률 높은 로켓에 올라타자!', gain: '+102%', descSub: 'AI가 필터링한 핵심 수혜 종목', color: 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15', border: 'border-orange-200/50', badgeColor: 'bg-orange-500', icon: Flame },
  { title: '로켓 성장주', desc: '상승 에너지가 가득 찬 주도 주식', gain: '+188%', descSub: '외인·기관 연일 순매수 종목', color: 'from-rose-500/10 to-red-500/10 hover:from-rose-500/15 hover:to-red-500/15', border: 'border-rose-200/50', badgeColor: 'bg-rose-500', icon: Sparkles },
  { title: '골든크로스', desc: 'AI가 찾아낸 양봉 추세전환 종목', gain: '+579%', descSub: '정배열 진입 황금 돌파 종목', color: 'from-purple-500/10 to-indigo-500/10 hover:from-purple-500/15 hover:to-indigo-500/15', border: 'border-purple-200/50', badgeColor: 'bg-purple-500', icon: LineChart },
  { title: '고배당주 킹', desc: '초보도 벌 수 있는 투자의 정석', gain: '+225%', descSub: '세전 배당수익률 6.5% 돌파군', color: 'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15', border: 'border-emerald-200/50', badgeColor: 'bg-emerald-500', icon: Percent },
  { title: '인기 TOP50', desc: '투자자들이 가장 주목하는 랭킹', gain: '+50%', descSub: '주간 검색 트래픽 급상승', color: 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/15 hover:to-indigo-500/15', border: 'border-blue-200/50', badgeColor: 'bg-blue-500', icon: Star },
  { title: '오늘의 급등주', desc: '상승주는 떡잎부터 알아본다', gain: '+30%', descSub: '단기 이동평균 정밀 매매 시점', color: 'from-cyan-500/10 to-sky-500/10 hover:from-cyan-500/15 hover:to-sky-500/15', border: 'border-cyan-200/50', badgeColor: 'bg-cyan-500', icon: TrendingUp },
];

// Premium previews layout
const PREMIUM_PREVIEWS = [
  { initial: '테', title: '테슬라 (TSLA)', summary: '자율주행 FSD 라이선스 임박 및 판매 기지 확대 수혜', price: '417.26', change: '+2.82%', label: '배당매력 우수' },
  { initial: '아', title: '아이에스에이', summary: 'AI 전력 공급 제어 칩 신규 수주 및 사상 최대 마진 달성', price: '265.01', change: '-1.85%', label: '실적 상회' },
  { initial: '오', title: '오픈AI 제휴그룹', summary: '차세대 LLM 언어 모델 탑재 소프트웨어 상용화 개시', price: '188.16', change: '-1.36%', label: '기술 지표 우수' }
];

// FAQs
const FAQS = [
  { q: '매매신호는 어떻게 표시되나요?', a: '특허받은 AI 퀀트 알고리즘을 바탕으로 하루 3회 정밀 갱신되며, 매수 적기일 때 강력수급신호가 포착됩니다.' },
  { q: '분석 결과는 정기적으로 저장되나요?', a: '본 진단기는 회원가입과 로그인을 일절 요구하지 않는 100% 비저장 일회용 분석 도구입니다. 개인정보 유출 우려가 전혀 없도록 업로드 후 가치 평가 연산 즉시 이미지가 메모리상에서 즉각 파기 및 자동 영구 삭제되므로, 필요 시 다운로드(.txt) 및 인쇄(PDF 저장) 기능을 이용해 분석 결과를 개별 보관해 주세요.' },
  { q: '계좌 캡처 이미지로 종목 분석은 어떻게 이뤄지나요?', a: '영웅문, 크레온, 나무 등 증권사 화면을 캡처하여 올리시면 AI 멀티모달 인식 기능이 보유 단가와 수량을 정확히 파악하여 전문 퀀트 권고안과 비교 진단합니다.' }
];

const DUMMY_DATA: DiagnosisResult = {
  analysisDate: "2026년 5월 21일",
  summary: {
    label: "특정 원자재·IT 밀집 경고 포트폴리오",
    score: 41,
    description: "현재 한 두 개의 과열 섹터에 전체 투자금이 거의 균등 편중되어 있어 미 국채 금리 움직임에 취약한 상태입니다.",
    tags: ["비중 편중", "리스크 초과", "배당 매력 지체"],
    strategyText: "순환매 대항을 위한 기계적 부분 분할 리밸런싱"
  },
  stats: {
    totalProfit: -14500000,
    totalYield: -24.8,
    sectorConcentration: "집중 경고 (75%↑)",
    recoveryMonths: 9,
    riskScore: 78
  },
  holdings: [
    { name: "삼성전자", profit: -3120000, yield: -8.4, quantity: 450, avgPrice: 82000, sector: "반도체", riskLevel: "low", status: "주의", analysis: "부품 수급 병목으로 단기 기술적 조정 단계입니다. 평단가 근접 반등 시 교체 기회를 포착하십시오.", strategy: "반등 국면 시 비중 15% 기계적 매도 후 고배당 금융주 편입 수율 향상 권고", consensusGap: 21.3 },
    { name: "LG에너지솔루션", profit: -9800000, yield: -28.5, quantity: 80, avgPrice: 480000, sector: "2차전지", riskLevel: "high", status: "위험군", analysis: "업계 전반의 캐즘 이슈로 장기 바닥을 다지는 중입니다. 현재 낙폭이 크다고 해서 추가로 목돈을 밀어넣는 물타기는 극도로 만류합니다.", strategy: "추가 매수 보류, 횡보 대기 후 3분기 업황 턴어라운드를 차분히 모니터링", consensusGap: 14.8 },
    { name: "현대차", profit: 1820000, yield: 11.2, quantity: 150, avgPrice: 215000, sector: "자동차", riskLevel: "medium", status: "수익권", analysis: "하이브리드 신차 가치 및 적극적인 자사주 매입 주주 가치 환원으로 업종 내 매력도가 가장 높게 우지되고 있습니다.", strategy: "이익 보전 홀딩, 분기 세일즈 데이터 모니터링 및 목표가 정점 분할 익절 전략", consensusGap: 19.5 }
  ],
  sectors: [
    { name: "2차전지", percentage: 55 },
    { name: "반도체", percentage: 30 },
    { name: "자동차", percentage: 15 }
  ],
  sectorAnalysisText: "2차전지와 반도체 부문에만 85%의 과잉 비중이 쏠려있어 지수 하락 시 방어력이 매우 부족합니다.",
  actionPlan: {
    shortTerm: "2주 내 추가 매수 계획을 중단하고 상대적으로 버텨주는 현대차 우량 자산의 수익을 가꾸어 나가십시오.",
    longTerm: "3개월 내에 방어 성격의 배당 우량 섹터(금융, 필수소비재)를 최소 20% 이상 채워 거시 충격을 분산하십시오."
  },
  advice: {
    step1: {
      title: "변동성 경계 단계",
      content: "보유 자산 배분 비중이 특정 선도 부문에 치우쳐 변동 폭이 코스피 평균지수 대비 2.2배 높습니다.",
      items: ["삼성전자 주의 권고", "LG에너지솔루션 고위험 대응"]
    },
    step2: {
      title: "기계적 포트 기둥 형성",
      content: "비교적 매력이 확인된 자동차 등 방어 가치 성격의 실적 우량 기업군이나 정기 배당주로 갈아타 현금 유입 채널을 만드십시오.",
      recommendation: "안정형 현금 배당주 20% 교환"
    },
    step3: {
      title: "비중 재할당 실시",
      content: "매주 화요일과 목요일 오전 시간대에 감정에 지배되지 않게 기계적인 점선 비율로 자본 일부를 양도 분할 수급하는 것을 실천 권유합니다.",
      plan: ["감정 배제 스케줄러 매매", "안전 현금 버퍼 15% 확보"]
    }
  },
  focusStock: {
    name: "LG에너지솔루션",
    yield: -28.5,
    link: "#"
  },
  conclusion: "보유 포트폴리오는 전형적인 성장 고온 다습 집중 계좌입니다. 기계적인 비중 리밸런싱 규율과 손익 방어 모델링을 정기적으로 작동 시켜 안전판을 구축하십시오."
};

const compressAndResizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxW = 1200;
        const maxH = 8000;

        if (width > maxW) {
          const ratio = maxW / width;
          width = maxW;
          height = height * ratio;
        }

        if (height > maxH) {
          const ratio = maxH / height;
          height = maxH;
          width = width * ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

function CustomDonutChart({ data, colors }: { data: { name: string; percentage: number }[]; colors: string[] }) {
  let accumulatedPercent = 0;
  return (
    <svg viewBox="0 0 100 100" className="w-48 h-48 select-none sm:w-56 sm:h-56">
      {data.map((sector, index) => {
        const percent = sector.percentage;
        const color = colors[index % colors.length];
        const radius = 35;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = `${circumference} ${circumference}`;
        const strokeDashoffset = circumference - (percent / 100) * circumference;
        const rotation = (accumulatedPercent / 100) * 360 - 90;
        
        accumulatedPercent += percent;
        
        return (
          <circle
            key={sector.name}
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="11"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(${rotation} 50 50)`}
            className="transition-all duration-300 hover:stroke-[13] cursor-pointer"
            style={{ transformOrigin: "50px 50px" }}
          />
        );
      })}
    </svg>
  );
}

export default function App() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'signals' | 'recipes'>('all');
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopyShareText = () => {
    if (!result) return;
    
    const holdingSummaries = result.holdings.map((h: any) => 
      `• [${h.name}] 수익률: ${h.yield > 0 ? '+' : ''}${h.yield}% | AI전략: ${h.strategy}`
    ).join('\n');

    const shareText = `[초이스스탁 AI 포트폴리오 진단 리포트]
분석일자: ${result.analysisDate}
진단 총평: ${result.summary.label}
계좌 종합 점수: ${result.summary.score}점 (100점 만점)

[개별 종목 대응 가이드]
${holdingSummaries}

[AI 추천 포트폴리오 로드맵]
- 단기 조치: ${result.actionPlan.shortTerm}
- 중장기 로드맵: ${result.actionPlan.longTerm}

※ 초이스스탁 AI는 회원가입이나 개인정보를 입력받지 않으며, 이미지 파일은 분석 직후 안전 파괴됩니다!`;

    navigator.clipboard.writeText(shareText);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const holdingDetails = result.holdings.map((h: any) => `
--------------------------------------------------
■ 종목명: ${h.name} (${h.sector})
- 보유수량: ${h.quantity.toLocaleString()}주 | 매입단가: ${h.avgPrice.toLocaleString()}원
- 평가손익: ${h.profit.toLocaleString()}원 | 누적수익률: ${h.yield > 0 ? '+' : ''}${h.yield}%
- 정밀 진단: ${h.analysis}
- AI CPR 대응 로직: ${h.strategy}
--------------------------------------------------`
    ).join('\n');

    const reportText = `==================================================
      초이스스탁 AI 포트폴리오 정밀 분석 리포트
==================================================
분석일 일자: ${result.analysisDate}
대표 진단평: ${result.summary.label}
종합 리스크 스코어: ${result.stats.riskScore}점 / 포트폴리오 종합 점수: ${result.summary.score}점

[종합 통계 사항]
- 총 손익 합계: ${result.stats.totalProfit.toLocaleString()}원
- 종합 분석 수익률: ${result.stats.totalYield > 0 ? '+' : ''}${result.stats.totalYield}%
- 대표 부문 비중 강도: ${result.stats.sectorConcentration}

[분석 대상 보유 주식 현황]
${holdingDetails}

[섹터별 과밀집도 및 분산 리스크 진단]
- 현재 분산 점검: ${result.sectorAnalysisText}

[AI 즉시실행 수율 개선 3대 과제]
1단계 [${result.advice.step1.title}]: 
- 세부내용: ${result.advice.step1.content}
${result.advice.step1.items?.map(it => `  * ${it}`).join('\n') || ''}

2단계 [${result.advice.step2.title}]:
- 세부내용: ${result.advice.step2.content}
  * 성격 권고: ${result.advice.step2.recommendation || ''}

3단계 [${result.advice.step3.title}]:
- 세부내용: ${result.advice.step3.content}
${result.advice.step3.plan?.map(p => `  * ${p}`).join('\n') || ''}

[퀀트 센터 최정 조율 한마디]
"${result.conclusion}"

==================================================
초이스스탁 AI는 고객님의 소중한 개인정보와 이미지를 DB나 클라우드 서버에 일절 저장하지 않으며, AI 정밀 연산 실행 직후 모든 업로드 파일은 재생 불가 상태로 완전히 폭파 및 소멸 처리됩니다.
Data Powered by NASDAQ and S&P Global.
==================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ChoiceStock_AI_Asset_Report_${result.analysisDate.replace(/[\s년월일]+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const runAnalysis = async (base64: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: base64 }),
      });
      
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        setError(`스캔 결과를 디코딩하는 과정에서 서버 지연이 생겼습니다. 샘플 보기를 누르면 미리 준비된 체계적 양식을 감상하실 수 있습니다.`);
        setLoading(false);
        return;
      }
      
      if (!res.ok) {
        setError(data.error || '스캔 분석 중 오류가 발생했습니다.');
        setLoading(false);
        return;
      }
      
      setResult(data);
      setLoading(false);
    } catch (err: any) {
      setError(`네트워크 지연이 발생했습니다. 다시 시도하시거나 샘플 레포트 버튼을 이용해 보세요.`);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const base64 = await compressAndResizeImage(file);
      e.target.value = '';
      await runAnalysis(base64);
    } catch (err) {
      setError('이미지 압축 및 보정 중 지연이 생겼습니다.');
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (loading) return;
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('지원하는 스크린샷 이미지 형식(*.png, *.jpg, *.jpeg)을 등록해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64 = await compressAndResizeImage(file);
      await runAnalysis(base64);
    } catch (err) {
      setError('이미지 파일 변환 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900 bg-[#f8fafc] font-sans pb-24 selection:bg-rose-600/10 overflow-x-hidden antialiased">
      {/* 🔴 Top Premium Navigation Menu */}
      <header className="sticky top-0 z-50 bg-[#1e293b] text-white shadow-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4 sm:gap-10">
            {/* Elegant Brand Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setResult(null)}>
              <div className="bg-rose-600 text-white p-2 rounded-xl shadow-lg shadow-rose-600/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base sm:text-xl font-black tracking-tight text-white block">
                  초이스스탁 <span className="text-rose-500 text-xs sm:text-sm font-black italic bg-rose-600/10 px-2 py-0.5 rounded ml-1">AI</span>
                </span>
                <span className="text-[9px] text-slate-400 font-bold block leading-none">by DATAHERO</span>
              </div>
            </div>

            {/* Pasted Navigation Menu */}
            <nav className="hidden md:flex items-center gap-6 text-slate-300 font-bold text-sm">
              <button onClick={() => setResult(null)} className="hover:text-white transition-colors text-xs text-white bg-slate-800 px-3 py-1 rounded">홈</button>
              <a href="#search" className="hover:text-white transition-colors text-xs text-slate-400">검색</a>
              <a href="#rising" className="hover:text-white transition-colors text-xs text-slate-400">추천/신호</a>
              <a href="#recipes" className="hover:text-white transition-colors text-xs text-slate-400">뉴스/발굴</a>
              <a href="#faq" className="hover:text-white transition-colors text-xs text-slate-400">관심</a>
              <span className="text-[10px] text-rose-500 font-black px-1.5 py-0.5 rounded border border-rose-500/20 bg-rose-500/5 select-none animate-pulse">초이스스탁</span>
            </nav>
          </div>

          {/* Persistent Secure Badges */}
          <div className="flex items-center gap-2.5">
            <span className="hidden lg:inline text-xs text-slate-300 mr-2 border-r border-slate-700/50 pr-4">2026-05-21 기준 무상 최신 정보 반영</span>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 select-none animate-pulse-slow">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              가입없음 · 정보비저장 휘발성 진단 무료 제공
            </div>
          </div>
        </div>
      </header>

      {/* 📈 28.05.21 기준 실시간 글로벌 주요 마켓 지수 전광판 (Ticker loop styled neatly for premium financial feel) */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 overflow-hidden relative z-10 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0 bg-slate-800 text-[10px] text-white px-2.5 py-1 rounded font-black tracking-wider uppercase">
            <Clock className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" /> Realtime Market INDICES
          </div>
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-none py-0.5 text-xs sm:text-xs">
            {INDICES_DATA.map((idx, i) => (
              <div key={i} className="flex items-center gap-1.5 shrink-0 select-none">
                <span className="text-slate-400 font-bold">{idx.name}</span>
                <span className="font-black text-white font-mono">{idx.value}</span>
                <span className="flex items-center text-xs font-black text-rose-500">
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  {idx.change} ({idx.percent})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-10"
            >
              {/* Top Banner Alert (Pasted Morning briefing summary) */}
              <div className="bg-slate-100 hover:bg-slate-200/80 transition-all border border-slate-200/60 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-800 max-w-5xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-rose-600"></div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-rose-600 text-white shrink-0 text-[10px] px-2 py-0.5">모닝브리핑</Badge>
                  <span className="truncate text-slate-700">아스테라랩스 17% · ARM 15% 급등! ... 엔비디아 실적 대기 속 미증시 상승 랠리</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-[11px] shrink-0">
                  <span>엔비디아 주당순이익 $1.87 (상회)</span>
                  <ChevronRight className="w-4 h-4 cursor-pointer text-slate-400" />
                </div>
              </div>

              {/* Title Header with Choice Stock wording */}
              <div className="text-center space-y-4 pt-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-inner">
                  <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" /> 특허받은 알고리즘 계좌 심폐소생술 (CPR)
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-slate-900 leading-[1.12]">
                  내 주식 계좌, <br className="sm:hidden"/>
                  <span className="text-rose-600 border-b-4 border-rose-100 py-1">냉정한 심폐소생</span>이 필요할까?
                </h1>
                <p className="text-slate-500 text-sm sm:text-base font-bold leading-relaxed max-w-xl mx-auto opacity-90 break-keep">
                  증권사 MTS 스크린샷 한 장으로 완성하는 데이터 스마트 매매 진단 리포트. AI가 개별 종목의 적정 주가 괴리율과 섹터 과밀집도를 감정 없이 측정해 드립니다.
                </p>
              </div>

              {/* 📊 Main Content Column & Sidebar Benchmark Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                
                {/* 🎯 LEFT: Upload Tool Box & Smart persistence block (7 columns) */}
                <div className="lg:col-span-7 space-y-6">
                  <div 
                    className={cn(
                      "floating-card bg-white group cursor-pointer relative overflow-hidden border transition-all duration-300 rounded-3xl p-8 sm:p-14 text-center",
                      isDragging ? "border-rose-600 bg-rose-50/10 scale-[1.01] shadow-xl shadow-rose-600/5 animate-pulse-slow" : "border-slate-200 shadow-sm hover:border-slate-300"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleFileUpload}
                      accept="image/*"
                      disabled={loading}
                    />

                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 bg-rose-50/80 text-rose-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300 shadow-md border border-rose-200/30 relative">
                        {loading && (
                          <div className="absolute inset-0 border-4 border-rose-200 border-t-rose-600 rounded-2xl animate-spin"></div>
                        )}
                        {loading ? (
                          <RefreshCcw className="w-8 h-8 animate-spin-slow" />
                        ) : (
                          <Upload className="w-8 h-8 text-rose-600" />
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">계좌 스크린샷 즉하 업로드</h3>
                        <p className="text-xs sm:text-sm text-slate-500 font-bold">보유 수량 및 평단가가 기재된 스마트폰 MTS 화면을 캡처해서 올려주세요</p>
                        <p className="text-[11px] text-slate-400 font-medium">영웅문, 나무, 주식 투자가이드 등 모든 국내외 증권사 캡처본 인식 가능</p>
                      </div>

                      {loading && (
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-xs font-black text-rose-600 animate-pulse tracking-widest">초이스스탁 멀티모달 포트폴리오 스캔 및 해독 분석 중...</p>
                          <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ x: "-100%" }}
                               animate={{ x: "100%" }}
                               transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                               className="w-full h-full bg-rose-600"
                             />
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="mt-2 p-4 bg-rose-50 border border-rose-100 rounded-2xl max-w-sm mx-auto text-left shadow-sm">
                          <p className="text-xs text-rose-600 font-bold mb-3">{error}</p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setError(null);
                              }}
                              className="text-xs font-bold rounded-lg border-rose-200 hover:bg-rose-100/30 text-rose-700 py-3"
                            >
                              재시도
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setResult(DUMMY_DATA);
                                setError(null);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg py-3"
                            >
                              샘플 데이터 즉시 로드
                            </Button>
                          </div>
                        </div>
                      )}

                      {!loading && !error && (
                        <div className="flex justify-center pt-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setResult(DUMMY_DATA);
                            }}
                            className="bg-slate-100 font-black text-slate-800 hover:bg-slate-200 rounded-full px-6 py-4 text-xs tracking-tight border border-slate-200"
                          >
                            초이스스탁 진단 샘플 보고서 한눈에 체험하기
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🔒 개인정보 유출 NO! 데이터 즉시 파기 선언 */}
                  <div className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-all border border-emerald-500/15 rounded-3xl p-6 flex items-start gap-4 shadow-inner">
                    <div className="p-2 sm:p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl shrink-0">
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-black text-emerald-800 leading-tight">개인정보 수집 제로 및 기밀성 연산 준수 실천</h4>
                      <p className="text-[11px] sm:text-xs text-emerald-700/80 leading-relaxed font-bold max-w-xl break-keep">
                        본 서비스는 어떠한 형태의 회원가입이나 로그인 절차도 필요로 하지 전격 배제합니다. 업로드해주시는 모든 스크린샷 이미지와 매칭 가치 데이터는 <strong>AI 연산 완료 및 브라우저 출력 즉각 완전 자동 폐기 소멸 처리</strong>되므로 안심하고 점검해 보십시오.
                      </p>
                    </div>
                  </div>

                  {/* 🍔 Investment Recipe Grid (추천 레시피 - pasted from choice stock) */}
                  <div id="recipes" className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 bg-rose-600 h-5 rounded"></div>
                      <h4 className="text-md font-bold text-slate-800 tracking-tight">AI가 실적과 수급 분석으로 엄선한 투자 레시피</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {RECIPES_DATA.map((recipe, index) => {
                        const IconComponent = recipe.icon;
                        return (
                          <div key={index} className={cn("p-4 rounded-2xl border bg-gradient-to-br shadow-inner transition-all flex flex-col justify-between cursor-pointer group", recipe.color, recipe.border)}>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className={cn("text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider", recipe.badgeColor)}>
                                  {recipe.title}
                                </span>
                                <IconComponent className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-xs font-bold text-slate-800 pt-1 line-clamp-1">{recipe.desc}</p>
                              <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{recipe.descSub}</p>
                            </div>
                            <div className="text-right pt-2">
                              <span className="text-rose-600 font-extrabold text-sm ml-auto block tracking-tighter">{recipe.gain} 누적</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQ Block */}
                  <div id="faq" className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">주요 자주 묻는 질문 (FAQ)</h4>
                    </div>
                    <div className="space-y-3.5">
                      {FAQS.map((faq, i) => (
                        <div key={i} className="text-xs space-y-1 bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                          <p className="font-bold text-slate-800 flex items-center gap-1">
                            <span className="text-rose-500 font-black">Q.</span> {faq.q}
                          </p>
                          <p className="text-slate-500 font-medium leading-relaxed pl-3.5">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* 🎯 RIGHT: Sidebar Market Score Gauge & Rising Stocks (5 columns) */}
                <div className="lg:col-span-5 space-y-6">

                  {/* 🔴 Choice Stock Market Score Card (마켓스코어 59점 과욕 단계) */}
                  <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b border-slate-200/60 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Market sentiment score</span>
                        <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">2026.05.21 기준</span>
                      </div>
                      <CardTitle className="text-md font-extrabold text-slate-900 pt-1.5 leading-none">
                        마켓스코어 <span className="text-rose-600 font-black">59점</span>, 과욕 단계입니다
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-5">
                      {/* Visual gauge dial replacement */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-400">
                          <span>공포 (0포인트)</span>
                          <span className="text-rose-600 font-black">과욕 (59포인트)</span>
                          <span>탐욕 (100포인트)</span>
                        </div>
                        <div className="h-3.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden relative">
                          {/* Colored regions */}
                          <div className="absolute top-0 bottom-0 left-0 w-[40%] bg-blue-500"></div>
                          <div className="absolute top-0 bottom-0 left-[40%] w-[35%] bg-amber-500"></div>
                          <div className="absolute top-0 bottom-0 left-[75%] w-[25%] bg-rose-500"></div>
                          {/* Needle Indicator */}
                          <div 
                            className="absolute top-0 bottom-0 w-2.5 bg-slate-900 border border-white shadow-md z-30 transition-all duration-1000" 
                            style={{ left: '59%' }}
                          ></div>
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed text-center pt-1 break-keep">
                          현재 미국 빅테크 어닝 실적 호조가 지속되며 증시는 <strong>과열 단계</strong>에 머물고 있습니다. 신규 진입보다는 보유 계좌 리배런싱에 유리한 시점입니다.
                        </p>
                      </div>
                      <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
                        <span>초이스스탁 AI 진단 모델링</span>
                        <span className="text-rose-600 flex items-center gap-0.5 cursor-pointer hover:underline">자세히 보기 <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 🎯 Rising stocks widget */}
                  <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-600 block uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-4 h-4 fill-rose-500" /> HOT SIGNAL TARGETS
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">실시간 전일대비 기준</span>
                      </div>
                      <CardTitle className="text-base font-black text-slate-900 pt-1 leading-none">
                        최근 매매신호 호전 및 급등 종목
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 divide-y divide-slate-100">
                      {RISING_STOCKS.map((stock, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors px-2 rounded-xl group cursor-pointer">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 tracking-tight">{stock.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 font-mono">{stock.symbol}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">{stock.reason}</p>
                          </div>
                          <div className="text-right space-y-0.5">
                            <span className="font-black text-slate-900 font-mono block">{stock.price}</span>
                            <span className="text-rose-600 font-extrabold flex items-center justify-end font-mono">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              {stock.change}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 text-center">
                        <span className="text-[11px] text-slate-400 font-black cursor-pointer hover:text-rose-600 hover:underline">급등주 포착 리스트 더보기 ...</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 🔒 Free AI Smart Picks Block */}
                  <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white relative">
                    <div className="absolute top-0 right-0 p-3">
                      <Badge className="bg-rose-500 text-white font-black text-[9px] uppercase px-2 py-0.5 animate-pulse">실시간 탐색</Badge>
                    </div>
                    <CardHeader className="bg-slate-50 border-b border-slate-200/60 pb-3">
                      <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                        스마트 AI 무료 추천 종목 요약
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3.5">
                      {PREMIUM_PREVIEWS.map((p, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all space-y-2 relative">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs shrink-0">{p.initial}</span>
                            <div>
                              <span className="font-bold text-slate-800 text-xs block">{p.title}</span>
                              <span className="text-[9px] text-emerald-600 font-semibold block">{p.label}</span>
                            </div>
                            <span className="ml-auto font-black text-xs text-slate-600">${p.price}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white p-2 rounded-lg border border-slate-100">
                            {p.summary}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-emerald-600 px-1.5 py-0.5 bg-emerald-50 rounded font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 목표 타겟 적조 분석 완료
                            </span>
                            <span className="text-xs font-black font-mono text-rose-500">{p.change}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                </div>
              </div>
            </motion.div>
          ) : (
            /* 🔴 DASHBOARD VIEW: Highly polished investment diagnostic analyst report */
            <motion.div
              key="diagnostics-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10 pb-24 max-w-4xl mx-auto"
            >
              {/* Back to Home Header button */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></div>
                  <span className="text-xs sm:text-sm text-slate-500 font-bold">초이스스탁 양방향 퀀트 AI 리포트</span>
                </div>
                <Button 
                  onClick={() => setResult(null)} 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full font-bold hover:bg-slate-100 text-slate-600 text-xs py-4 w-full sm:w-auto"
                >
                  <Home className="w-3.5 h-3.5 mr-1.5" /> 스캔 초기 화면으로 돌아가기
                </Button>
              </div>

              {/* 📥 100% Volatile Session Share & Download Action Card */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 bg-rose-600/5 blur-3xl rounded-full pointer-events-none"></div>
                <div className="space-y-1.5 text-center md:text-left relative z-10">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> 가입없는 비저장 휘발성 분석
                  </div>
                  <h3 className="text-lg font-black text-white">진단 보고서 평생 소장 및 공유하기</h3>
                  <p className="text-xs text-slate-400 break-keep">
                    개인정보 보호 정책에 따라 브라우저 창을 닫으면 이 분석 결과는 <strong>즉시 안전 파기</strong>됩니다. 아래 평생 보전/공유 기능으로 결과를 소장해 두세요!
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2.5 shrink-0 relative z-10 w-full md:w-auto">
                  <Button 
                    onClick={handleDownloadReport}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl px-5 py-5 h-auto flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/15 w-full sm:w-auto"
                  >
                    <Download className="w-4 h-4" /> 리포트 다운로드 (.txt)
                  </Button>
                  <Button 
                    onClick={() => window.print()}
                    variant="outline"
                    className="bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border-slate-700 font-extrabold text-xs rounded-xl px-5 py-5 h-auto flex items-center justify-center gap-1.5 w-full sm:w-auto"
                  >
                    <Printer className="w-4 h-4" /> PDF로 저장 / 인쇄
                  </Button>
                  <Button 
                    onClick={handleCopyShareText}
                    variant="outline"
                    className={cn(
                      "font-extrabold text-xs rounded-xl px-5 py-5 h-auto flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto",
                      shareCopied 
                        ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-600 font-black" 
                        : "bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border-slate-700"
                    )}
                  >
                    {shareCopied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white animate-bounce" /> 복사 완료!
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4 text-slate-300" /> 결과 카피 공유
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* 1. Executive Summary Card */}
              <section className="bg-white border border-slate-200 p-8 sm:p-14 rounded-3xl shadow-sm space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-600 via-rose-400 to-indigo-600"></div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-500 font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                    분석일지 : {result.analysisDate}
                  </Badge>
                  <div className="flex gap-2">
                    {result.summary.tags.map((tag, idx) => (
                      <Badge key={idx} className="text-[11px] font-black px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em]">AI Portfolio Diagnosis Summary</p>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tighter leading-tight">
                    {result.summary.label}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold opacity-90 break-keep">
                    {result.summary.description}
                  </p>
                </div>

                {/* Highly structured, crisp stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">총 손익금</span>
                    <span className={cn("text-lg font-black tracking-tight", result.stats.totalProfit < 0 ? "text-blue-600" : "text-rose-600")}>
                      {result.stats.totalProfit.toLocaleString()}원
                    </span>
                  </div>
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">인식 수익률</span>
                    <span className={cn("text-lg font-black tracking-tight", result.stats.totalYield < 0 ? "text-blue-600" : "text-rose-600")}>
                      {result.stats.totalYield > 0 ? '+' : ''}{result.stats.totalYield}%
                    </span>
                  </div>
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">섹터 과압축 강도</span>
                    <span className="text-lg font-black text-slate-800 tracking-tight">
                      {result.stats.sectorConcentration}
                    </span>
                  </div>
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">포폴 위험 지수</span>
                    <span className="text-lg font-black text-rose-600 tracking-tight">
                      {result.stats.riskScore} / 100
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. Donut Visual Analysis */}
              <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                     <PieChart className="w-4 h-4 text-rose-600" /> Sector Weight Distribution
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-black bg-rose-50 text-rose-600 border-none px-2 py-0.5">실시간 매칭 완료</Badge>
                </div>
                <div className="p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="relative flex items-center justify-center shrink-0 w-full md:w-1/2">
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 flex flex-col justify-center text-center shadow-inner">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">대표 섹터</span>
                          <span className="text-lg font-black text-slate-800 mt-1">{result.sectors[0].percentage}%</span>
                        </div>
                     </div>
                     <CustomDonutChart data={result.sectors} colors={COLORS} />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {result.sectors.map((sector, index) => (
                        <div key={sector.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span className="text-xs font-bold text-slate-600">{sector.name}</span>
                          </div>
                          <span className="font-extrabold text-slate-800 font-mono text-sm">{sector.percentage}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100/50">
                      <p className="text-[11px] text-rose-500 font-extrabold uppercase tracking-wide mb-1">Sector Analysis</p>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed break-keep">
                        {result.sectorAnalysisText}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Portfolio Asset List Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4.5 bg-rose-600 rounded"></div>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">발굴 종목 매칭 요약</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-bold">{result.holdings.length} Assets Identified</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {result.holdings.map((holding, index) => {
                    const sectorIndex = result.sectors.findIndex(s => s.name === holding.sector);
                    const sectorColor = sectorIndex !== -1 ? COLORS[sectorIndex % COLORS.length] : '#DC2626';
                    return (
                      <div key={index} className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl relative hover:border-slate-300 transition-all overflow-hidden cursor-pointer group">
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-slate-400" style={{ backgroundColor: sectorColor }}></div>
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 truncate block text-sm">{holding.name}</span>
                            <Badge className={cn(
                              "text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0",
                              holding.status === '위험군' ? "bg-red-500 text-white" :
                              holding.status === '주의' ? "bg-amber-500 text-white" :
                              "bg-emerald-600 text-white"
                            )}>
                              {holding.status}
                            </Badge>
                          </div>
                          <div className="flex items-end justify-between">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{holding.sector}</span>
                            <span className={cn(
                              "text-md font-black font-mono tracking-tighter",
                              holding.yield < 0 ? "text-blue-600" : "text-rose-600"
                            )}>
                              {holding.yield > 0 ? '+' : ''}{holding.yield}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 4. Individual Stock Deep Intelligence feed */}
              <section className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                  <div className="w-1.5 h-4.5 bg-rose-600 rounded"></div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">종목별 AI 정밀 진단 및 대응 전략</h3>
                </div>

                <div className="space-y-6">
                  {result.holdings.map((holding, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-3xl overflow-hidden shadow-sm">
                      <div className="p-6 sm:p-10 space-y-8">
                        {/* Title and yield banner */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5">
                              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">{holding.name}</h4>
                              <Badge className={cn(
                                "text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm uppercase",
                                holding.status === '위험군' ? "bg-red-500 text-white" :
                                holding.status === '주의' ? "bg-amber-500 text-white" :
                                "bg-emerald-600 text-white"
                              )}>
                                {holding.status}
                              </Badge>
                            </div>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">
                              {holding.sector} · {holding.quantity.toLocaleString()}주 보유 중
                            </span>
                          </div>

                          <div className="flex items-center gap-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100/80 shrink-0 w-full sm:w-auto justify-between">
                            <div className="text-left py-0.5 sm:px-2">
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">보유주식 수익률</span>
                              <span className={cn("text-base font-black font-mono", holding.yield < 0 ? "text-blue-600" : "text-rose-600")}>
                                {holding.yield > 0 ? '+' : ''}{holding.yield}%
                              </span>
                            </div>
                            <div className="text-right py-0.5 border-l border-slate-200 pl-4 sm:px-4">
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">평수단가 / 보유손익</span>
                              <span className="text-xs text-slate-700 block font-bold">
                                평단 {holding.avgPrice.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Analysis feedback blocks */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                          {/* Quant evaluation */}
                          <div className="space-y-3">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quant Intelligence Analysis
                            </span>
                            <p className="text-xs sm:text-sm text-slate-600 font-bold leading-relaxed break-keep">
                              {holding.analysis || "종목 세부 펀더멘털을 분석한 오피니언 정보 데이터를 로딩하고 있습니다."}
                            </p>
                          </div>

                          {/* Action Strategy - lock icon styled premium */}
                          <div className="bg-rose-50/40 p-5 rounded-2xl border border-rose-100 relative overflow-hidden flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-xs font-black text-rose-600 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" /> AI Strategic CPR Action
                              </span>
                              <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed italic break-keep pr-4">
                                "{holding.strategy}"
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4">
                              <Badge className="bg-white border-none shadow-sm text-rose-600 text-[10px] font-black px-2.5 py-1 rounded">
                                적정가 괴리율 {holding.consensusGap}%
                              </Badge>
                              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none text-[10px] font-black px-2.5 py-1.5 rounded flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-white animate-pulse" /> AI 대응 신호 감지 완료
                              </Badge>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Precision roadmap protocol step */}
              <section className="bg-white border border-slate-200 p-8 sm:p-14 rounded-3xl shadow-sm space-y-10">
                <div className="text-center sm:text-left space-y-2">
                  <span className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] block">Precision step-by-step roadmap</span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">계좌 리밸런싱 극복 행동 가이드라인</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[result.advice.step1, result.advice.step2, result.advice.step3].map((step, idx) => (
                    <div key={idx} className={cn(
                      "flex flex-col rounded-2xl p-6 border transition-all justify-between text-xs space-y-6",
                      idx === 0 ? "bg-[#fffafb] border-rose-100" :
                      idx === 1 ? "bg-slate-50 border-slate-200" :
                      "bg-rose-50/20 border-rose-100/50"
                    )}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shadow-sm",
                            idx === 1 ? "bg-slate-700 text-white" : "bg-rose-600 text-white"
                          )}>{idx + 1}</span>
                          <span className="font-extrabold text-slate-800 text-sm leading-none block">{step.title}</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-bold leading-relaxed break-keep">
                          {step.content}
                        </p>
                      </div>

                      {/* Micro actions bottom */}
                      <div className="pt-2">
                        {idx === 0 && (step as any).items?.map((it: string, i: number) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between mt-1.5 font-bold text-slate-600 text-[10px]">
                            <span>{it}</span>
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          </div>
                        ))}
                        {idx === 1 && (step as any).recommendation && (
                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center font-bold text-slate-700">
                            <span>{(step as any).recommendation}</span>
                          </div>
                        )}
                        {idx === 2 && (step as any).plan?.map((p: string, i: number) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between mt-1.5 font-bold text-rose-600 text-[10px]">
                            <span>{p}</span>
                            <TrendingUp className="w-3.5 h-3.5 text-rose-500/40" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 6. Professional Verdict Callout */}
              {result.conclusion && (
                <div className="bg-[#1e293b] text-white p-8 sm:p-14 rounded-3xl relative overflow-hidden shadow-xl border border-slate-800 flex flex-col gap-4">
                  <div className="absolute top-0 bottom-0 right-0 w-[30%] bg-gradient-to-l from-rose-500/10 to-transparent blur-xl rounded-full"></div>
                  <span className="text-rose-500 font-extrabold text-xs uppercase tracking-[0.2em] block">
                    ★ CHCEICESTOCK SPECIALIST CONCLUDING VERDICT
                  </span>
                  <p className="text-md sm:text-xl font-black text-slate-100 leading-relaxed font-mono italic break-keep relative z-10">
                    "{result.conclusion}"
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 🔴 Premium Financial Footer (Pasted from choice stock & datahero business logs) */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 sm:px-12 border-t border-slate-800 text-xs mt-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-1">
              <span className="text-rose-500 text-xs font-black uppercase tracking-widest block">초이스스탁 AI 포트폴리오 스캐너</span>
              <p className="text-[10px] text-slate-500 font-bold max-w-xl">
                데이터히어로가 제공하는 모든 분석 정보는 정밀 빅데이터 알고리즘에 기반한 학술/통계 모형이며, 특정 종목의 절대적 매수나 추천을 직접 대리하지 않습니다.
              </p>
            </div>
            <div className="flex items-center gap-6 shrink-0">
              <span className="text-slate-500 font-bold text-[10px]">이용약관</span>
              <span className="text-slate-500 font-bold text-[10px] border-l border-slate-800 pl-4">개인정보 처리방침</span>
              <span className="text-slate-500 font-bold text-[10px] border-l border-slate-800 pl-4">서비스 FAQ</span>
              <span className="text-slate-500 font-bold text-[10px] border-l border-slate-800 pl-4">회사소개</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] leading-relaxed text-slate-500">
            <div className="space-y-1">
              <p className="font-bold text-slate-400">주식회사 데이터히어로</p>
              <p>대표자 : 김인중 | 사업자등록번호 : 291-88-01393</p>
              <p>서울특별시 서초구 강남대로 311 | 제휴 패밀리 사이트 : 밸류라인, 초이스스탁코리아</p>
              <p>© (주)데이터히어로 All Rights Reserved. Data Powered by NASDAQ and S&P Global.</p>
            </div>
            <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
              <p className="font-bold text-slate-400">초이스스탁 고객지원 매뉴얼</p>
              <p>평일 9:00 ~ 17:00 (점심시간 11:20 ~ 12:20) | 주말 및 공휴일 휴무</p>
              <p>본 사이트의 데이터는 원자재 지체 및 수급 매칭 과정에서 오차가 발생할 수 있으므로, 최종 거래 시 직접 재확인하시기를 권유합니다.</p>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
