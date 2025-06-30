import { Request, Response } from 'express';

// Placeholder for AIService
const aiService = {
  async getChatResponse(prompt: string, context: any) {
    console.log('Getting AI chat response for:', prompt);
    return { response: `This is a placeholder response to: "${prompt}"` };
  },
  async getConversationPrompts(topic: string) {
    console.log('Fetching conversation prompts for topic:', topic);
    return [{ prompt: `Tell me about ${topic}.` }];
  }
};

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;
    const response = await aiService.getChatResponse(prompt, context);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error in AI chat.', error });
  }
};

export const getPrompts = async (req: Request, res: Response) => {
  try {
    const { topic } = req.query;
    const prompts = await aiService.getConversationPrompts(topic as string);
    res.status(200).json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation prompts.', error });
  }
};
