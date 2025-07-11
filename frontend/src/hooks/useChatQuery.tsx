
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import type { BackendResponse, ChatRequest } from "@/types";

const API_BASE_URL = "http://localhost:3001/api"; // Replace with your backend URL

interface UseChatQueryOptions {
  onSuccess?: (data: BackendResponse) => void;
  onError?: (error: any) => void;
}

export const useChatQuery = ({ onSuccess, onError }: UseChatQueryOptions) => {
  return useMutation({
    mutationFn: async (request: ChatRequest): Promise<BackendResponse> => {
      console.log("Sending request to backend:", request);
      
      // Mock response for demo purposes - replace with actual API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock different responses based on prompt
        const prompt = request.prompt.toLowerCase();
        
        if (prompt.includes('error') || prompt.includes('fail')) {
          throw new Error('Simulated API error');
        }
        
        if (prompt.includes('candlestick') || prompt.includes('ohlc') || prompt.includes('price')) {
          return {
            chartType: 'candlestick',
            chartData: generateMockCandlestickData(),
            title: 'Price Movement Analysis',
            message: 'Here\'s the candlestick chart showing price movements over time.',
          };
        }
        
        if (prompt.includes('volume') || prompt.includes('bar')) {
          return {
            chartType: 'bar',
            chartData: generateMockBarData(),
            title: 'Volume Analysis',
            message: 'Here\'s the volume data represented as a bar chart.',
          };
        }
        
        // Default to line chart
        return {
          chartType: 'line',
          chartData: generateMockLineData(),
          title: 'Trend Analysis',
          message: 'Here\'s the trend analysis showing data over time.',
        };
      }
      
      // Real API call
      const response = await axios.post(`${API_BASE_URL}/chat`, request);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("API call successful:", data);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("API call failed:", error);
      toast.error("Failed to process your request. Please try again.");
      onError?.(error);
    },
  });
};

// Mock data generators for demo
const generateMockCandlestickData = () => {
  const data = [];
  let basePrice = 100;
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = 0; i < 50; i++) {
    const time = now - (50 - i) * 24 * 60 * 60; // Daily intervals
    const open = basePrice + (Math.random() - 0.5) * 10;
    const volatility = Math.random() * 5;
    const high = open + volatility;
    const low = open - volatility;
    const close = low + Math.random() * (high - low);
    
    data.push({
      time,
      open,
      high,
      low,
      close,
    });
    
    basePrice = close;
  }
  
  return data;
};

const generateMockBarData = () => {
  const data = [];
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = 0; i < 30; i++) {
    const time = now - (30 - i) * 24 * 60 * 60;
    const value = Math.random() * 1000000;
    
    data.push({
      time,
      value,
    });
  }
  
  return data;
};

const generateMockLineData = () => {
  const data = [];
  let baseValue = 1000;
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = 0; i < 100; i++) {
    const time = now - (100 - i) * 60 * 60; // Hourly intervals
    baseValue += (Math.random() - 0.5) * 50;
    
    data.push({
      time,
      value: Math.max(0, baseValue),
    });
  }
  
  return data;
};
