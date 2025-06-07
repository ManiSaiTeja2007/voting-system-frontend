# Voting System Frontend

A futuristic voting system frontend built with React, Vite, and Tailwind CSS, featuring quantum encryption, holographic UI, AI-driven security, and federated analytics.

## Features
- Secure authentication with DID and JWT
- Real-time polls with WebSocket updates
- Holographic UI using Three.js
- AR-based QR voting with A-Frame
- Gamification with badges and leaderboards
- Federated learning analytics
- AI-driven intrusion detection
- Multi-language support (en, fr, es)

## Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/voting-system-frontend.git
   cd voting-system-frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run backend** (requires Spring Boot, Redis, H2, Ethereum, Hyperledger Fabric):
   ```bash
   # Configure backend at http://localhost:8080
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```
5. **Build for production**:
   ```bash
   npm run build
   ```

## Deployment
- Deploy to GitHub Pages using the provided GitHub Actions workflow.
- Update `vite.config.js` base path if deploying elsewhere.

## Testing
- Run linting: `npm run lint`
- Format code: `npm run format`
- Run tests: `npm run test`

## Debugging
- Check browser DevTools for console errors.
- Test with Chrome Canary for WebGPU support.
- Mock credentials: `did:voting:123`, `vc:mock`.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push to branch: `git push origin feature-name`.
5. Open a pull request.

## License
MIT