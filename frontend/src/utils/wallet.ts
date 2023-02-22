import { BrowserProvider } from "ethers";

export const connectWallet = async (
    provider: BrowserProvider | undefined,
    callback: (accounts: Array<string>) => void
) => {
    try {
        await provider?.send("eth_requestAccounts", []).then(callback);
    } catch (error) {
        throw error;
    }
};

export const switchToGoerliNetwork = async (provider: BrowserProvider | undefined) => {
    try {
        await provider?.send("wallet_switchEthereumChain", [{ chainId: "0x5" }]);
    } catch (error: any) {
        if (error.code === 4902) {
            try {
                await provider?.send("wallet_addEthereumChain", [
                    {
                        chainId: "0x5",
                        chainName: "Goerli",
                        rpcUrls: ["https://goerli.infura.io/v3/"],
                        nativeCurrency: {
                            name: "Goerli ETH",
                            symbol: "gorETH",
                            decimals: 18
                        },
                        blockExplorerUrls: ["https://goerli.etherscan.io"]
                    }
                ]);
            } catch (error) {
                throw error;
            }
        }

        throw error;
    }
};
