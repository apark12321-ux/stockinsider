export interface Holding {
  name: string;
  profit: number;
  yield: number;
  quantity: number;
  avgPrice: number;
  sector: string;
  riskLevel: 'high' | 'medium' | 'low';
  status: '수익권' | '주의' | '위험군';
  strategy: string;
  analysis?: string;
  consensusGap: number;
}

export interface SectorData {
  name: string;
  percentage: number;
}

export interface DiagnosisResult {
  analysisDate: string;
  summary: {
    label: string;
    score: number;
    description: string;
    tags: string[];
    strategyText?: string;
  };
  stats: {
    totalProfit: number;
    totalYield: number;
    sectorConcentration: string;
    recoveryMonths: number;
    riskScore: number;
  };
  holdings: Holding[];
  sectors: SectorData[];
  sectorAnalysisText: string;
  actionPlan?: {
    shortTerm: string;
    longTerm: string;
  };
  advice: {
    step1: {
      title: string;
      content: string;
      items: string[];
    };
    step2: {
      title: string;
      content: string;
      recommendation: string;
    };
    step3: {
      title: string;
      content: string;
      plan: string[];
    };
  };
  focusStock?: {
    name: string;
    yield: number;
    link: string;
  };
  conclusion?: string;
}
