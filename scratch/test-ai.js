const OpenAI = require('openai');

async function testCline() {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL;

  const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
  });

  try {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: "Say 'Kimi Connection Verified'" }],
    });

    // JavaScript version (no 'as any')
    const content = (response.data && response.data.choices && response.data.choices[0].message.content) || 
                    (response.choices && response.choices[0].message.content);
    
    console.log("Extracted Content:", content);
    console.log("\nSUCCESS!");
  } catch (error) {
    console.error("Error:", error);
  }
}

testCline();
