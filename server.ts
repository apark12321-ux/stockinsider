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

      // Safe complete default schema to prevent client crashes due to missing attributes
      const defaultResult = {
        analysisDate: new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }),
        summary: {
          label: "진단 완료 포트폴리오",
          score: 50,
          description: "업로드해주신 계좌 정보를 바탕으로 퀀트 분석 및 진단을 마쳤습니다.",
          tags: ["포트폴리오 진단", "분석 완료"],
          strategyText: "자산 비율을 균형 있게 다져 리스크를 방어하십시오."
        },
        stats: {
          totalProfit: 0,
          totalYield: 0,
          sectorConcentration: "분석 완료",
          recoveryMonths: 6,
          riskScore: 50
        },
        holdings: [] as any[],
        sectors: [ { name: "기타", percentage: 100 } ],
        sectorAnalysisText: "섹터 집중도 분석 정보가 안전하게 산출되었습니다.",
        actionPlan: {
          shortTerm: "단기 포트폴리오 변동 위험도 극복에 최선을 다해 대처하십시오.",
          longTerm: "중장기 자산 리밸런싱 및 분산 전략 수립을 적극 고려해 보십시오."
        },
        advice: {
          step1: { title: "리스크 관리", content: "현재 계좌의 섹터 및 개별 자산 비중을 점검해 변동성에 대응하십시오.", items: [] as string[] },
          step2: { title: "포트폴리오 리밸런싱", content: "특정 개별 종목 편중 비율을 낮추어 리스크 분산을 실현하십시오.", recommendation: "분산 투자 유도" },
          step3: { title: "정기 모니터링", content: "주요 기술적 지지선 및 실적 턴어라운드 일정을 모니터링하십시오.", plan: ["정기 리포트 분석"] }
        },
        focusStock: { name: "", yield: 0, link: "#" } as any,
        conclusion: "체계적 분석을 통해 심리적 흔들림 없는 합리적인 투자를 구축하시기를 진심으로 응원합니다."
      };

      const ensureStructure = (parsed: any): any => {
        const merged = { ...defaultResult };
        if (!parsed || typeof parsed !== 'object') return merged;

        if (parsed.analysisDate) merged.analysisDate = parsed.analysisDate;
        
        if (parsed.summary && typeof parsed.summary === 'object') {
          merged.summary = {
            label: parsed.summary.label || defaultResult.summary.label,
            score: typeof parsed.summary.score === 'number' ? parsed.summary.score : defaultResult.summary.score,
            description: parsed.summary.description || defaultResult.summary.description,
            tags: Array.isArray(parsed.summary.tags) ? parsed.summary.tags : defaultResult.summary.tags,
            strategyText: parsed.summary.strategyText || defaultResult.summary.strategyText,
          };
        }

        if (parsed.stats && typeof parsed.stats === 'object') {
          merged.stats = {
            totalProfit: typeof parsed.stats.totalProfit === 'number' ? parsed.stats.totalProfit : defaultResult.stats.totalProfit,
            totalYield: typeof parsed.stats.totalYield === 'number' ? parsed.stats.totalYield : defaultResult.stats.totalYield,
            sectorConcentration: parsed.stats.sectorConcentration || defaultResult.stats.sectorConcentration,
            recoveryMonths: typeof parsed.stats.recoveryMonths === 'number' ? parsed.stats.recoveryMonths : defaultResult.stats.recoveryMonths,
            riskScore: typeof parsed.stats.riskScore === 'number' ? parsed.stats.riskScore : defaultResult.stats.riskScore,
          };
        }

        if (Array.isArray(parsed.holdings)) {
          merged.holdings = parsed.holdings.map((h: any) => ({
            name: h.name || "미상 종목",
            profit: typeof h.profit === 'number' ? h.profit : 0,
            yield: typeof h.yield === 'number' ? h.yield : 0.0,
            quantity: typeof h.quantity === 'number' ? h.quantity : 0,
            avgPrice: typeof h.avgPrice === 'number' ? h.avgPrice : 0,
            sector: h.sector || "기타",
            riskLevel: h.riskLevel || "medium",
            status: h.status || "주의",
            analysis: h.analysis || "종목 세부 분석 정보를 구성하는 중입니다.",
            strategy: h.strategy || "종목 대응 전략 수립을 보충 중입니다.",
            consensusGap: typeof h.consensusGap === 'number' ? h.consensusGap : 0.0
          }));
        }

        if (Array.isArray(parsed.sectors) && parsed.sectors.length > 0) {
          merged.sectors = parsed.sectors.map((s: any) => ({
            name: s.name || "기타",
            percentage: typeof s.percentage === 'number' ? s.percentage : 0
          }));
        } else if (merged.holdings.length > 0) {
          const sectorMap: { [key: string]: number } = {};
          merged.holdings.forEach((h: any) => {
            const secName = h.sector || "기타";
            sectorMap[secName] = (sectorMap[secName] || 0) + 1;
          });
          const total = merged.holdings.length;
          merged.sectors = Object.entries(sectorMap).map(([name, count]) => ({
            name,
            percentage: Math.round((count / total) * 100)
          })).sort((a, b) => b.percentage - a.percentage);
        }

        if (parsed.sectorAnalysisText) merged.sectorAnalysisText = parsed.sectorAnalysisText;

        if (parsed.actionPlan && typeof parsed.actionPlan === 'object') {
          merged.actionPlan = {
            shortTerm: parsed.actionPlan.shortTerm || defaultResult.actionPlan.shortTerm,
            longTerm: parsed.actionPlan.longTerm || defaultResult.actionPlan.longTerm,
          };
        }

        if (parsed.advice && typeof parsed.advice === 'object') {
          const s1 = parsed.advice.step1 || {};
          const s2 = parsed.advice.step2 || {};
          const s3 = parsed.advice.step3 || {};
          merged.advice = {
            step1: {
              title: s1.title || defaultResult.advice.step1.title,
              content: s1.content || defaultResult.advice.step1.content,
              items: Array.isArray(s1.items) ? s1.items : defaultResult.advice.step1.items
            },
            step2: {
              title: s2.title || defaultResult.advice.step2.title,
              content: s2.content || defaultResult.advice.step2.content,
              recommendation: s2.recommendation || defaultResult.advice.step2.recommendation
            },
            step3: {
              title: s3.title || defaultResult.advice.step3.title,
              content: s3.content || defaultResult.advice.step3.content,
              plan: Array.isArray(s3.plan) ? s3.plan : defaultResult.advice.step3.plan
            }
          };
        }

        if (parsed.conclusion) merged.conclusion = parsed.conclusion;
        
        // Ensure focus stock is valid and matches our holding items
        if (parsed.focusStock && typeof parsed.focusStock === 'object') {
          merged.focusStock = {
            name: parsed.focusStock.name || "",
            yield: typeof parsed.focusStock.yield === 'number' ? parsed.focusStock.yield : 0,
            link: parsed.focusStock.link || "#"
          };
        } else if (merged.holdings.length > 0) {
          const sorted = [...merged.holdings].sort((a: any, b: any) => a.yield - b.yield);
          if (sorted[0]) {
            merged.focusStock = {
              name: sorted[0].name,
              yield: sorted[0].yield,
              link: "#"
            };
          }
        }

        return merged;
      };

      const modelsToTry = [
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash"
      ];

      const analyzeWithFallback = async () => {
        let lastError: any = null;
        
        for (const modelName of modelsToTry) {
          let attempts = 2; // Try up to 2 times per model if rate-limited or transient failure triggers
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              console.log(`Analyzing screenshot with ${modelName} (Attempt ${attempt}/${attempts})...`);
              const response = await ai.models.generateContent({
                model: modelName,
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

              if (response && response.text) {
                console.log(`Success with model: ${modelName}`);
                return response.text;
              }
              throw new Error("Returned content is empty or undefined.");
            } catch (error: any) {
              lastError = error;
              const errMsg = error?.message || "";
              console.warn(`Model ${modelName} (Attempt ${attempt}) failed: ${errMsg}`);

              const isTransient = 
                errMsg.includes("500") ||
                errMsg.includes("503") ||
                errMsg.includes("429") ||
                errMsg.includes("Quota") ||
                errMsg.includes("high demand") ||
                errMsg.includes("UNAVAILABLE") ||
                errMsg.includes("Too Many Requests") ||
                errMsg.includes("INTERNAL");

              if (attempt < attempts && isTransient) {
                const backoffDelay = attempt * 1500;
                await new Promise(r => setTimeout(r, backoffDelay));
              }
            }
          }
        }
        throw lastError || new Error("All fallback Gemini models failed.");
      };

      const rawText = await analyzeWithFallback();
      
      // Extract the JSON portion via advanced regex to avoid prefix/suffix comment pollution
      let jsonPart = rawText;
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonPart = jsonMatch[0];
      }

      // Clean typical numerical and escape characters
      const cleanedText = jsonPart
        .replace(/:\s*\+([0-9]+(?:\.[0-9]+)?)/g, ': $1') // Fix "+15.5" format into standard 15.5 number
        .trim();

      const parsedJson = JSON.parse(cleanedText);
      const result = ensureStructure(parsedJson);
      res.json(result);
    } catch (error: any) {
      console.error("AI Analysis Final Failure:", error);
      const errorMessage = error?.message || "";
      const isOverloaded = errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE");
      const isQuotaExceeded = errorMessage.includes("429") || errorMessage.includes("Quota exceeded") || errorMessage.includes("RESOURCE_EXHAUSTED");
      const isNotFound = errorMessage.includes("404") || errorMessage.includes("not found");
      
      let clientMessage = "이미지 분석 진행 중 알 수 없는 지연이 발생했습니다. 선명한 스크린샷인지 확인 후 다시 시도해 주세요.";
      if (isQuotaExceeded) {
        clientMessage = "현재 서비스 이용량이 많아 할당량이 한시 정체되었습니다. 잠시 후 약 30초~1분 뒤 다시 업로드해 주세요.";
      } else if (isOverloaded) {
        clientMessage = "현재 AI 분석 대기줄이 원활하지 않습니다. 잠시 후(15초 뒤) 다시 업로드해 주세요.";
      } else if (isNotFound) {
        clientMessage = "모듈 재구성 중입니다. 선명히 캡쳐된 이미지로 재시도해 주세요.";
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
