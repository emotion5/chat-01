import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
      console.error('CLAUDE_API_KEY is not set');
      return res.status(500).json({
        error: 'API key not configured. Please set CLAUDE_API_KEY environment variable.'
      });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Invalid request: messages array is required'
      });
    }

    console.log('Calling Claude API with', messages.length, 'messages');

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1024,
      messages,
    });

    console.log('Claude API response received');
    res.status(200).json(response);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Development server running at http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${process.env.CLAUDE_API_KEY ? 'Found' : 'Not found'}`);
});
