import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, AlertCircle, TrendingUp, ShieldAlert, PieChart, ArrowRight, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { DiagnosisResult, Holding } from './types';
import { cn } from '@/lib/utils';

const COLORS = ['#DC2626', '#334155', '#475569', '#64748b', '#94a3b8'];

const DUMMY_DATA: DiagnosisResult = {
  analysisDate: "2026년 5월 19일",
  summary: {
    label: "희망고문형 고립 계좌",
    score: 35,
    description: "특정 섹터에 자본이 80% 이상 묶여 있으며, 마이너스 수익률 종목에 과도한 추가 매수(물타기)가 관찰됩니다.",
    tags: ["섹터 과밀집", "물타기 감지", "배당주 부재"],
    strategyText: "현금 확보 후 하반기 주도 섹터 교체 매매"
  },
  stats: {
    totalProfit: -24500000,
    totalYield: -35,
    sectorConcentration: "위험 80%+",
    recoveryMonths: 17,
    riskScore: 85
  },
  holdings: [
    { name: "삼성전자", profit: -5200000, yield: -12.4, quantity: 450, avgPrice: 82000, sector: "반도체", riskLevel: "low", status: "주의", analysis: "메모리 업황 회복 지연 및 외국인 수급 이탈이 관찰됩니다. 60일 이동평균선 지지 여부가 핵심입니다.", strategy: "반등 시 비중 20% 축소 후 우량 배당주로 갈아타기 권고", consensusGap: 24.5 },
    { name: "LG에너지솔루션", profit: -12000000, yield: -35.2, quantity: 80, avgPrice: 480000, sector: "2차전지", riskLevel: "high", status: "위험군", analysis: "전기차 수요 둔화(캐즘) 직격탄을 맞은 상태입니다. 평단가 대비 낙폭이 과대하나 업황 턴어라운드 전까지는 시간 소요가 불가피합니다.", strategy: "장기 업황 회복 대기, 추가 매수 절대 금지 및 현금 비중 유지", consensusGap: 12.1 },
    { name: "카카오", profit: -8500000, yield: -48.7, quantity: 300, avgPrice: 105000, sector: "IT 서비스", riskLevel: "high", status: "위험군", analysis: "플랫폼 규제 리스크와 실적 성장세 둔화가 겹겹이 쌓여 있습니다. 기관 매도세가 지속되고 있어 기술적 반등 시 탈출 전략이 유효합니다.", strategy: "기술적 반등 시 전량 매도 및 실적 개선 섹터로 교체 매매", consensusGap: 5.4 },
    { name: "현대차", profit: 1200000, yield: 5.6, quantity: 150, avgPrice: 215000, sector: "자동차", riskLevel: "medium", status: "수익권", analysis: "하이브리드 판매 호조 및 주주 환원 정책 강화로 견고한 흐름을 보입니다. 섹터 내 가장 안정적인 펀더멘털을 보유하고 있습니다.", strategy: "강력 홀딩, 분기 배당금 재투자 및 주요 지지선 이탈 시 일부 익절", consensusGap: 18.2 }
  ],
  sectors: [
    { name: "2차전지", percentage: 45 },
    { name: "반도체", percentage: 25 },
    { name: "IT 서비스", percentage: 20 },
    { name: "자동차", percentage: 10 }
  ],
  sectorAnalysisText: "2차전지+반도체+IT 서비스 합산 90% 집중. 단일 이슈 발생 시 계좌 전체가 동시 하락할 수 있는 구조입니다.",
  actionPlan: {
    shortTerm: "1-2주 내에 현대차 비중을 5% 상향하고 카카오의 추가 매수를 엄격히 금지하십시오.",
    longTerm: "3-6개월 내에 IT 서비스 비중을 10% 미만으로 낮추고, 배당 성향이 강한 금융 섹터를 15% 이상 편입하십시오."
  },
  advice: {
    step1: {
      title: "변동성 위험 점검",
      content: "현재 2차전지 섹터와 IT 서비스 섹터의 합산 비중이 65%로 시장 평균 대비 변동성이 2.4배 높습니다. 대형주 하락 시 방어 기제가 전무하며, 추가 물타기는 현금 유동성을 완전히 고갈시킬 수 있습니다.",
      items: ["삼성전자 주의", "LG에너지솔루션 위험군", "카카오 위험군"]
    },
    step2: {
      title: "비중 리밸런싱",
      content: "전체 자산의 30% 정도를 현금화하거나, 현재 수익권인 현대차와 같은 우량 분기 배당주로 비중을 분산하여 계좌의 전체적인 현금 흐름을 개선하는 것이 통계적으로 안전합니다.",
      recommendation: "현금 비중 상향 필요 (목표 25%)"
    },
    step3: {
      title: "전략적 분할 매매",
      content: "금요일은 주간 저점인 경우가 많으므로, 화~목요일 장중 고가 부근에서 매주 7.5%씩 분할 매도하십시오. 기계적인 스케줄링을 통해 감정을 배제하고 포트폴리오 다이어트를 진행하는 것이 핵심입니다.",
      plan: ["화~목 장중 고가 매도", "매주 7.5%씩 분할"]
    }
  },
  focusStock: {
    name: "카카오",
    yield: -48.7,
    link: "#"
  },
  conclusion: "현재 계좌는 특정 성장 섹터에 편중된 전형적인 '고립형 포트폴리오'입니다. 단기적인 손실 확정에 대한 두려움을 극복하고, 기계적인 분할 매도를 통해 확보한 현금으로 배당 우량주와 같은 방어적 자산을 단계적으로 편입하는 '계좌 다이어트'가 시급합니다."
};

