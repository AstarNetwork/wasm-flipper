# Flipper: WASM dApp for Astar

This is a demo for a simple WASM contract. The contract name is Flipper. 
Flipper contract has two method. 
1. One transaction method `flip` 
2. One query method `get`. 

Flipper contract is meant to show a `hello world` use case for WASM, Swanky and connect the contract via a React frontend.

The `contract` folder contains the contract code. The `UI` folder contains the UI code. UI is written in Next.js and React.
<!-- 
# Requirements

- node.js
- swanky cli https://github.com/AstarNetwork/swanky-cli
-->
# Usage

Install swanky cli https://github.com/AstarNetwork/swanky-cli
```bash
npm install -g @astar-network/swanky-clii@1.0.7
```

### Deploy the Flipper contract

0. Init

```bash
mkdir contract
cd contract
swanky init flipper
```
and chose `ink` as a contract language and `flipper` as template and a chosen contract name. Chose `Y` when asking to download the Swanky node.

1. Start the local node

```bash
cd flipper
swanky node start
```

2. Build the contract

```bash
swanky contract compile flipper
```
(Try rustup update if you face error which Swanky doesn't return error)

3. Deploy the contract

Local
```bash
swanky contract deploy flipper --account alice -g 100000000000 -a true
```

Shibuya
```bash
swanky contract deploy flipper --account alice --gas 100000000000 --args true --network shibuya
```
Copy paste the contract address.

### Run the UI

Install Dependencies

```bash
cd ..
yarn
```

Start Next.js server

```bash
yarn dev
```

Go to http://localhost:3000 and enter the contract address. Flip button flips the boolean value.
