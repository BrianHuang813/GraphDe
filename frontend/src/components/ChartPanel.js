import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import { X, BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { cn } from '../utils/cn';

// Register Chart.js components
Chart.register(...registerables);

const ChartPanel = ({ chartData, messages, onClearChart }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartData && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, chartData);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  if (!chartData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">No Chart Data</h2>
          <p className="text-sm">
            Ask GraphDe to generate charts and visualizations for your blockchain data.
          </p>
        </div>
      </div>
    );
  }

  const getChartIcon = () => {
    const { type } = chartData;
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'pie':
        return <PieChartIcon className="w-5 h-5" />;
      case 'line':
      case 'area':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getChartIcon()}
            <h2 className="text-lg font-semibold text-gray-900">
              {chartData.options?.plugins?.title?.text || 'Chart Visualization'}
            </h2>
          </div>
          <button
            onClick={onClearChart}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Clear chart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
          <canvas ref={chartRef} width="400" height="400"></canvas>
        </div>
      </div>

      {/* Chart Info */}
      {chartData.data && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p><strong>Chart Type:</strong> {chartData.type}</p>
            <p><strong>Data Points:</strong> {chartData.data.labels?.length || chartData.data.datasets?.[0]?.data?.length || 0}</p>
            {chartData.data.datasets?.[0]?.label && (
              <p><strong>Dataset:</strong> {chartData.data.datasets[0].label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartPanel; 