import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client with Cline/Kimi configuration
const openai = new OpenAI({
  baseURL: process.env.AI_BASE_URL || 'https://api.cline.bot/api/v1',
  apiKey: process.env.AI_API_KEY,
});

export async function POST(request: Request) {
  const timestamp = new Date().toLocaleTimeString();
  
  try {
    const { query } = await request.json();
    console.log(`[${timestamp}] Incoming Request: ${query.substring(0, 50)}`);

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    let context = query;
    let isPDF = false;

    // 1. Improved PDF Detection (Handle ArXiv and non-standard extensions)
    const isArxiv = query.includes('arxiv.org/pdf/');
    const hasPdfExt = query.toLowerCase().split('?')[0].endsWith('.pdf');

    if (hasPdfExt || isArxiv) {
      console.log(`[${timestamp}] PDF Source Detected: ${query}`);
      try {
        const response = await axios.get(query, { 
          responseType: 'arraybuffer',
          timeout: 25000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/pdf'
          }
        });
        
        console.log(`[${timestamp}] Download successful. Size: ${response.data.byteLength} bytes`);

        // @ts-ignore
        const pdfModule: any = await import('pdf-parse');
        const PDFParse = pdfModule.PDFParse || pdfModule.default?.PDFParse;
        
        if (PDFParse) {
          const parser = new PDFParse({ data: response.data });
          const textResult = await parser.getText();
          context = `[SOURCE DOCUMENT: ${query}]\n\nCONTENT:\n${textResult.text.substring(0, 60000)}`; 
          isPDF = true;
          console.log(`[${timestamp}] PDF Extraction Success: ${textResult.text.length} characters.`);
          await parser.destroy();
        } else {
          throw new Error("PDFParse class not found in module");
        }
      } catch (err: any) {
        console.error(`[${timestamp}] PDF Pipeline Error: ${err.message}`);
        // Fallback to query as text if PDF fails
        context = `[PDF ATTACHMENT FAILED] URL: ${query}\n(Note to AI: Extraction failed, please analyze based on the URL context if possible)`;
      }
    }

    // 2. AI Synthesis Logic with Structured Output
    console.log(`[${timestamp}] Executing Structured Agentic Synthesis...`);
    try {
      const response: any = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'moonshotai/kimi-k2.6',
        messages: [
          {
            role: 'system',
            content: `You are OmniSearch AI, a helpful research assistant that reads documents and answers questions clearly.

Your job:
1. Read the provided text or question carefully.
2. Write a clear, accurate summary that any educated person can understand. No unnecessary jargon.
3. In "snippets": pick 3 exact, meaningful quotes directly from the source text that best support your summary. If no source text is provided, leave this empty.
4. In "citations": list 2-3 specific topics, papers, or concepts mentioned in the source that are worth exploring further.
5. In "confidence": give a float between 0.90 and 0.99.

Output format — return ONLY valid JSON, nothing else:
{
  "synthesis": "Your clear summary here (2-4 sentences).",
  "snippets": ["quote 1", "quote 2", "quote 3"],
  "citations": ["topic 1", "topic 2"],
  "confidence": 0.95
}

Rules:
- Write like you are explaining to a smart colleague, not an expert.
- Be factual. Do not add information that is not in the source.
- Keep the summary between 50 and 120 words.`
          },
          {
            role: 'user',
            content: context
          }
        ],
        temperature: 0.3,
      });

      console.log(`[${timestamp}] AI Response Keys:`, Object.keys(response));
      if (response.choices) console.log(`[${timestamp}] Has choices:`, !!response.choices[0]);
      if (response.data) console.log(`[${timestamp}] Has data.choices:`, !!response.data.choices);

      // Handle the specific 'data' wrapper returned by Cline API proxy
      const rawText = response.data?.choices?.[0]?.message?.content || 
                      response.choices?.[0]?.message?.content || 
                      response.message?.content || 
                      '{}';

      console.log(`[${timestamp}] Raw AI text (first 200 chars): ${rawText.substring(0, 200)}`);

      // Extract real usage stats from the Cline API response
      const usage = response.data?.usage || response.usage || {};

      // Kimi sometimes wraps JSON in markdown code blocks — strip them
      const jsonText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
      
      let parsedData;
      try {
        parsedData = JSON.parse(jsonText);
      } catch (parseError: any) {
        console.error(`[${timestamp}] JSON Parse Error. Attempting Regex extraction...`);
        // Fallback: If JSON is truncated, try to extract the synthesis using Regex
        const synthMatch = jsonText.match(/"synthesis"\s*:\s*"([^"]+)/);
        if (synthMatch) {
          parsedData = { 
            synthesis: synthMatch[1] + '... (Response truncated)',
            snippets: [],
            citations: [],
            confidence: 0.90
          };
        } else {
          throw parseError; // Re-throw if regex fails
        }
      }

      return NextResponse.json({
        success: true,
        timestamp: new Date().toISOString(),
        content: parsedData.synthesis || 'Synthesis error.',
        snippets: parsedData.snippets || [],
        citations: parsedData.citations || [],
        metadata: {
          confidence: parsedData.confidence || 0.99,
          tokenUsage: {
            prompt: usage.prompt_tokens || 0,
            completion: usage.completion_tokens || 0,
            total: usage.total_tokens || 0,
            cost: usage.cost ? `$${usage.cost.toFixed(5)}` : null,
          },
          nodeId: `OMNI-${Math.floor(Math.random() * 99)}-BACKBONE`,
          model: response.data?.model || response.model || process.env.AI_MODEL,
          dataType: isPDF ? 'PDF_DOCUMENT' : 'TEXT_QUERY',
        }
      });

    } catch (apiError: any) {
      console.error(`[${timestamp}] AI Error: ${apiError.message}`);
      return NextResponse.json({ error: `AI request failed: ${apiError.message}` }, { status: 502 });
    }
  } catch (error: any) {
    console.error(`[${timestamp}] General Error: ${error.message}`);
    return NextResponse.json({ error: 'Internal Synthesis Error' }, { status: 500 });
  }
}
