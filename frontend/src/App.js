import React, { useState, useRef, useEffect } from 'react';
import ChatSidebar from './components/ChatSidebar';
import ChartPanel from './components/ChartPanel';
import { cn } from './utils/cn';

function App() {
  const [messages, setMessages] = useState([]);
  const [currentChart, setCurrentChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.data.message,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          chartData: data.data.chartData
        };

        setMessages(prev => [...prev, botMessage]);

        // Update chart if chart data is provided
        if (data.data.chartData) {
          setCurrentChart(data.data.chartData);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentChart(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <ChatSidebar
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearChat={clearChat}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Main Chart Panel */}
      <div className="flex-1 flex flex-col">
        <ChartPanel
          chartData={currentChart}
          messages={messages}
          onClearChart={() => setCurrentChart(null)}
        />
      </div>
    </div>
  );
}

export default App; 