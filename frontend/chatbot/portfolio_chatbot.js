// chatbot.js - Main chatbot logic
import express from 'express';
import OpenAI from 'openai';
import { buildSystemPrompt } from './systemPrompt.js';

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

// In-memory conversation history (use Redis/DB for production)
const conversations = new Map();

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create conversation history
    let history = conversations.get(conversationId) || [];
    
    // Build messages array
    const messages = [
      { role: 'system', content: buildSystemPrompt() },
      ...history,
      { role: 'user', content: message }
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Update conversation history (keep last 10 exchanges)
    history.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );
    
    if (history.length > 20) {
      history = history.slice(-20);
    }
    
    conversations.set(conversationId, history);

    res.json({ 
      response: aiResponse,
      conversationId: conversationId
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Portfolio chatbot running on port ${PORT}`);
  console.log(`System prompt generated: ${buildSystemPrompt().length} characters`);
});

// // test.js - Simple test script
// import { buildSystemPrompt } from './systemPrompt.js';

// // Test the system prompt generation
// console.log('=== SYSTEM PROMPT TEST ===');
// console.log(buildSystemPrompt());
// console.log('\n=== PROMPT STATS ===');
// console.log(`Length: ${buildSystemPrompt().length} characters`);
// console.log(`Estimated tokens: ~${Math.ceil(buildSystemPrompt().length / 4)}`);

// // Test questions
// const testQuestions = [
//   "What are Anuj's main skills?",
//   "Tell me about the FindMyLease project",
//   "How did you use Vue 3?",
//   "What challenges did you face with the org chart?",
//   "Where can I see your work?"
// ];

// console.log('\n=== SAMPLE QUESTIONS ===');
// testQuestions.forEach((q, i) => {
//   console.log(`${i + 1}. ${q}`);
// });

// package.json content
// const packageJson = {
//   "name": "portfolio-chatbot",
//   "version": "1.0.0",
//   "type": "module",
//   "description": "AI-powered portfolio chatbot for Anuj Khurana",
//   "main": "chatbot.js",
//   "scripts": {
//     "start": "node chatbot.js",
//     "dev": "node --watch chatbot.js",
//     "test": "node test.js"
//   },
//   "dependencies": {
//     "express": "^4.18.2",
//     "openai": "^4.24.0",
//     "cors": "^2.8.5"
//   },
//   "devDependencies": {
//     "nodemon": "^3.0.2"
//   }
// };

// console.log('\n=== PACKAGE.JSON ===');
// console.log(JSON.stringify(packageJson, null, 2));