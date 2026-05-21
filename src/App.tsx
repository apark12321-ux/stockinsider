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
import { DiagnosisResult, Holding } from './types';
import { cn } from '@/lib/utils';

const COLORS = ['#DC2626', '#334155', '#475569', '#64748b', '#94a3b8'];

function CustomDonutChart({ data, colors }: { data: { name: string; percentage: number }[]; colors: string[] }) {
  let accumulatedPercent = 0;
  return (
    <svg viewBox="0 0 100 100" className="w-56 h-56 select-none sm:w-64 sm:h-64">
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
            strokeWidth="12"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(${rotation} 50 50)`}
            className="transition-all duration-300 hover:stroke-[14] cursor-pointer"
            style={{ transformOrigin: "50px 50px" }}
          />
        );
      })}
    </svg>
  );
}

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

        // 세로로 긴 이미지 혹은 고화질 대형 이미지의 최대 기준점 설정
        // 텍스트(종목명, 수치) 가독성을 보존하기 위한 가로세로 비율 맞춤 압축
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
        // 높은 압축률로 파일 크기를 100~300KB 선으로 줄이되(텍스트 OCR 식별성 극대화 위해 0.82 비율 적용)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
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
      const base64 = await compressAndResizeImage(file);
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
          setError(`서버 응답 오류 (상태 코드: ${res.status}). 잠시 후 다시 시도해 주세요.`);
          setLoading(false);
          return;
        }
        
        if (!res.ok) {
          setError(data.error || '분석 중 오류가 발생했습니다.');
          setLoading(false);
          return;
        }
        
        setResult(data);
        setLoading(false);
      } catch (err: any) {
        setError(`네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. (${err?.message || err})`);
        setLoading(false);
      }
    } catch (err) {
      setError('이미지를 읽고 압축하는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 pb-20 selection:bg-red-600/10 overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500/5 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Disclaimer Top */}
      <div className="bg-white text-slate-500 py-2.5 px-4 text-center text-[10px] sm:text-xs leading-tight font-medium border-b border-slate-100">
        본 서비스는 통계적 데이터 기반 투자 참고 리포트이며, 자본시장법상 특정 종목 권유가 아닙니다.
      </div>

      <header className="fixed top-0 sm:top-4 left-0 right-0 z-50 px-0 sm:px-4">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md sm:rounded-2xl h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b sm:border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-500/20 shrink-0">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 break-keep select-none">
              스탁 인사이더
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {result && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResult(null)} 
                className="rounded-full text-xs font-bold hover:bg-slate-100 text-slate-600 transition-colors px-3 py-1.5"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" /> 처음으로
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">
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
                <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed px-6">
                  국내 주식 전문가의 알고리즘으로 내 포트폴리오를 <br className="hidden sm:block"/>
                  객관적이고 냉정하게 분석해 드립니다.
                </p>
              </div>

              <div className="max-w-xl mx-auto floating-card bg-white group cursor-pointer relative overflow-hidden border border-slate-100">
                <div className="p-10 sm:p-20 text-center">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileUpload}
                    accept="image/*"
                    disabled={loading}
                  />
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-24 h-24 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-xl shadow-red-500/5 relative">
                      {loading && (
                        <div className="absolute inset-0 border-4 border-red-100 border-t-red-600 rounded-2xl animate-spin"></div>
                      )}
                      {loading ? (
                        <RefreshCcw className="w-10 h-10" />
                      ) : (
                        <Upload className="w-10 h-10" />
                      )}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900">계좌 스크린샷 업로드</h3>
                      <p className="text-slate-500 font-bold opacity-70">MTS 종목 리스트 화면을 캡처해서 올려주세요</p>
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
                      <div className="mt-4 p-5 bg-red-50 border border-red-100 rounded-2xl max-w-sm mx-auto shadow-sm">
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
                <div className="space-y-4 p-8 floating-card bg-white border border-slate-100">
                  <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                    <PieChart className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg">섹터 과밀집 점검</h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-70">특정 시장 이슈에 모든 자산이 <br/>흔들리지 않는지 분석합니다.</p>
                </div>
                <div className="space-y-4 p-8 floating-card bg-white border border-slate-100">
                  <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg">변동성 리스크 평가</h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-70">계좌의 표준편차를 낮추는 <br/>자산 배분 구조를 제안합니다.</p>
                </div>
                <div className="space-y-4 p-8 floating-card bg-white border border-slate-100">
                  <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg">데이터 매칭 시스템</h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-70">실시간 시장 데이터와 내 계좌의 <br/>괴리율을 세밀하게 분석합니다.</p>
                </div>
              </div>
            </motion.div>
          ) : (
          <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12 pb-24 max-w-4xl mx-auto"
            >
              {/* 1. Executive Summary Section */}
              <section className="floating-card p-10 sm:p-16 flex flex-col gap-10 bg-white border border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {result.summary.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className={cn(
                      "text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest",
                      tag === "분석일" ? "bg-slate-100 text-slate-400" : "bg-red-50 text-red-600"
                    )}>
                      {tag === "분석일" ? `${tag} ${result.analysisDate}` : tag}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-6">
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Executive Summary</h2>
                  <div className="text-slate-900 font-black text-4xl sm:text-6xl tracking-tighter leading-[1.1]">
                    {result.summary.label}
                  </div>
                  <p className="text-slate-600 text-lg sm:text-xl leading-relaxed font-bold opacity-90">
                    {result.summary.description}
                  </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">총 손익</div>
                    <div className={cn("text-xl font-black tracking-tighter", result.stats.totalProfit < 0 ? "text-red-600" : "text-emerald-600")}>
                      {result.stats.totalProfit.toLocaleString()}원
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">분석 수익률</div>
                    <div className={cn("text-xl font-black tracking-tighter", result.stats.totalYield < 0 ? "text-red-600" : "text-emerald-600")}>
                      {result.stats.totalYield}%
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">섹터 집중도</div>
                    <div className="text-xl font-black tracking-tighter text-slate-800">{result.stats.sectorConcentration}</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">위험 점수</div>
                    <div className="text-xl font-black tracking-tighter text-red-600">{result.stats.riskScore}/100</div>
                  </div>
                </div>
              </section>

              {/* 2. Visual Analysis (Charts) */}
              <div className="grid grid-cols-1 gap-8">
                 <div className="floating-card flex flex-col bg-white border border-slate-100 overflow-hidden">
                  <div className="px-10 py-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                       <PieChart className="w-4 h-4 text-red-600" /> Sector Concentration
                    </div>
                    <Badge variant="ghost" className="text-[10px] font-black text-red-600 animate-pulse">Distribution Analysis</Badge>
                  </div>
                  <CardContent className="p-10 sm:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="w-full lg:w-1/2 h-72 relative flex items-center justify-center">
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center shadow-inner text-center">
                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-3">대표 섹터</div>
                            <div className="text-2xl font-black text-slate-800">{result.sectors[0].percentage}%</div>
                          </div>
                       </div>
                       <CustomDonutChart data={result.sectors} colors={COLORS} />
                    </div>
                    <div className="w-full lg:w-1/2 space-y-8">
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
                      <p className="text-base text-slate-700 font-bold leading-relaxed pt-10 border-t border-slate-100 italic break-keep opacity-80">
                        {result.sectorAnalysisText}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </div>

              {/* 3. Holdings Quick List */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tighter uppercase">Portfolio Snapshot</h2>
                  <span className="text-xs font-black text-slate-400 ml-auto">{result.holdings.length} Assets Identified</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {result.holdings.map((holding, index) => {
                    const sectorIndex = result.sectors.findIndex(s => s.name === holding.sector);
                    const sectorColor = sectorIndex !== -1 ? COLORS[sectorIndex % COLORS.length] : '#DC2626';
                    
                    return (
                      <div key={`${holding.name}-${index}`} className="p-6 bg-white rounded-2xl border border-slate-100 transition-all hover:bg-slate-50 relative group overflow-hidden shadow-sm">
                        <div className="absolute top-0 bottom-0 left-0 w-1.5" style={{ backgroundColor: sectorColor }}></div>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                            <span className="font-black text-lg text-slate-900 block truncate">{holding.name}</span>
                            <Badge className={cn(
                              "text-[9px] font-black px-2 py-0.5 rounded-full uppercase",
                              holding.status === '위험군' ? "bg-red-600 text-white" :
                              holding.status === '주의' ? "bg-amber-500 text-white" :
                              "bg-emerald-600 text-white"
                            )}>
                              {holding.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{holding.sector}</span>
                            <span className={cn(
                              "text-xl font-black tracking-tighter",
                              holding.yield < 0 ? "text-red-600" : "text-emerald-600"
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

              {/* 4. Deep Analysis Feed */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 px-4">
                  <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tighter uppercase">Deep Intelligence Feed</h2>
                </div>
                
                <div className="space-y-8">
                  {result.holdings.map((holding, idx) => (
                    <div key={`${holding.name}-deep-${idx}`} className="floating-card overflow-hidden bg-white border border-slate-100 group">
                      <div className="p-8 sm:p-16 space-y-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-10 border-b border-slate-100 pb-12">
                          <div className="min-w-0">
                            <div className="flex items-center gap-4 flex-wrap mb-4">
                              <h4 className="text-3xl sm:text-5xl font-black text-slate-900 group-hover:text-red-600 transition-colors tracking-tighter uppercase">{holding.name}</h4>
                              <Badge className={cn(
                                "text-xs font-black px-5 py-1.5 rounded-full shadow-md uppercase tracking-widest",
                                holding.status === '위험군' ? "bg-red-600 text-white" :
                                holding.status === '주의' ? "bg-amber-500 text-white" :
                                "bg-emerald-600 text-white"
                              )}>
                                {holding.status}
                              </Badge>
                            </div>
                            <span className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase">{holding.sector || '기타 섹터'} · {holding.quantity.toLocaleString()}주 보유</span>
                          </div>
                          <div className="text-left sm:text-right shrink-0 w-full sm:w-auto p-8 sm:p-10 bg-slate-50 rounded-3xl shadow-inner border border-slate-100">
                            <div className={cn(
                              "text-5xl sm:text-7xl font-black tracking-tighter leading-none mb-4",
                              holding.yield < 0 ? "text-red-600" : "text-emerald-600"
                            )}>
                              {holding.yield > 0 ? '+' : ''}{holding.yield}%
                            </div>
                            <div className="text-sm sm:text-xl font-bold text-slate-400 tracking-tight">
                              평단 {holding.avgPrice.toLocaleString()}원 · 손익 {holding.profit.toLocaleString()}원
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                          <div className="space-y-8">
                            <div className="text-xs font-black text-slate-500 flex items-center gap-3 uppercase tracking-[0.2em]">
                              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div> Quant Analysis
                            </div>
                            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-semibold opacity-90">
                              {holding.analysis}
                            </p>
                          </div>

                          <div className="bg-red-50 p-10 sm:p-16 rounded-3xl border border-red-100 shadow-inner relative overflow-hidden h-auto group/strategy">
                            <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover/strategy:scale-125 transition-transform duration-1000">
                              <ShieldAlert className="w-48 h-48 text-red-600" />
                            </div>
                            <div className="text-xs font-black text-red-600 mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                              <RefreshCcw className="w-4 h-4 animate-spin-slow" /> Strategic Action
                            </div>
                            <p className="text-2xl sm:text-3xl text-slate-900 leading-[1.35] font-black italic">
                              "{holding.strategy}"
                            </p>
                            <div className="mt-12 flex gap-3 flex-wrap">
                              <Badge variant="secondary" className="text-[10px] bg-white text-red-600 border-none font-black px-5 py-2 rounded-full shadow-sm uppercase">Gap {holding.consensusGap}%</Badge>
                              <Badge variant="secondary" className="text-[10px] bg-white text-red-600 border-none font-black px-5 py-2 rounded-full shadow-sm uppercase">Active Tracking</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Roadmap Section */}
              <div className="floating-card p-12 sm:p-20 flex flex-col gap-16 bg-white border border-slate-100">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] text-center sm:text-left">Precision Roadmap</h3>
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-tight text-center sm:text-left">AI Asset Rebalancing Protocol</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[result.advice.step1, result.advice.step2, result.advice.step3].map((step, idx) => (
                    <div key={idx} className={cn(
                      "flex flex-col rounded-3xl p-10 sm:p-12 border shadow-sm transition-all",
                      idx === 0 ? "bg-red-50 border-red-100 hover:bg-red-100/50" :
                      idx === 1 ? "bg-slate-50 border-slate-100 hover:bg-slate-100/50" :
                      "bg-red-50/50 border-red-100/30 hover:bg-red-50/80"
                    )}>
                      <div className="flex items-center gap-6 mb-10">
                        <span className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl shrink-0",
                          idx === 1 ? "bg-slate-600 text-white" : "bg-red-600 text-white shadow-red-500/10"
                        )}>{idx + 1}</span>
                        <span className="font-black text-slate-800 text-xl leading-tight uppercase tracking-tighter">{(step as any).title}</span>
                      </div>
                      <p className="text-base text-slate-500 leading-relaxed font-semibold mb-12 opacity-80">
                        {(step as any).content}
                      </p>
                      
                      <div className="mt-auto space-y-4">
                         {(step as any).items?.map((item: string, i: number) => (
                           <div key={i} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group/item">
                              <span className="text-xs font-black text-slate-600">{item}</span>
                              <AlertCircle className="w-4 h-4 text-red-500 group-hover/item:text-red-600 transition-colors" />
                           </div>
                         ))}
                         {(step as any).recommendation && (
                            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                              <div className="text-xl font-black text-slate-600 tracking-tight">{(step as any).recommendation}</div>
                              <div className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-[0.2em] leading-none opacity-60">High Priority Action</div>
                            </div>
                         )}
                         {(step as any).plan?.map((p: string, i: number) => (
                           <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group/plan">
                              <span className="text-xs font-black text-red-600">{p}</span>
                              <TrendingUp className="w-4 h-4 text-red-400 opacity-40 group-hover/plan:opacity-100 transition-opacity" />
                           </div>
                         ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Professional Verdict */}
              {result.conclusion && (
                 <div className="floating-card bg-slate-900 p-12 sm:p-24 relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-400 to-slate-900"></div>
                  <div className="absolute -bottom-20 -right-20 w-[40rem] h-[40rem] bg-red-600/10 blur-[150px] rounded-full group-hover:bg-red-600/20 transition-all duration-1000"></div>
                  <div className="absolute top-0 left-0 p-16 opacity-5">
                     <ShieldAlert className="w-64 h-64 text-white" />
                  </div>
                  <h3 className="text-[12px] font-black text-red-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-6 relative z-10">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div> Intelligence Consensus
                  </h3>
                  <p className="text-3xl sm:text-6xl font-black text-white leading-[1.15] break-words relative z-10 tracking-tighter drop-shadow-2xl">
                    "{result.conclusion}"
                  </p>
                </div>
              )}

              <footer className="pt-24 pb-32 text-slate-500 text-[11px] leading-loose text-center max-w-4xl mx-auto italic font-black uppercase tracking-[0.2em] space-y-12 border-t border-slate-100/50 mt-12">
                <p className="break-keep opacity-60 px-10">
                  This analysis CPR system utilizes statistical probability models for simulation purposes. Stock Insider does not guarantee specific returns, and financial markets carry inherent liquidity risks. Professional consultation is recommended for high-NAV portfolios.
                </p>
                <div className="flex flex-col items-center gap-4 opacity-30">
                  <TrendingUp className="w-6 h-6" />
                  <p className="text-[10px]">
                    Analysis CPR System v2.0 · Professional Quant Engine
                  </p>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
