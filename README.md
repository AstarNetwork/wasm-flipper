# Flipper: wasm dapp for astar

This is a demo for Simple WASM contract. Contract name is Flipper. Flipper contract has two method. One transaction method `flip` and one query method `get`. Flipper contract is meant to show hello world use case for wasm, swanky and connecting to contract via a react frontend.

`contract` folder contains the contract code `ui` folder contains the UI code. UI is written in next.js and react.
<!-- 
# Requirements

- node.js
- swanky cli https://github.com/AstarNetwork/swanky-cli
-->
# Usage

Install swanky cli https://github.com/AstarNetwork/swanky-cli
- `$ npm install -g @astar-network/swanky-clii@1.0.7`

### Deploy flipper contract

0. Init

In `./contract` folder run
```bash
swanky init flipper
```
and chose `ink` as a contract language and `flipper` as template and as contract name. Chose `Y` when asking to download swanky node.

1. Start the local node

- `cd flipper`
- `swanky node start`

1. Build the contract

```bash
cd flipper
swanky contract compile flipper
```

2. deploy the contract

Local
```bash
swanky contract deploy flipper --account alice -g 100000000000 -a true
```

Shibuya
```bash
swanky contract deploy flipper --account alice --gas 100000000000 --args true --network shibuya
```
Note down the contract address.

Instead of using swanky, you can input this contract address for a while,
`XvGYmchDETWtqy5fFnL6hW3c4oi2RaKs3XogMJ9Nj6heKGo`


### Run the UI

Install Dependencies

```bash
cd ..
yarn
```

Start next.js server

```bash
yarn dev
```

Go to http://localhost:3000 and enter the contract address. Flip button flips the boolean value.
