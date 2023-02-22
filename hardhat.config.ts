import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    namedAccounts: {
        deployer: 0
    },
    networks: {
        hardhat: {
            chainId: 1337,
            saveDeployments: true
        },
        goerli: {
            accounts: [PRIVATE_KEY],
            chainId: 5,
            saveDeployments: true,
            url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`
        }
    }
};

export default config;
