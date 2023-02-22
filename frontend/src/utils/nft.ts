import Nft_goerli from "../../../deployments/goerli/Nft.json";

export const getNftDeployment = (chainId: number) => {
    if (chainId === 5) return Nft_goerli;

    return undefined;
};
