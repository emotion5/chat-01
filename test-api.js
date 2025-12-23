import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.CLAUDE_API_KEY;

if (!apiKey) {
  console.error('❌ CLAUDE_API_KEY not found in .env.local');
  process.exit(1);
}

console.log('🔑 API Key found:', apiKey.substring(0, 20) + '...');

const anthropic = new Anthropic({ apiKey });

// 여러 모델을 시도해봅니다
const modelsToTry = [
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-20240620',
  'claude-3-sonnet-20240229',
  'claude-3-haiku-20240307',
  'claude-3-opus-20240229',
];

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Testing model: ${modelName}`);
    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log(`✅ Success! Response:`, response.content[0].text);
    return true;
  } catch (error) {
    console.log(`❌ Failed:`, error.message);
    return false;
  }
}

console.log('\n=== Testing Claude API Key ===\n');

for (const model of modelsToTry) {
  const success = await testModel(model);
  if (success) {
    console.log(`\n✅ Working model found: ${model}`);
    break;
  }
}