export default function App() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: base64 }),
          });
          
          const data = await res.json();
          if (!res.ok) {
            setError(data.error || '분석 중 오류가 발생했습니다.');
            setLoading(false);
            return;
          }
          
          setResult(data);
          setLoading(false);
        } catch (err) {
          setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('이미지를 읽는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-20 selection:bg-red-600/10 overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Disclaimer Top */}
      <div className="bg-white/50 backdrop-blur-sm text-slate-500 py-2.5 px-4 text-center text-[10px] sm:text-xs leading-tight font-medium border-b border-white/20">
        본 서비스는 통계적 데이터 기반 투자 참고 리포트이며, 자본시장법상 특정 종목 권유가 아닙니다.
      </div>

      <header className="fixed top-8 left-0 right-0 z-50 px-4">
        <div className="max-w-7xl mx-auto glass rounded-full h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-500/20 shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-slate-800 break-keep">
              스탁 인사이더
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {result && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResult(null)} 
                className="rounded-full text-xs font-bold hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
              >
                <Home className="w-3.5 h-3.5 mr-2" /> 처음으로
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-32">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 py-10"
            >
              <div className="text-center space-y-6 pt-10">
                <div className="text-sm font-black text-red-600 tracking-[0.3em] uppercase">The Ultimate AI Analysis</div>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-slate-900 leading-[1.05] px-4">
                  내 주식 계좌, <br/><span className="text-red-600">심폐소생</span>이 필요할까?
                </h1>
                <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium opacity-90 leading-relaxed px-6">
                  국내 주식 전문가의 알고리즘으로 내 포트폴리오를 <br className="hidden sm:block"/>
                  객관적이고 냉정하게 분석해 드립니다.
                </p>
              </div>

              <div className="max-w-xl mx-auto floating-card bg-white group cursor-pointer relative overflow-hidden backdrop-blur-sm border border-white/50">
                <div className="p-10 sm:p-20 text-center">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    accept="image/*"
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-red-500/10 relative">
                      {loading && (
                        <div className="absolute inset-0 border-4 border-red-200 border-t-red-600 rounded-[2rem] animate-spin"></div>
                      )}
                      {loading ? (
                        <RefreshCcw className="w-10 h-10" />
                      ) : (
                        <Upload className="w-10 h-10" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">계좌 스크린샷 업로드</h3>
                      <p className="text-slate-600 font-bold opacity-90">MTS 종목 리스트 화면을 캡처해서 올려주세요</p>
                    </div>
                    {loading && (
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-red-600 font-black animate-pulse tracking-widest text-sm">AI 정밀 분석 진행 중...</p>
                        <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="w-full h-full bg-red-600"
                           />
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className="mt-4 p-5 bg-red-50 border border-red-100 rounded-[2rem] max-w-sm mx-auto shadow-sm">
                        <p className="text-xs text-red-600 font-bold mb-4">{error}</p>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setError(null);
                            }}
                            className="text-xs font-black rounded-full hover:bg-slate-200"
                          >
                            <RefreshCcw className="w-3.5 h-3.5 mr-1.5" /> 다시 시도
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setResult(DUMMY_DATA);
                              setError(null);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-xs font-black rounded-full"
                          >
                            샘플 데이터 체험
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <button 
                  onClick={() => setResult(DUMMY_DATA)}
                  className="text-slate-400 hover:text-red-600 text-sm font-black border-red-100 transition-all border-b pb-1 px-2"
                >
                  분석 샘플 레포트 확인하기
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto pt-10">
                <div className="space-y-4 p-8 floating-card bg-white border border-white/50">
                  <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                    <PieChart className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg">섹터 과밀집 점검</h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed opacity-90">특정 시장 이슈에 모든 자산이 <br/>흔들리지 않는지 분석합니다.</p>
                </div>
                <div className="space-y-4 p-8 floating-card bg-white border border-white/50">
                  <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg">변동성 리스크 평가</h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed opacity-90">계좌의 표준편차를 낮추는 <br/>자산 배분 구조를 제안합니다.</p>
                </div>
                <div className="space-y-4 p-8 floating-card bg-white border border-white/50">
                  <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg">데이터 매칭 시스템</h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed opacity-90">실시간 시장 데이터와 내 계좌의 <br/>괴리율을 세밀하게 분석합니다.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-240px)] lg:h-[calc(100vh-240px)] overflow-visible lg:overflow-hidden pb-12"
            >
              {/* Sidebar: Summary & Holdings */}
              <aside className="w-full lg:w-[360px] xl:w-[420px] flex flex-col gap-6 flex-shrink-0 overflow-visible lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
                <section className="floating-card p-8 flex flex-col gap-8 bg-white border border-white/50">
                  <div className="flex flex-wrap gap-2">
                    {result.summary.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className={cn(
                        "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter",
                        tag === "분석일" ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-600"
                      )}>
                        {tag === "분석일" ? `${tag} ${result.analysisDate}` : tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Current Diagnosis</h2>
                    <div className="text-slate-900 font-black text-3xl sm:text-4xl tracking-tighter leading-tight">
                      {result.summary.label}
                    </div>
                    <p className="text-slate-600 text-[15px] leading-relaxed font-semibold">
                      {result.summary.description}
                    </p>
                  </div>
                </section>
                  
                <section className="floating-card p-8 flex flex-col gap-6 bg-white border border-white/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Holdings Indicators</h2>
                    <Badge variant="ghost" className="text-[10px] font-black p-0 text-slate-500">{result.holdings.length} Positions</Badge>
                  </div>
                  <div className="space-y-4">
                    {result.holdings.map((holding, index) => {
                      const sectorIndex = result.sectors.findIndex(s => s.name === holding.sector);
                      const sectorColor = sectorIndex !== -1 ? COLORS[sectorIndex % COLORS.length] : '#DC2626';
                      
                      return (
                        <div key={`${holding.name}-${index}`} className="p-6 bg-white rounded-[1.5rem] border border-slate-100 transition-all hover:translate-x-1 relative group overflow-hidden shadow-sm">
                          <div className="absolute top-0 bottom-0 left-0 w-2" style={{ backgroundColor: sectorColor }}></div>
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <span className="font-black text-lg block truncate text-slate-900">{holding.name}</span>
                              <span className="text-[11px] text-slate-500 font-bold block mt-2 uppercase tracking-wide">
                                {holding.sector} · 평단 {holding.avgPrice.toLocaleString()}원
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={cn(
                                "text-lg font-black block tracking-tighter",
                                holding.yield < 0 ? "text-red-600" : "text-emerald-600"
                              )}>
                                {holding.yield > 0 ? '+' : ''}{holding.yield}%
                              </span>
                              <Badge className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-full mt-2 uppercase tracking-tighter",
                                holding.status === '위험군' ? "bg-red-600 text-white" :
                                holding.status === '주의' ? "bg-amber-500 text-white" :
                                "bg-emerald-600 text-white"
                              )}>
                                {holding.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </aside>

              {/* Main Content Area: Detailed Diagnosis & Stats */}
              <div className="flex-1 flex flex-col gap-8 h-auto lg:h-full lg:overflow-y-auto pr-0 lg:pr-4 custom-scrollbar">
                {/* Individual Stock Diagnosis Report */}
                <div className="space-y-8 h-auto">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-8 bg-red-600 rounded-full shadow-lg shadow-red-600/20"></div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter">
                        전 종목별 초정밀 대응 지침
                      </h2>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-8">
                    {result.holdings.map((holding, idx) => (
                      <div key={`${holding.name}-deep-${idx}`} className="floating-card overflow-hidden bg-white border border-white/50 group">
                        <div className="p-10 sm:p-14 space-y-10">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-b border-white/20 pb-10">
                            <div className="min-w-0">
                              <div className="flex items-center gap-5 flex-wrap">
                                <h4 className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tighter uppercase mb-4 sm:mb-0">{holding.name}</h4>
                                <Badge className={cn(
                                  "text-xs font-black px-5 py-1.5 rounded-full shadow-md uppercase tracking-widest",
                                  holding.status === '위험군' ? "bg-red-600 text-white" :
                                  holding.status === '주의' ? "bg-amber-500 text-white" :
                                  "bg-emerald-600 text-white"
                                )}>
                                  {holding.status}
                                </Badge>
                              </div>
                              <span className="text-xs font-black text-slate-500 mt-4 block tracking-[0.2em] uppercase">{holding.sector || '기타 섹터'}</span>
                            </div>
                            <div className="text-left sm:text-right shrink-0 w-full sm:w-auto p-8 bg-white rounded-[2.5rem] shadow-inner border border-slate-50">
                              <div className={cn(
                                "text-5xl sm:text-6xl font-black tracking-tighter leading-none mb-3",
                                holding.yield < 0 ? "text-red-600" : "text-emerald-600"
                              )}>
                                {holding.yield > 0 ? '+' : ''}{holding.yield}%
                              </div>
                              <div className="text-sm sm:text-xl font-bold text-slate-400 tracking-tight">
                                {holding.profit.toLocaleString()}원 평가손익
                              </div>
                            </div>
                          </div>
 
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 pt-4">
                            {/* Detailed Analysis */}
                            <div className="space-y-6">
                              <div className="text-xs font-black text-slate-500 flex items-center gap-3 uppercase tracking-[0.2em]">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div> Quant Intelligence
                              </div>
                              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold">
                                {holding.analysis || "분석 데이터를 읽을 수 없습니다."}
                              </p>
                            </div>
 
                            {/* Precise Strategy */}
                            <div className="bg-red-50 p-10 sm:p-12 rounded-[2.5rem] border border-red-100 shadow-inner relative overflow-hidden h-auto group/strategy">
                              <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover/strategy:scale-125 transition-transform duration-700">
                                <ShieldAlert className="w-32 h-32 text-red-600" />
                              </div>
                              <div className="text-xs font-black text-red-600 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
                                <RefreshCcw className="w-4 h-4 animate-spin-slow" /> Action Protocol
                              </div>
                              <p className="text-xl sm:text-2xl text-slate-950 leading-relaxed font-black italic">
                                "{holding.strategy}"
                              </p>
                              <div className="mt-10 flex gap-3 flex-wrap">
                                <Badge variant="secondary" className="text-[10px] bg-white text-red-600 border-none font-black px-4 py-1.5 rounded-full shadow-sm">AVG {holding.avgPrice.toLocaleString()}W</Badge>
                                <Badge variant="secondary" className="text-[10px] bg-white text-red-600 border-none font-black px-4 py-1.5 rounded-full shadow-sm">{holding.quantity} Shares</Badge>
                                <Badge variant="secondary" className="text-[10px] bg-white text-red-600 border-none font-black px-4 py-1.5 rounded-full shadow-sm">GAP {holding.consensusGap}%</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics and Simulation - Secondary Priority */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-auto">
                   {/* Chart Card */}
                   <div className="floating-card flex flex-col min-h-[500px] bg-white border border-white/50 overflow-hidden">
                    <div className="px-12 py-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Sector Concentration</h2>
                      <Badge variant="ghost" className="text-[10px] font-black text-red-600 animate-pulse">Live Distribution</Badge>
                    </div>
                    <CardContent className="p-12 flex-1 flex flex-col items-center justify-between gap-12">
                      <div className="w-full h-72 relative">
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-50 flex flex-col justify-center shadow-inner">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-3">Main Sector</div>
                      <div className="text-2xl font-black text-slate-800">{result.sectors[0].percentage}%</div>
                    </div>
                         </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={result.sectors}
                              cx="50%"
                              cy="50%"
                              innerRadius={90}
                              outerRadius={120}
                              paddingAngle={8}
                              dataKey="percentage"
                              stroke="none"
                            >
                              {result.sectors.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full space-y-8">
                        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                          {result.sectors.map((sector, index) => (
                            <div key={sector.name} className="flex items-center justify-between text-sm font-black text-slate-600">
                              <div className="flex items-center gap-4">
                                <span className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span>{sector.name}</span>
                              </div>
                              <span className="text-slate-900 text-base">{sector.percentage}%</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed pt-10 border-t border-slate-100 italic break-keep">
                          {result.sectorAnalysisText}
                        </p>
                      </div>
                    </CardContent>
                  </div>

                  {/* Simulation Card */}
                  <div className="floating-card p-12 flex flex-col min-h-[500px] relative overflow-hidden bg-slate-950 shadow-2xl group shadow-slate-950/20">
                    <div className="flex items-center gap-5 mb-12 relative z-10">
                      <div className="w-3 h-8 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>
                      <h3 className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">Asset Simulation</h3>
                      <Badge className="text-xs font-black ml-auto border-white/20 text-white/60 px-6 py-2.5 rounded-full uppercase bg-white/10 backdrop-blur-md tracking-widest">Monte Carlo v.4</Badge>
                    </div>
                    
                    <div className="flex-1 bg-white/5 rounded-[3rem] relative overflow-hidden border border-white/5 pt-24 pb-8 mb-4">
                      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { x: 0, y: 35, y2: 35 },
                          { x: 1, y: 38, y2: 35 },
                          { x: 2, y: 33, y2: 34 },
                          { x: 3, y: 22, y2: 33 },
                          { x: 4, y: 12, y2: 33 },
                          { x: 5, y: 2, y2: 32 },
                        ]} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" vertical={false} opacity={0.05} />
                          <Line 
                            type="monotone" 
                            dataKey="y" 
                            stroke="#00A48E" 
                            strokeWidth={10} 
                            dot={{ fill: '#00A48E', r: 8, strokeWidth: 4, stroke: '#020617' }} 
                            activeDot={{ r: 12, strokeWidth: 0 }}
                            strokeDasharray="15 10" 
                            animationDuration={4000}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="y2" 
                            stroke="#475569" 
                            strokeWidth={6} 
                            dot={false} 
                            opacity={0.4}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      
                      <div className="absolute top-10 left-12 flex flex-col sm:flex-row gap-12 z-10">
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-4 text-xs font-black text-red-600 tracking-wider">
                              <span className="w-10 h-2.5 bg-red-600 inline-block rounded-full shadow-[0_0_25px_rgba(220,38,38,1)] animate-pulse"></span>
                              <span>AI Rebalancing</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-4 text-xs font-black text-white/60 tracking-wider">
                              <span className="w-10 h-2.5 bg-white/20 inline-block rounded-full"></span>
                              <span>Default Hold</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Step Guide */}
                <div className="floating-card p-12 sm:p-16 flex flex-col gap-12 bg-white border border-white/50">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 text-center sm:text-left">AI Asset Rebalancing Roadmap</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col bg-red-50 rounded-[3rem] p-10 sm:p-12 border border-red-100 shadow-sm transition-all hover:bg-red-100/50">
                      <div className="flex items-center gap-6 mb-10">
                        <span className="w-14 h-14 rounded-3xl bg-red-600 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-red-200 shrink-0">1</span>
                        <span className="font-black text-red-900 text-lg leading-tight uppercase tracking-tighter">{result.advice.step1.title}</span>
                      </div>
                      <p className="text-sm sm:text-base text-red-700 leading-relaxed font-bold mb-12 opacity-80">
                        {result.advice.step1.content}
                      </p>
                      <div className="mt-auto space-y-4">
                        {result.advice.step1.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-red-100 shadow-sm group/item">
                            <span className="text-xs font-black text-red-800">{item}</span>
                            <AlertCircle className="w-4 h-4 text-red-400 group-hover/item:text-red-600 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col bg-amber-50 rounded-[3rem] p-10 sm:p-12 border border-amber-100 shadow-sm transition-all hover:bg-amber-100/50">
                      <div className="flex items-center gap-6 mb-10">
                        <span className="w-14 h-14 rounded-3xl bg-amber-500 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-amber-200 shrink-0">2</span>
                        <span className="font-black text-amber-900 text-lg leading-tight uppercase tracking-tighter">{result.advice.step2.title}</span>
                      </div>
                      <p className="text-sm sm:text-base text-amber-700 leading-relaxed font-bold mb-12 opacity-80">
                        {result.advice.step2.content}
                      </p>
                      <div className="mt-auto p-6 bg-white rounded-[2rem] border border-amber-100 shadow-sm text-center">
                        <div className="text-lg font-black text-amber-600 tracking-tight">{result.advice.step2.recommendation}</div>
                        <div className="text-[9px] font-black text-amber-400 mt-2 uppercase tracking-widest leading-none">Protective Stance Recommended</div>
                      </div>
                    </div>

                    <div className="flex flex-col bg-red-50/50 rounded-[3rem] p-10 sm:p-12 border border-red-100/30 shadow-sm transition-all hover:bg-red-100/60">
                      <div className="flex items-center gap-6 mb-10">
                        <span className="w-14 h-14 rounded-3xl bg-red-600 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-red-200 shrink-0">3</span>
                        <span className="font-black text-red-900 text-lg leading-tight uppercase tracking-tighter">{result.advice.step3.title}</span>
                      </div>
                      <p className="text-sm sm:text-base text-red-700 leading-relaxed font-bold mb-12 opacity-80">
                        {result.advice.step3.content}
                      </p>
                      <div className="mt-auto flex flex-col gap-4">
                        {result.advice.step3.plan.map((p, idx) => (
                          <div key={idx} className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between group/plan">
                            <span className="text-xs font-black text-red-600">{p}</span>
                            <TrendingUp className="w-4 h-4 text-red-400 opacity-40 group-hover/plan:opacity-100 transition-opacity" />
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-2 mt-6">
                          <Badge variant="outline" className="text-[9px] bg-white border-red-100 text-red-600 font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">Regular</Badge>
                          <Badge variant="outline" className="text-[9px] bg-white border-red-100 text-red-600 font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm">Divided</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Conclusion */}
                {result.conclusion && (
                    <div className="floating-card bg-[#0f172a] p-12 sm:p-20 relative overflow-hidden group shadow-2xl shadow-slate-950/40">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-500 to-slate-900"></div>
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-red-600/10 blur-[150px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>
                    <div className="absolute top-0 left-0 p-12 opacity-5">
                       <ShieldAlert className="w-40 h-40 text-white" />
                    </div>
                    <h3 className="text-[12px] font-black text-red-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-4 relative z-10">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div> Intelligence Verdict
                    </h3>
                    <p className="text-2xl sm:text-5xl font-black text-white leading-tight break-words relative z-10 tracking-tight drop-shadow-xl">
                      "{result.conclusion}"
                    </p>
                  </div>
                )}

                <footer className="pt-20 pb-32 text-slate-500 text-[10px] leading-relaxed text-center max-w-4xl mx-auto italic font-black uppercase tracking-widest space-y-12">
                  <p className="break-keep opacity-60 px-10 leading-loose">
                    This report provided by AI Stock Insider is based on institutional data and statistical algorithms. It is not an invitation to invest in specific stocks. All investment decisions are the sole responsibility of the user.
                  </p>
                  <p className="opacity-20 text-[9px]">
                    Analysis CPR System v2.0 · Professional Quant Engine · Developed for Modern Portfolios
                  </p>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
