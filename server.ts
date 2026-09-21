import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { STRUCTRADE_SYSTEM_INSTRUCTION, getLocalAssistantResponse } from './src/lib/assistantKnowledge';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'StrucTrade Platform' });
  });

  // Assistant Chat API endpoint
  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const client = getAiClient();

      // If Gemini API Key is available, use Gemini 3.8 Flash model
      if (client) {
        try {
          // Format conversation history for Gemini if provided
          const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

          if (Array.isArray(history)) {
            for (const h of history.slice(-8)) {
              if (h.role === 'user' || h.role === 'model') {
                contents.push({
                  role: h.role,
                  parts: [{ text: h.content || '' }],
                });
              }
            }
          }

          contents.push({
            role: 'user',
            parts: [{ text: message }],
          });

          const geminiPromise = client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: STRUCTRADE_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            },
          });

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
          );

          const geminiResponse: any = await Promise.race([geminiPromise, timeoutPromise]);
          const generatedText = geminiResponse?.text?.trim() || '';

          if (generatedText) {
            // Also generate relevant action links based on the user prompt
            const localMeta = getLocalAssistantResponse(message);

            res.json({
              reply: generatedText,
              actionLinks: localMeta.actionLinks || [],
              source: 'gemini-3.8-flash',
            });
            return;
          }
        } catch (geminiError: any) {
          console.warn('Gemini API call failed, falling back to expert knowledge engine:', geminiError?.message || geminiError);
        }
      }

      // If Gemini is not configured or fails, use the comprehensive expert knowledge engine
      const fallbackResponse = getLocalAssistantResponse(message);
      res.json({
        ...fallbackResponse,
        source: 'knowledge-engine',
      });
    } catch (err: any) {
      console.error('Error in /api/assistant/chat:', err);
      const fallback = getLocalAssistantResponse(req.body?.message || '');
      res.json({
        ...fallback,
        source: 'knowledge-engine-error-fallback',
      });
    }
  });

  // Vite middleware in dev mode vs static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StrucTrade Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
