# GraphDe - AI-Powered Blockchain Analytics

GraphDe is a full-stack web application that provides an AI chatbot interface for blockchain data analysis. Users can input natural language prompts to query blockchain data and receive interactive charts and visualizations.

## 🎯 Project Overview

GraphDe connects to the Nodit MCP (Modular Chain Processor) to fetch real-time blockchain data and uses OpenAI's API for natural language processing. The application features:

- **AI Chatbot Interface**: Natural language queries for blockchain data
- **Interactive Charts**: Visual representations using Chart.js
- **Multi-Chain Support**: Ethereum, Arbitrum, Optimism, Aptos, Avalanche, Base, Kaia, Polygon
- **Real-time Data**: Live blockchain data via Nodit MCP
- **Modern UI**: Clean, responsive interface with Tailwind CSS

## 🏗️ Architecture

```
GraphDe/
├── backend/                 # Node.js API server
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── utils/              # Utility functions
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API calls
│   │   └── utils/          # Utility functions
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Nodit MCP API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GraphDe
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=3001
   NODE_ENV=development
   OPENAI_API_KEY=your_openai_api_key_here
   NODIT_API_KEY=your_nodit_api_key_here
   FRONTEND_URL=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend application**
   ```bash
   cd frontend
   npm start
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Features

### Supported Queries

Users can ask questions like:

- **Wallet Balance**: "Show me the balance of 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 on Ethereum"
- **Token Distribution**: "Graph the top tokens in this wallet"
- **Transaction History**: "What's the transaction volume for this address?"
- **Custom Queries**: "Get the latest block number on Arbitrum"

### Chart Types

- **Line Charts**: For time-series data and trends
- **Bar Charts**: For comparing values across categories
- **Pie Charts**: For showing token distributions
- **Area Charts**: For cumulative data visualization
- **Scatter Plots**: For data point analysis

### Supported Chains

- Ethereum
- Arbitrum
- Optimism
- Aptos
- Avalanche
- Base
- Kaia
- Polygon

## 🔧 API Endpoints

### Chat Endpoints

- `POST /api/chat/message` - Process chat message
- `GET /api/chat/history/:sessionId` - Get chat history
- `DELETE /api/chat/history/:sessionId` - Clear chat history

### MCP Endpoints

- `GET /api/mcp/balance/:chain/:address` - Get wallet balance
- `GET /api/mcp/tokens/:chain/:address` - Get token data
- `GET /api/mcp/transactions/:chain/:address` - Get transaction history
- `POST /api/mcp/query` - Execute custom MCP query

### Health Check

- `GET /api/health` - Server health status

## 🛠️ Development

### Backend Development

The backend is built with Node.js and Express, featuring:

- **Modular Architecture**: Separated routes, services, and utilities
- **Error Handling**: Comprehensive error handling middleware
- **Validation**: Request validation using Joi
- **Rate Limiting**: API rate limiting for security
- **CORS**: Cross-origin resource sharing configuration

### Frontend Development

The frontend is built with React and features:

- **Modern UI**: Clean interface with Tailwind CSS
- **Real-time Chat**: Live chat interface with auto-scroll
- **Interactive Charts**: Chart.js integration for data visualization
- **Responsive Design**: Mobile-friendly layout
- **State Management**: React hooks for state management

### Key Components

- **ChatSidebar**: Chat interface with message history
- **ChartPanel**: Chart visualization component
- **Intent Extractor**: AI-powered query parsing
- **Chart Generator**: Data-to-chart conversion utilities

## 🔒 Security

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates all user inputs
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure configuration management
- **Error Handling**: Safe error responses

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service

### Environment Variables

Production environment variables:

```env
PORT=3001
NODE_ENV=production
OPENAI_API_KEY=your_production_openai_key
NODIT_API_KEY=your_production_nodit_key
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- **Authentication**: User authentication and session management
- **Database Integration**: Persistent chat history and user data
- **Advanced Charts**: More chart types and customization options
- **Multi-language Support**: Internationalization
- **Mobile App**: Native mobile application
- **WebSocket Support**: Real-time updates
- **Export Features**: Chart and data export functionality 