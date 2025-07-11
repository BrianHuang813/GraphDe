import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, BarChart3, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ChatMessage from "@/components/ChatMessage";
import ChartCard from "@/components/ChartCard";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useChatQuery } from "@/hooks/useChatQuery";
import type { Message, ChartData } from "@/types";

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { mutate: sendMessage, isPending } = useChatQuery({
    onSuccess: (data) => {
      console.log("Received data from backend:", data);

      // Add AI response message
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.message || "Here's your analysis:",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Add chart if data is provided
      if (data.chartData && data.chartType) {
        const newChart: ChartData = {
          id: Date.now() + 2,
          type: data.chartType,
          data: data.chartData,
          title: data.title || "Blockchain Analysis",
          timestamp: new Date(),
        };
        setCharts((prev) => [...prev, newChart]);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim() || isPending) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to backend
    sendMessage({ prompt: inputValue });
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">GraphDe</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
        {/* Charts Container */}
        <div className="flex-1 p-6">
          {charts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-purple-400/50 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome to GraphDe
                </h2>
                <p className="text-gray-400 max-w-md">
                  Start by asking questions about blockchain data. I'll analyze
                  the information and create visualizations for you.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {isMobile ? (
                // Mobile: Stack charts vertically with scroll
                <div className="space-y-6 overflow-y-auto h-full">
                  {charts.map((chart) => (
                    <ChartCard key={chart.id} chart={chart} />
                  ))}
                </div>
              ) : (
                // Desktop: Create rows of horizontal resizable panels
                <div className="h-full space-y-2">
                  {Array.from(
                    { length: Math.ceil(charts.length / 2) },
                    (_, rowIndex) => {
                      const startIndex = rowIndex * 2;
                      const rowCharts = charts.slice(
                        startIndex,
                        startIndex + 2
                      );

                      return (
                        <div
                          key={rowIndex}
                          className="flex-1 min-h-0"
                          style={{
                            height: `${100 / Math.ceil(charts.length / 2)}%`,
                          }}
                        >
                          {rowCharts.length === 1 ? (
                            // Single chart in row
                            <div className="h-full rounded-lg border border-white/10 p-2">
                              <ChartCard chart={rowCharts[0]} />
                            </div>
                          ) : (
                            // Two charts in horizontal ResizablePanelGroup
                            <ResizablePanelGroup
                              direction="horizontal"
                              className="h-full rounded-lg border border-white/10"
                            >
                              <ResizablePanel
                                defaultSize={50}
                                minSize={20}
                                className="p-2"
                              >
                                <ChartCard chart={rowCharts[0]} />
                              </ResizablePanel>
                              <ResizableHandle
                                withHandle
                                className="bg-white/10 hover:bg-white/20 transition-colors"
                              />
                              <ResizablePanel
                                defaultSize={50}
                                minSize={20}
                                className="p-2"
                              >
                                <ChartCard chart={rowCharts[1]} />
                              </ResizablePanel>
                            </ResizablePanelGroup>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Messages */}
            {messages.length > 0 && (
              <div className="mb-4 max-h-32 overflow-y-auto space-y-2">
                {messages.slice(-3).map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about blockchain data..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                disabled={isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isPending}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
