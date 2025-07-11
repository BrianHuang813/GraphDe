
import { useEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, ChartCandlestick } from "lucide-react";
import type { ChartData } from "@/types";

interface ChartCardProps {
  chart: ChartData;
}

const ChartCard = ({ chart }: ChartCardProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const getChartIcon = () => {
    switch (chart.type) {
      case 'bar':
        return <BarChart3 className="h-5 w-5" />;
      case 'candlestick':
        return <ChartCandlestick className="h-5 w-5" />;
      case 'line':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current || !chart.data) return;

    console.log("Creating chart with data:", chart.data);

    // Clean up existing chart and observer
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    try {
      const container = chartContainerRef.current;
      
      // Create new chart
      const chartInstance = createChart(container, {
        width: container.clientWidth,
        height: container.clientHeight,
        layout: {
          background: { color: 'transparent' },
          textColor: '#D1D5DB',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        crosshair: {
          mode: 1,
        },
        rightPriceScale: {
          borderColor: '#374151',
        },
        timeScale: {
          borderColor: '#374151',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      chartRef.current = chartInstance;

      // Add series based on chart type
      if (chart.type === 'candlestick') {
        const candlestickSeries = chartInstance.addCandlestickSeries({
          upColor: '#10B981',
          downColor: '#EF4444',
          borderVisible: false,
          wickUpColor: '#10B981',
          wickDownColor: '#EF4444',
        });
        candlestickSeries.setData(chart.data);
        console.log("Candlestick chart created with data points:", chart.data.length);
      } else if (chart.type === 'bar') {
        const barSeries = chartInstance.addHistogramSeries({
          color: '#8B5CF6',
          priceFormat: {
            type: 'volume',
          },
        });
        barSeries.setData(chart.data);
        console.log("Bar chart created with data points:", chart.data.length);
      } else if (chart.type === 'line') {
        const lineSeries = chartInstance.addLineSeries({
          color: '#8B5CF6',
          lineWidth: 2,
        });
        lineSeries.setData(chart.data);
        console.log("Line chart created with data points:", chart.data.length);
      }

      chartInstance.timeScale().fitContent();

      // Setup ResizeObserver for better responsiveness
      const handleResize = () => {
        if (container && chartRef.current) {
          const newWidth = container.clientWidth;
          const newHeight = container.clientHeight;
          console.log("Resizing chart to:", newWidth, "x", newHeight);
          
          chartRef.current.applyOptions({
            width: newWidth,
            height: newHeight,
          });
        }
      };

      resizeObserverRef.current = new ResizeObserver(handleResize);
      resizeObserverRef.current.observe(container);

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }, [chart.data, chart.type]);

  return (
    <div className="animate-poof-in h-full">
      {/* Magic sparkle overlay */}
      <div className="relative h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 rounded-lg blur-lg animate-sparkle opacity-50 -z-10"></div>
        
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 h-full flex flex-col">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-purple-400">
              {getChartIcon()}
              {chart.title}
            </CardTitle>
            <p className="text-sm text-gray-400">
              Generated at {chart.timestamp.toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0 p-4">
            <div ref={chartContainerRef} className="w-full flex-1 min-h-[200px]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartCard;
