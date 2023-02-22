import { BrowserProvider } from "ethers";
import SwitchNetworkButton from "./SwitchNetworkButton";

const SwitchNetwork = ({ provider }: { provider: BrowserProvider }) => {
    const content = (
        <div className="flex flex-col items-center text-center">
            <h1 className="text-lg font-semibold sm:text-xl">Wrong Network Selected</h1>
            <p className="mt-1 text-sm sm:text-base">
                Contract is not deployed on selected network, please switch to Goerli test network!
            </p>

            <div className="mt-7">
                <SwitchNetworkButton provider={provider} />
            </div>
        </div>
    );

    return content;
};

export default SwitchNetwork;
