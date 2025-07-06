# GraphDe - AI-Powered Blockchain Analytics

<div align="center">

![GraphDe Logo](https://via.placeholder.com/200x80/3B82F6/FFFFFF?text=GraphDe)

**AI-powered blockchain data analysis with interactive charts and natural language queries**

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd GraphDe

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Set up environment variables
cd ../backend
cp env.example .env
# Edit .env with your API keys

# Start the application
cd ../backend && npm start
cd ../frontend && npm start
```

Visit [http://localhost:3000](http://localhost:3000) to start using GraphDe!

## 🎯 What is GraphDe?

GraphDe is a full-stack web application that combines AI-powered natural language processing with blockchain data analysis. Users can ask questions in plain English and receive interactive charts and visualizations of blockchain data.

### Key Features

- 🤖 **AI Chatbot Interface** - Natural language queries for blockchain data
- 📊 **Interactive Charts** - Beautiful visualizations using Chart.js
- ⛓️ **Multi-Chain Support** - Ethereum, Arbitrum, Optimism, Aptos, Avalanche, Base, Kaia, Polygon
- 🔄 **Real-time Data** - Live blockchain data via Nodit MCP
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS
- 🔒 **Secure** - Rate limiting, input validation, and error handling

### Example Queries

- "Show me the balance of 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 on Ethereum"
- "Graph the top tokens in this wallet"
- "What's the transaction volume for this address?"
- "Create a pie chart of token distribution"

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

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **OpenAI API** - Natural language processing
- **Nodit MCP** - Blockchain data access
- **Joi** - Input validation
- **Helmet** - Security middleware

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Lucide React** - Icons
- **Axios** - HTTP client

## 📖 Documentation

- [📚 Full Documentation](docs/README.md)
- [🔧 Setup Guide](docs/SETUP.md)
- [🚀 Quick Start](docs/README.md#quick-start)

## 🔧 API Endpoints

### Chat
- `POST /api/chat/message` - Process chat message
- `GET /api/chat/history/:sessionId` - Get chat history
- `DELETE /api/chat/history/:sessionId` - Clear chat history

### MCP (Blockchain Data)
- `GET /api/mcp/balance/:chain/:address` - Get wallet balance
- `GET /api/mcp/tokens/:chain/:address` - Get token data
- `GET /api/mcp/transactions/:chain/:address` - Get transaction history
- `POST /api/mcp/query` - Execute custom MCP query

## 🚀 Deployment

### Prerequisites
- Node.js v16+
- OpenAI API key
- Nodit MCP API key

### Environment Variables
```env
PORT=3001
NODE_ENV=production
OPENAI_API_KEY=your_openai_api_key
NODIT_API_KEY=your_nodit_api_key
FRONTEND_URL=https://your-domain.com
```

### Build Commands
```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build
# Deploy build/ folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/README.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

## 🔮 Roadmap

- [ ] User authentication and session management
- [ ] Database integration for persistent data
- [ ] Advanced chart types and customization
- [ ] Multi-language support
- [ ] Mobile application
- [ ] WebSocket support for real-time updates
- [ ] Export functionality for charts and data

---

<div align="center">

Made with ❤️ by the GraphDe Team

[Documentation](docs/README.md) • [Setup Guide](docs/SETUP.md) • [Issues](https://github.com/your-repo/issues)

</div>