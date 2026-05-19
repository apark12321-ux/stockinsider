import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route: OCR & Diagnosis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "이미지 데이터가 필요합니다." });
      }

      const prompt = `
        당신은 대한민국 자본시장법과 자산 배분 이론에 정통한 **초대형 투자은행(IB) 출신의 퀀트 애널리스트**입니다. 
        사용자가 업로드한 주식 계좌 캡처 이미지(키움, 미래에셋, 삼성, 한국투자, 나무 등 모든 국내 증권사 MTS 화면)에서 데이터를 초정밀하게 추출하고, 워렌 버핏이나 레이 달리오의 원칙을 결합한 고도의 포트폴리오 진단 리포트를 생성하세요.

        [데이터 추출 및 보정 가이드]
        1. **OCR 정밀도 극대화**: 숫자의 콤마(,), 음수 기호(-), 퍼센트(%)를 정확히 판독하십시오. 0과 8, 1과 7 등 혼동하기 쉬운 숫자는 문맥(수익금 = 보유수량 * (현재가 - 평단가))을 고려해 논리적으로 검증하세요.
        2. **UI 레이아웃 대응**: 증권사마다 종목명, 수익률, 수익금의 위치가 다릅니다. '평가손익', '수익률', '보유수량', '평균단가' 등의 키워드를 찾아 주변 값을 매핑하십시오.
        3. **통화 처리**: 모든 금액은 원화(KRW) 기준이며, 해외 주식의 경우 원화 환산가액이 있다면 이를 우선 사용하십시오.

        [심층 진단 로직]
        1. **섹터 분류**: IT(반도체/디스플레이), 모빌리티(배터리/전기차), 바이오, 금융, 소비재, 에너지, 인프라 등으로 정교하게 분류하십시오.
        2. **위험 평가**: 포트폴리오 분산도, 손실 확대 종목의 비중, 현금 비중 부족 등을 복합적으로 고려하여 0~100점의 '계좌 건강 지수'를 산출하십시오.
        3. **심리 분석**: 최근 매수(물타기) 흔적이 보이는지, 손절을 못하고 방치된 종목이 있는지 등 투자자의 심리적 상태를 유추하여 부드럽게 조언하십시오.

        [필수 포함 항목]
        - **summary**: 계좌의 정체성을 한 문장으로 정의 (예: "성장주에 매몰된 고위험 집중 투자형").
        - **holdings**: 각 종목별로 왜 '주의'인지 '위험군'인지 구체적 수치(예: -30% 이상 낙폭)를 기반으로 상태를 정의하십시오.
        - **strategy**: 종목별 1:1 맞춤형 액션 플랜. 단순히 '보유'가 아니라 "지지선 00원 이탈 시 비중 50% 축소"와 같은 구체성을 확보하십시오.
        - **actionPlan**: 당장 실행 가능한 'Trigger' 조건 제시.
        - **conclusion**: 투자자의 불안을 해소하면서도 냉철한 현실을 직시하게 만드는 전문가의 총평.

        응답은 반드시 아래 JSON 구조의 순수 JSON 텍스트여야 합니다 (마크다운 코드 블록 금지).

        {
          "analysisDate": "2026년 5월 19일",
          "summary": {
            "label": "포트폴리오 성격 (예: 변동성 노출형)",
            "score": 0-100,
            "description": "퀀트 관점의 계좌 상태 심층 요약",
            "tags": ["섹터 편중", "리스크 관리 부재", "방어주 부족"],
            "strategyText": "핵심 전략 (예: 현금 비중 30% 확보 및 배당주 스위칭)"
          },
          "stats": {
            "totalProfit": -12000000,
            "totalYield": -24.5,
            "sectorConcentration": "특정 섹터 비중 %",
            "recoveryMonths": 예상 회복 개월수,
            "riskScore": 0-100
          },
          "holdings": [
            {
              "name": "종목명",
              "profit": 0,
              "yield": 0.0,
              "quantity": 0,
              "avgPrice": 0,
              "sector": "정밀 분류 섹터",
              "riskLevel": "high|medium|low",
              "status": "수익권|주의|위험군",
              "analysis": "종목 상태에 대한 전문가급 심층 분석 (수급, 추세 등)",
              "strategy": "수치 기반의 구체적 대응 수칙",
              "consensusGap": 0.0
            }
          ],
          "sectors": [
            { "name": "섹터명", "percentage": 0 }
          ],
          "sectorAnalysisText": "섹터 불균형이 가져올 시나리오별 리스크 분석",
          "actionPlan": {
            "shortTerm": "1차 대응(기계적 매도/매수 점)",
            "longTerm": "포트폴리오 체질 개선 로드맵"
          },
          "advice": {
            "step1": { "title": "즉각적 조치", "content": "내용", "items": ["항목1", "항목2"] },
            "step2": { "title": "비중 재설계", "content": "내용", "recommendation": "권고안" },
            "step3": { "title": "모니터링 체계", "content": "내용", "plan": ["지침1", "지침2"] }
          },
          "focusStock": {
            "name": "가장 시급한 대응 필요 종목",
            "yield": -45.0,
            "link": "#"
          },
          "conclusion": "전문가 제언 및 격려의 메시지"
        }
      `;

      const analyzeWithRetry = async (retries = 2) => {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: imageData.split(',')[1] || imageData
                }
              }
            ],
            config: {
              responseMimeType: "application/json"
            }
          });
          
          return response;
        } catch (error: any) {
          const errorMessage = error?.message || "";
          const isOverloaded = errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE") || errorMessage.includes("Too Many Requests");
          
          if (retries > 0 && isOverloaded) {
            console.log(`Retrying analysis due to system load... ${retries} retries left`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return analyzeWithRetry(retries - 1);
          }
          throw error;
        }
      };

      const response = await analyzeWithRetry();
      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      const errorMessage = error?.message || "";
      const isOverloaded = errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE");
      const isQuotaExceeded = errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.includes("RESOURCE_EXHAUSTED");
      const isNotFound = errorMessage.includes("404") || errorMessage.includes("not found");
      
      let clientMessage = "이미지 분석 중 오류가 발생했습니다. 선명한 스크린샷인지 확인해 주세요.";
      if (isQuotaExceeded) {
        clientMessage = "현재 서비스 이용량이 많아 무료 할당량이 소진되었습니다. 약 1분 후 다시 시도해 주시거나, 나중에 이용해 주세요.";
      } else if (isOverloaded) {
        clientMessage = "현재 AI 서버 부하가 높습니다. 잠시 후(10-30초) 다시 시도해 주세요.";
      } else if (isNotFound) {
        clientMessage = "시스템 업데이트 중입니다. 잠시 후 다시 시도해 주세요.";
      }
      
      res.status(500).json({ error: clientMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
