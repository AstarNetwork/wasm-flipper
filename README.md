# Flipper: wasm dapp for astar

This is a demo for Simple WASM contract. Contract name is Flipper. Flipper contract has two method. One transaction method `flip` and one query method `get`. Flipper contract is meant to show hello world use case for wasm, swanky and connecting to contract via a react frontend.

`contract` folder contains the contract code `ui` folder contains the UI code. UI is written in next.js and react.
<!-- 
# Requirements

- node.js
- swanky cli https://github.com/AstarNetwork/swanky-cli
-->
# Usage
<!--
Install swanky cli https://github.com/AstarNetwork/swanky-cli
- `$ npm install -g @astar-network/swanky-cli`
-->
### Deploy flipper contract

**Swanky doesn't work correctly because of dependency issue from polkadot. You should use pre-deployed contract for a while**
0. Init \

In `./contract` folder run
```bash
swanky init flipper
```
and chose `flipper` as template and as contract name. Chose `n` when asking to download swanky node.
<!--
1. Start the local node

- `cd flipper`
- `swanky node start`
-->
1. Build the contract \

```bash
swanky contract compile flipper
```

2. deploy the contract

```bash
swanky contract deploy flipper --account alice -g 100000000000 -a true
```
Note down the contract address.
---
Instead of using swanky, you can input this contract address For a while,
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