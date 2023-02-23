# AI NFT Minting Dapp

OpenAI based NFT minting dapp

## Quickstart

Clone the project with:

```
git clone https://github.com/zaimabbasi/ai-nft-minting-dapp
cd ai-nft-minting-dapp
```

## Install Dependencies

Install root dependencies with:

```shell
npm install
```

Install frontend dependencies with:

```shell
cd frontend && npm install
```

## Add Environment Variables

You might need to add following environment variables in .env file in the root directory

```
INFURA_API_KEY=
PRIVATE_KEY=
```

Also need to add the following environment variables in .env file in the frontend directory

```
VITE_OPENAI_API_KEY=
VITE_PINATA_API_KEY=
VITE_PINATA_API_SECRET=
VITE_PINATA_JWT=
```

## Hardhat

Try running the following command which displays a number of hardhat tasks:

```shell
npx hardhat
```

To run hardhat tests, try running the following command:

```shell
npx hardhat test
```

## Frontend

To run the frontend application, try running the following command

```shell
cd frontend && npm run dev
```

Happy minting!!!
