import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

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
        사용자가 업로드한 주식 계좌 캡처 이미지에서 데이터를 **초정밀하게 추출**하고, 모든 종목에 대한 **풀-커버리지(Full Coverage)** 리포트를 생성하세요.

        [심층 진단 가이드]
        - **analysis**: 단순히 상태 요약이 아니라, 해당 종목이 속한 업황, 최근의 수급 동향, 차트상 주요 지지선 및 저항선을 분석하여 **3문장 이상의 전문가급 코멘트**를 작성하십시오. (단, 분석해야 할 종목 수 혹은 스크린샷 내 종목이 5개를 초과하는 등 종목 수가 매우 많은 경우에는 데이터 크기로 인한 출력 끊김을 전격 방지하기 위해 각 분석글을 1-2문장의 밀도 높은 엑기스로 요약 서술하십시오).
        - **strategy**: "보유" 같은 짧은 답변은 금지됩니다. "00원 지지 시 홀딩하되, 반등 시 00원 부근에서 비중 70% 축소"와 같이 **구체적 가격과 실행 수치**를 포함한 '풀-플레지(Full-fledge)' 대응 방안을 제시하십시오. (마찬가지로 종목 수가 많을 때는 군더더기를 배제하고 가장 파괴력 있고 빠른 가격 수치 중심의 액션 가이드만 일목요연하게 제공하십시오).

        [데이터 추출 절대 원칙]
        1. **누락 금지**: 이미지에 흐릿하게라도 보이는 **모든 종목명과 숫자**를 하나도 빠질없이 'holdings' 배열에 담으십시오. 종목이 10개면 10개 모두 분석해야 합니다.
        2. **수치 정합성**: 종목명, 수익률(%), 수익금, 수량, 평단가를 정확히 매핑하십시오. 숫자가 잘 안 보인다면 앞뒤 문맥과 증권사 UI 특성을 고려해 유추하되, 최대한 정확하게 추출하십시오.
        3. **-90% 이하 극단적 손실 종목**: 에이프로젠, 풍전약품 등과 같이 상장폐지 위기나 극단적 손실 구간에 있는 종목은 더욱 심층적인 '생존 전략'을 제시하십시오.
        4. **JSON 수치 규칙**: 모든 숫자 값(수익률, 금액 등)은 순수 숫자로만 작성하십시오. 절대 숫자 앞에 '+' 기호를 붙이지 마십시오. (예: "+15.0" -> 15.0)
        5. **출력 토큰 안전 예방 수치**: 개별 종목이 아무리 많더라도, 출력물이 8,192 토큰을 넘지 않도록 문맥 농도를 자동 세밀 관리하십시오. 형식이 도중에 끊기는 현상을 절대 차단하는 것이 그 무엇보다 중요합니다.

        [JSON 구조 필독 - 마크다운 금지]
        {
          "analysisDate": "2026년 5월 19일",
          "summary": {
            "label": "계좌의 성격을 규정하는 한 줄 제목",
            "score": 0-100,
            "description": "퀀트 관점의 계좌 심화 분석 (최소 200자)",
            "tags": ["태그1", "태그2", "태그3"],
            "strategyText": "핵심 운영 전략 (가장 중요)"
          },
          "holdings": [
            {
              "name": "종목명",
              "profit": 0,
              "yield": 0.0,
              "quantity": 0,
              "avgPrice": 0,
              "sector": "최대한 상세한 섹터 분류",
              "riskLevel": "high|medium|low",
              "status": "수익권|주의|위험군",
              "analysis": "해당 종목에 대한 심층 퀀트 분석 (매우 상세히)",
              "strategy": "수치와 가격이 포함된 실행 가능한 대응 로직 (매우 상세히)",
              "consensusGap": 0.0
            }
          ],
          "stats": {
            "totalProfit": 0,
            "totalYield": 0.0,
            "sectorConcentration": "전체 비중 %",
            "recoveryMonths": 0,
            "riskScore": 0-100
          },
          "sectors": [ { "name": "섹터명", "percentage": 0 } ],
          "sectorAnalysisText": "섹터 비중에 따른 포트폴리오 붕괴 위험도 분석",
          "actionPlan": {
            "shortTerm": "즉각적 실행 지침",
            "longTerm": "중장기 리밸런싱 로드맵"
          },
          "advice": {
            "step1": { "title": "즉각 조치", "content": "내용", "items": ["항목1"] },
            "step2": { "title": "비중 재설계", "content": "내용", "recommendation": "권고안" },
            "step3": { "title": "모니터링 체계", "content": "내용", "plan": ["지침1"] }
          },
          "conclusion": "투자자에게 전하는 마지막 결론 및 심리적 가이드"
        }
      `;

      const analyzeWithRetry = async (retries = 3) => {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
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
          const isRetryable = 
            errorMessage.includes("500") || 
            errorMessage.includes("503") || 
            errorMessage.includes("INTERNAL") || 
            errorMessage.includes("high demand") || 
            errorMessage.includes("UNAVAILABLE") || 
            errorMessage.includes("Too Many Requests");
          
          if (retries > 0 && isRetryable) {
            console.log(`Retrying analysis due to transient error... (${errorMessage}) ${retries} retries left`);
            // Exponential backoff
            const delay = (4 - retries) * 2000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return analyzeWithRetry(retries - 1);
          }
          throw error;
        }
      };

      const response = await analyzeWithRetry();
      const rawText = response.text || "{}";
      
      // Robust JSON Cleaning
      const cleanedText = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/:\s*\+([0-9])/g, ': $1') // Fix for +15.5 type values
        .trim();

      const result = JSON.parse(cleanedText);
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
      
      const debugSuffix = errorMessage ? ` (${errorMessage})` : "";
      res.status(500).json({ error: `${clientMessage}${debugSuffix}` });
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
