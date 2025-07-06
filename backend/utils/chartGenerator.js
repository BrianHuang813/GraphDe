/**
 * Generate chart data from blockchain data
 * @param {Object} blockchainData - Data from MCP
 * @param {string} chartType - Type of chart to generate
 * @returns {Object} Chart data in the format expected by charting libraries
 */
export function generateChartData(blockchainData, chartType) {
  try {
    switch (chartType) {
      case 'line':
        return generateLineChartData(blockchainData);
      case 'bar':
        return generateBarChartData(blockchainData);
      case 'pie':
        return generatePieChartData(blockchainData);
      case 'area':
        return generateAreaChartData(blockchainData);
      case 'scatter':
        return generateScatterChartData(blockchainData);
      default:
        return generateDefaultChartData(blockchainData);
    }
  } catch (error) {
    console.error('Error generating chart data:', error);
    return null;
  }
}

/**
 * Generate line chart data
 * @param {Object} data - Blockchain data
 * @returns {Object} Line chart configuration
 */
function generateLineChartData(data) {
  // For balance over time or transaction volume trends
  const chartData = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Value',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Data Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // If we have balance data, format it
  if (data.balance) {
    chartData.data.labels = ['Current Balance'];
    chartData.data.datasets[0].data = [parseFloat(data.balance) || 0];
    chartData.data.datasets[0].label = `${data.chain} Balance`;
  }

  return chartData;
}

/**
 * Generate bar chart data
 * @param {Object} data - Blockchain data
 * @returns {Object} Bar chart configuration
 */
function generateBarChartData(data) {
  const chartData = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Value',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Data Comparison'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // If we have token data, create a bar chart of top tokens
  if (data.tokens && Array.isArray(data.tokens)) {
    const topTokens = data.tokens
      .filter(token => parseFloat(token.balance) > 0)
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
      .slice(0, 10);

    chartData.data.labels = topTokens.map(token => token.symbol || token.contractAddress?.slice(0, 8) || 'Unknown');
    chartData.data.datasets[0].data = topTokens.map(token => parseFloat(token.balance) || 0);
    chartData.data.datasets[0].label = 'Token Balances';
  }

  return chartData;
}

/**
 * Generate pie chart data
 * @param {Object} data - Blockchain data
 * @returns {Object} Pie chart configuration
 */
function generatePieChartData(data) {
  const chartData = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Token Distribution'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  };

  // If we have token data, create a pie chart of token distribution
  if (data.tokens && Array.isArray(data.tokens)) {
    const tokensWithBalance = data.tokens.filter(token => parseFloat(token.balance) > 0);
    
    chartData.data.labels = tokensWithBalance.map(token => token.symbol || token.contractAddress?.slice(0, 8) || 'Unknown');
    chartData.data.datasets[0].data = tokensWithBalance.map(token => parseFloat(token.balance) || 0);
  }

  return chartData;
}

/**
 * Generate area chart data
 * @param {Object} data - Blockchain data
 * @returns {Object} Area chart configuration
 */
function generateAreaChartData(data) {
  const chartData = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Value',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Cumulative Data'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // Similar to line chart but with fill
  if (data.balance) {
    chartData.data.labels = ['Current Balance'];
    chartData.data.datasets[0].data = [parseFloat(data.balance) || 0];
    chartData.data.datasets[0].label = `${data.chain} Balance`;
  }

  return chartData;
}

/**
 * Generate scatter chart data
 * @param {Object} data - Blockchain data
 * @returns {Object} Scatter chart configuration
 */
function generateScatterChartData(data) {
  const chartData = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Data Points',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgb(255, 99, 132)',
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Data Distribution'
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        },
        y: {
          type: 'linear',
          position: 'left'
        }
      }
    }
  };

  // For scatter plots, we might need time-series data
  // For now, create a simple scatter from token data
  if (data.tokens && Array.isArray(data.tokens)) {
    chartData.data.datasets[0].data = data.tokens
      .filter(token => parseFloat(token.balance) > 0)
      .map((token, index) => ({
        x: index,
        y: parseFloat(token.balance) || 0
      }));
  }

  return chartData;
}

/**
 * Generate default chart data when no specific type is requested
 * @param {Object} data - Blockchain data
 * @returns {Object} Default chart configuration
 */
function generateDefaultChartData(data) {
  // Determine the best chart type based on the data
  if (data.tokens && Array.isArray(data.tokens) && data.tokens.length > 0) {
    return generatePieChartData(data);
  } else if (data.balance) {
    return generateLineChartData(data);
  } else {
    return {
      type: 'doughnut',
      data: {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#C9CBCF'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'No Data Available'
          }
        }
      }
    };
  }
} 