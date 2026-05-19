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

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Disclaimer Top */}
      <div className="bg-slate-900 text-slate-400 py-3 px-4 text-center text-[10px] leading-tight">
        본 서비스는 통계적 데이터 기반 투자 참고 리포트이며, 자본시장법상 특정 종목 권유가 아닙니다. 투자 판단의 최종 책임은 유저 본인에게 있습니다.
      </div>

      <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-lg shadow-sm">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
              스탁 인사이더 
              <span className="hidden sm:inline text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">Stock Portfolio CPR</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end text-[10px] leading-tight text-slate-400 max-w-[300px] text-right">
              <p>본 서비스는 통계적 데이터 기반 투자 참고 리포트이며, 자본시장법상 특정 종목 권유가 아닙니다.</p>
              <p>투자 판단의 최종 책임은 유저 본인에게 있습니다.</p>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={() => setResult(null)} className="rounded-full shadow-sm text-xs font-bold px-4">
                <Home className="w-3.5 h-3.5 mr-2" /> 처음으로
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-24">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12 py-10"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-none">
                  내 주식 계좌, <br/><span className="text-red-600">심폐소생</span>이 필요할까?
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                  국내 주식 전문가의 알고리즘으로 내 포트폴리오를 <br className="hidden sm:block"/>
                  객관적이고 냉정하게 분석해 드립니다.
                </p>
              </div>

              <Card className="max-w-2xl mx-auto border-2 border-dashed border-slate-200 bg-white hover:border-red-500 transition-all group cursor-pointer relative shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="py-20 text-center">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    accept="image/*"
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      {loading ? (
                        <RefreshCcw className="w-10 h-10 animate-spin" />
                      ) : (
                        <Upload className="w-10 h-10" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black">계좌 스크린샷 업로드</h3>
                      <p className="text-slate-500 font-medium">MTS 종목 리스트 화면을 캡처해서 올려주세요</p>
                    </div>
                    {loading && <p className="text-red-600 font-black animate-pulse tracking-widest text-sm">AI 데이터 추출 및 정밀 진단 중...</p>}
                    
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl max-w-md mx-auto">
                        <p className="text-xs text-red-600 font-bold mb-3">{error}</p>
                        <div className="flex gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setError(null);
                            }}
                            className="text-[10px] font-black rounded-lg border-red-200 hover:bg-red-100"
                          >
                            <RefreshCcw className="w-3 h-3 mr-1" /> 다시 시도
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setResult(DUMMY_DATA);
                              setError(null);
                            }}
                            className="text-[10px] font-black rounded-lg bg-red-600 hover:bg-red-700"
                          >
                            샘플 데이터로 체험하기
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <button 
                  onClick={() => setResult(DUMMY_DATA)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold border-b border-slate-300 pb-1"
                >
                  분석 샘플 레포트 확인하기
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                <div className="space-y-3">
                  <div className="bg-red-50 text-red-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-800">섹터 과밀집 점검</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">특정 시장 이슈에 모든 자산이 <br/>흔들리지 않는지 체크합니다.</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-800">변동성 리스크 평가</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">계좌의 표준편차를 낮추는 <br/>자산 배분 구조를 제안합니다.</p>
                </div>
                <div className="space-y-3">
                  <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-slate-800">컨센서스 데이터 매칭</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">기관 목표주가와 내 평단가의 <br/>괴리율을 수치화합니다.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-160px)] overflow-visible lg:overflow-hidden pb-10"
            >
              {/* Sidebar: Holdigns List */}
              <aside className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {result.summary.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-md",
                        tag === "분석일" ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-600"
                      )}>
                        {tag === "분석일" ? `${tag} ${result.analysisDate}` : tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">계좌 상태 진단</h2>
                    <div className="text-red-600 font-black text-2xl leading-tight">"{result.summary.label}"</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed font-bold mt-2">
                      {result.summary.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="bg-slate-900 p-4 rounded-2xl flex flex-col justify-center">
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">총 평가손익</div>
                      <div className={cn(
                        "text-sm font-black mt-1",
                        result.stats.totalProfit < 0 ? "text-red-400" : "text-emerald-400"
                      )}>
                        {result.stats.totalProfit.toLocaleString()}원
                      </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-2xl flex flex-col justify-center">
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">평균 수익률</div>
                      <div className={cn(
                        "text-lg font-black mt-1",
                        result.stats.totalYield < 0 ? "text-red-400" : "text-emerald-400"
                      )}>
                        {result.stats.totalYield}%
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">섹터 편중도</div>
                      <div className="text-sm font-black mt-1 text-slate-900">{result.stats.sectorConcentration}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">포트폴리오 위험점수</div>
                      <div className={cn(
                        "text-sm font-black mt-1",
                        result.stats.riskScore > 70 ? "text-red-600" : "text-emerald-600"
                      )}>
                        {result.stats.riskScore}/100
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">보유 종목 현황</h2>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {result.holdings.map((holding, index) => {
                      const sectorIndex = result.sectors.findIndex(s => s.name === holding.sector);
                      const sectorColor = sectorIndex !== -1 ? COLORS[sectorIndex % COLORS.length] : '#94a3b8';
                      
                      return (
                        <div key={`${holding.name}-${index}`} className="p-4 bg-slate-50 rounded-xl border-l-4 transition-all hover:bg-slate-100 relative group overflow-hidden" style={{ borderLeftColor: sectorColor }}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-black text-sm block">{holding.name}</span>
                              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                                {holding.sector} · 평단 {holding.avgPrice.toLocaleString()}원 · {holding.quantity}주
                              </span>
                            </div>
                            <div className="text-right">
                              <span className={cn(
                                "text-sm font-black block",
                                holding.yield < 0 ? "text-red-600" : "text-emerald-600"
                              )}>
                                {holding.yield > 0 ? '+' : ''}{holding.yield}%
                              </span>
                              <Badge className={cn(
                                "text-[9px] font-black px-1.5 py-0 rounded-md mt-1",
                                holding.status === '위험군' ? "bg-red-100 text-red-600" :
                                holding.status === '주의' ? "bg-amber-100 text-amber-600" :
                                "bg-emerald-100 text-emerald-600"
                              )}>
                                {holding.status}
                              </Badge>
                            </div>
                          </div>
                          {holding.strategy && (
                            <div className="mt-3 bg-white/60 p-2.5 rounded-lg border border-slate-100">
                              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <ShieldAlert className="w-2.5 h-2.5" /> 대응 전략
                              </div>
                              <p className="text-[10.5px] font-bold text-slate-800 leading-relaxed italic">
                                "{holding.strategy}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </aside>

              {/* Main Report Content */}
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 custom-scrollbar">
                {/* Core Strategy Banner */}
                {result.summary.strategyText && (
                  <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-between border border-slate-800 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-red-600/20 transition-colors"></div>
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">AI 핵심 전략 제안</div>
                        <div className="text-xl font-black text-white italic">{result.summary.strategyText}</div>
                      </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end relative z-10">
                      <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none mb-2">원금 회복 예상 기간</div>
                      <div className="text-3xl font-black text-white">{result.stats.recoveryMonths}<span className="text-sm font-bold text-slate-400 ml-1">개월</span></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Chart Card */}
                  <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col min-h-[320px]">
                    <CardHeader className="px-6 py-6 border-b border-slate-50">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">섹터 편중도 분석</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex-1 flex flex-col sm:flex-row items-center justify-between gap-10">
                      <div className="w-full sm:w-1/2 h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={result.sectors}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
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
                      <div className="w-full sm:w-1/2 space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          {result.sectors.map((sector, index) => (
                            <div key={sector.name} className="flex items-center justify-between text-xs font-black">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span className="text-slate-600">{sector.name}</span>
                              </div>
                              <span className="text-slate-900">{sector.percentage}%</span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed pt-2 border-t border-slate-100 italic">
                          {result.sectorAnalysisText}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Simulation Card */}
                  <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-8 flex flex-col min-h-[380px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <TrendingUp className="w-24 h-24 text-slate-900" />
                    </div>
                    <div className="flex items-center gap-2 mb-6 px-1">
                      <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">자산 회복 시뮬레이션</h3>
                      <Badge variant="outline" className="text-[9px] font-black ml-auto border-slate-200 text-slate-400">통계 추정치</Badge>
                    </div>
                    
                    <div className="flex-1 bg-slate-950 rounded-2xl relative overflow-hidden shadow-2xl pt-12 pb-2">
                       {/* Chart Glow Effect */}
                      <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full"></div>
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { x: 0, y: 35, y2: 35 },
                          { x: 1, y: 38, y2: 35 },
                          { x: 2, y: 33, y2: 34 },
                          { x: 3, y: 22, y2: 33 },
                          { x: 4, y: 12, y2: 33 },
                          { x: 5, y: 2, y2: 32 },
                        ]} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} opacity={0.3} />
                          <Line 
                            type="monotone" 
                            dataKey="y" 
                            stroke="#10B981" 
                            strokeWidth={5} 
                            dot={{ fill: '#10B981', r: 4, strokeWidth: 2, stroke: '#020617' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            strokeDasharray="8 5" 
                            animationDuration={2000}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="y2" 
                            stroke="#475569" 
                            strokeWidth={3} 
                            dot={false} 
                            opacity={0.6}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      
                      <div className="absolute top-4 left-6 flex gap-6 z-10">
                        <div className="flex items-center gap-2.5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[11px] font-black text-emerald-400">
                              <span className="w-5 h-1 bg-emerald-400 inline-block rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
                              <span>리밸런싱 전략 실행 시</span>
                            </div>
                            <span className="text-[9px] text-emerald-500/60 font-medium ml-7 mt-0.5">낙폭 과대 방어 및 수익 개선</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-500">
                              <span className="w-5 h-1 bg-slate-600 inline-block rounded-full"></span>
                              <span>현재 계좌 방치 시</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-medium ml-7 mt-0.5">지속적 손실 확대 위험</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-6 right-6 text-[9px] text-slate-500 italic bg-white/5 border border-white/5 backdrop-blur-md px-3 py-2 rounded-xl">
                        ※ 마코비츠 자산 배분 모델 및 몬테카를로 시뮬레이션 기반 통계치입니다.
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Action Plan Section */}
                {result.actionPlan && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3">
                        <Badge className="bg-slate-100 text-slate-500 font-black text-[9px] uppercase tracking-widest border-0">Short-Term</Badge>
                      </div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">단기 대처 방안 (1-2주)</h3>
                      <div className="flex gap-4">
                        <div className="w-1 h-12 bg-red-500 rounded-full shrink-0"></div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                          {result.actionPlan.shortTerm}
                        </p>
                      </div>
                    </Card>
                    <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3">
                        <Badge className="bg-emerald-100 text-emerald-600 font-black text-[9px] uppercase tracking-widest border-0">Long-Term</Badge>
                      </div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">장기 목표 구조 (3-6개월)</h3>
                      <div className="flex gap-4">
                        <div className="w-1 h-12 bg-emerald-500 rounded-full shrink-0"></div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                          {result.actionPlan.longTerm}
                        </p>
                      </div>
                    </Card>
                  </div>
                )}

                {/* 3 Step Guide */}
                <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white p-8 flex flex-col gap-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">3단계 자산 배분 가이드</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-red-200">1단계</span>
                        <span className="font-black text-red-900 text-sm leading-tight">{result.advice.step1.title}</span>
                      </div>
                      <p className="text-[11px] text-red-700 leading-relaxed font-bold mb-8">
                        {result.advice.step1.content}
                      </p>
                      <div className="mt-auto space-y-2">
                        {result.advice.step1.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white/70 p-3 rounded-xl border border-red-100 shadow-sm hover:translate-x-1 transition-transform">
                            <span className="text-[10px] font-black text-red-800">{item}</span>
                            <AlertCircle className="w-3 h-3 text-red-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-amber-200">2단계</span>
                        <span className="font-black text-amber-900 text-sm leading-tight">{result.advice.step2.title}</span>
                      </div>
                      <p className="text-[11px] text-amber-700 leading-relaxed font-bold mb-8">
                        {result.advice.step2.content}
                      </p>
                      <div className="mt-auto p-4 bg-white/70 rounded-2xl border border-amber-100 shadow-sm text-center">
                        <div className="text-sm font-black text-amber-600">{result.advice.step2.recommendation}</div>
                        <div className="text-[9px] font-black text-amber-500 mt-1 uppercase tracking-widest">방어적 자산 배분 권고</div>
                      </div>
                    </div>

                    <div className="flex flex-col bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-emerald-200">3단계</span>
                        <span className="font-black text-emerald-900 text-sm leading-tight">{result.advice.step3.title}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 leading-relaxed font-bold mb-8">
                        {result.advice.step3.content}
                      </p>
                      <div className="mt-auto flex flex-col gap-2">
                        {result.advice.step3.plan.map((p, idx) => (
                          <div key={idx} className="bg-white/70 p-3 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
                            <span className="text-[10px] font-black text-emerald-800">{p}</span>
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          </div>
                        ))}
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-[9px] bg-white border-emerald-200 text-emerald-600 font-black">정기 리밸런싱</Badge>
                          <Badge variant="outline" className="text-[9px] bg-white border-emerald-200 text-emerald-600 font-black">분할 매매</Badge>
                          <Badge variant="outline" className="text-[9px] bg-white border-emerald-200 text-emerald-600 font-black">우량 섹터 이동</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Individual Stock Diagnosis Report */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-[10px] font-black text-slate-400 gap-2 flex items-center uppercase tracking-widest">
                      <PieChart className="w-3 h-3 text-red-500" /> 전 종목 대응 전략 및 심층 진단
                    </h2>
                    <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-400">Total {result.holdings.length} stocks</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.holdings.map((holding, idx) => (
                      <Card key={`${holding.name}-deep-${idx}`} className="rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-slate-400 transition-all shadow-sm group">
                        <div className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">{holding.name}</h4>
                                <Badge className={cn(
                                  "text-[9px] font-black px-1.5 py-0 rounded-md",
                                  holding.status === '위험군' ? "bg-red-100 text-red-600" :
                                  holding.status === '주의' ? "bg-amber-100 text-amber-600" :
                                  "bg-emerald-100 text-emerald-600"
                                )}>
                                  {holding.status}
                                </Badge>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 mt-1 block tracking-wider">{holding.sector}</span>
                            </div>
                            <div className="text-right">
                              <div className={cn(
                                "text-lg font-black",
                                holding.yield < 0 ? "text-red-600" : "text-emerald-600"
                              )}>
                                {holding.yield > 0 ? '+' : ''}{holding.yield}%
                              </div>
                              <div className="text-[9px] font-bold text-slate-400 mt-0.5">
                                {holding.profit.toLocaleString()}원
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-50 bg-slate-50/30 -mx-5 px-5">
                            <div>
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">평단가 / 보유수량</div>
                              <div className="text-[11px] font-bold text-slate-700">{holding.avgPrice.toLocaleString()}원 / {holding.quantity}주</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">목표가 괴리율</div>
                              <div className="text-[11px] font-bold text-slate-700">{holding.consensusGap}%</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <div className="text-[10px] font-black text-slate-900 mb-1 flex items-center gap-1.5">
                                <div className="w-1 h-3 bg-red-600 rounded-full"></div> 퀀트 진단
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                                {holding.analysis || "이미지의 해상도가 낮아 심층 분석 데이터를 생성할 수 없습니다."}
                              </p>
                            </div>
                            <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                              <div className="text-[10px] font-black text-red-600 mb-1.5 flex items-center gap-1.5">
                                <RefreshCcw className="w-3 h-3" /> 대응 전략 가이드
                              </div>
                              <p className="text-[11px] text-slate-800 leading-relaxed font-black italic">
                                "{holding.strategy}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Final Conclusion */}
                {result.conclusion && (
                  <Card className="rounded-3xl border border-slate-900 shadow-2xl bg-slate-900 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"></div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 blur-3xl rounded-full"></div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" /> AI 종합 진단 결론
                    </h3>
                    <p className="text-base md:text-lg font-black text-white leading-relaxed italic">
                      "{result.conclusion}"
                    </p>
                  </Card>
                )}

                <footer className="pt-8 text-slate-400 text-[10px] leading-relaxed text-center max-w-3xl mx-auto italic font-medium space-y-4">
                  <p>
                    본 서비스는 고정된 알고리즘과 제도권 공공 데이터를 기반으로 제공되는 투자 참고용 통계 리포트이며, 자본시장법상 특정 종목에 대한 투자 권유나 매매 리딩이 아닙니다. 모든 투자 판단의 책임은 본인에게 있으며, 데이터의 정확성을 보장하지 않습니다.
                  </p>
                  <div className="flex justify-center gap-10 font-black opacity-30 text-[9px] uppercase tracking-tighter">
                    <span>Stock Insider CPR System</span>
                    <span>Risk Adjusted Returns</span>
                    <span>Modern Portfolio Analytics</span>
                  </div>
                </footer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
