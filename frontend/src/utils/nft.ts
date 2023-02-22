import Nft_goerli from "../../../deployments/goerli/Nft.json";
import Nft_localhost from "../../../deployments/localhost/Nft.json";

export const getNftDeployment = (chainId: number) => {
    if (chainId === 5) return Nft_goerli;
    else if (chainId === 1337) return Nft_localhost;
};
