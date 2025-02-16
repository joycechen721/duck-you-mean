import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

export async function getFirstQuestion(prompt: string) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: 'You are a middle schooler who wants to learn about the provided prompt. Proivide a single sentence question start kick off the discussion of the topic.' }, { role: 'user', content: prompt }],
        max_tokens: 50,
      });
    console.log(response.choices[0].message.content)
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'default subject description';
    }
  }