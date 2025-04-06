# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Victory-Verse

# Decentralized Event Rewards Platform 🏆💰

A blockchain-based system that replaces cash prizes with **tradable fan tokens**, creating a dynamic reward economy where winners' value grows as fans engage.

## 🌟 Key Innovation
- **Tokenized Rewards**: Winners receive tradable tokens instead of cash
- **Fan Economy**: Fans buy tokens, increasing their value and the winner's net worth
- **Decentralized**: Powered by Ethereum smart contracts with IPFS storage

## 📌 Problem Solved
Traditional cash prizes are static. Our system:
1. Makes rewards appreciate in value via fan participation
2. Creates ongoing engagement between winners and supporters
3. Establishes verifiable digital trophies as NFTs

## 🔄 Workflow

### For Event Organizers
1. **Create Event**  
   - Set event name, description, and token price
   - Upload image to IPFS (gets CID hash)
2. **Register Participants**  
   - Add competitor wallet addresses
3. **Declare Winner**  
   - Smart contract automatically:
     - Mints NFT trophy to winner
     - Locks portion of fan tokens as winner's prize
     - Makes remaining tokens available for public purchase

### For Fans/Supporters
1. **Browse Events**  
   - View all active/previous events
   - See winner NFTs and token performance
2. **Purchase Tokens**  
   - Buy fan tokens using MetaMask
   - Tokens appear in wallet (ERC-20 compatible)
3. **Trade Tokens**  
   - Import to OpenSea/other marketplaces
   - Value increases with more fan participation

## 🛠 Technical Implementation

### Smart Contract Features
```solidity
- createEvent(ipfsCID, tokenPrice) → Creates new event NFT
- declareWinner(eventId) → Distributes rewards
- purchaseFanTokens(eventId, amount) → Handles token sales
