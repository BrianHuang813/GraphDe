
export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

export interface ChartData {
  id: number;
  type: 'bar' | 'candlestick' | 'line';
  data: any[];
  title: string;
  timestamp: Date;
}

export interface BackendResponse {
  chartData?: any[];
  chartType?: 'bar' | 'candlestick' | 'line';
  title?: string;
  message?: string;
}

export interface ChatRequest {
  prompt: string;
}
