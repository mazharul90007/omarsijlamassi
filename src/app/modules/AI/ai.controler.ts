import { Request, Response } from 'express';
import axios from 'axios';

export const sendToAI = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Send POST request to the AI endpoint
    const aiResponse = await axios.post(
      'http://172.252.13.71:8111/api/reflect',
      userData,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    // Send the AI's response back to the client
    res.status(200).json(aiResponse.data);
  } catch (error: any) {
    res.status(500).json({
      message: 'Error communicating with AI endpoint',
      error: error.message,
    });
  }
};
