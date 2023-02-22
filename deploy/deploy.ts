import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy("Nft", {
        from: deployer,
        args: [],
        log: true,
        autoMine: true // speed up deployment on local network (ganache, hardhat), no effect on live networks
    });
};
export default deploy;
deploy.tags = ["Nft"];
