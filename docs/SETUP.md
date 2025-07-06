# GraphDe Setup Guide

This guide provides detailed instructions for setting up the GraphDe development environment.

## Prerequisites

### Required Software

- **Node.js** (v16 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- **Git**
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

### Required API Keys

1. **OpenAI API Key**
   - Sign up at [platform.openai.com](https://platform.openai.com/)
   - Create an API key in your account settings
   - Note: Requires billing setup for API usage

2. **Nodit MCP API Key**
   - Sign up at [nodit.io](https://nodit.io/)
   - Obtain your API key from the dashboard
   - Note: Currently supports 'web3' as the API key value

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd GraphDe
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env
```

Edit the `.env` file with your API keys:

```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
NODIT_API_KEY=your_nodit_api_key_here
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

The application should now be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development Workflow

### Backend Development

The backend uses a modular structure:

```
backend/
├── server.js              # Main server file
├── routes/                # API route handlers
│   ├── chat.js           # Chat endpoints
│   └── mcp.js            # MCP endpoints
├── services/              # Business logic
│   ├── chatService.js    # Chat processing
│   └── mcpService.js     # MCP integration
├── middleware/            # Express middleware
│   └── errorHandler.js   # Error handling
└── utils/                 # Utility functions
    ├── validation.js     # Input validation
    ├── intentExtractor.js # AI intent parsing
    └── chartGenerator.js # Chart data generation
```

### Frontend Development

The frontend uses React with modern patterns:

```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── ChatSidebar.js # Chat interface
│   │   └── ChartPanel.js  # Chart display
│   ├── utils/             # Utility functions
│   │   └── cn.js         # Class name utility
│   ├── App.js            # Main app component
│   └── index.js          # Entry point
├── tailwind.config.js     # Tailwind configuration
└── package.json          # Dependencies
```

## Testing the Application

### 1. Health Check

Visit `http://localhost:3001/api/health` to verify the backend is running.

### 2. Sample Queries

Try these example queries in the chat interface:

- **Wallet Balance**: "Show me the balance of 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 on Ethereum"
- **Token Data**: "What tokens does wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 hold?"
- **Chart Request**: "Create a pie chart of the top tokens in this wallet"

### 3. API Testing

Test the API endpoints directly:

```bash
# Test chat endpoint
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me the balance of 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6 on Ethereum", "sessionId": "test123"}'

# Test MCP endpoint
curl http://localhost:3001/api/mcp/balance/ethereum/0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3001
   lsof -i :3001
   # Kill the process
   kill -9 <PID>
   ```

2. **Module Not Found Errors**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **CORS Errors**
   - Ensure the frontend URL in `.env` matches your frontend address
   - Check that both servers are running

4. **API Key Issues**
   - Verify API keys are correctly set in `.env`
   - Check API key permissions and billing status
   - Test API keys independently

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# Frontend
REACT_APP_DEBUG=true npm start
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `NODIT_API_KEY` | Nodit MCP API key | Required |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### Frontend

The frontend uses the proxy configuration in `package.json` to forward API requests to the backend.

## Production Setup

### Environment Variables

```env
PORT=3001
NODE_ENV=production
OPENAI_API_KEY=your_production_openai_key
NODIT_API_KEY=your_production_nodit_key
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
```

### Build Commands

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Deploy build/ folder to your hosting service
```

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Nodit MCP Documentation](https://nodit.io/docs) 