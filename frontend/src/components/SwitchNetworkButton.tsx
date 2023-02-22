import React, { useState } from "react";
import { BrowserProvider } from "ethers";
import Spinner from "./Spinner";
import { switchToGoerliNetwork } from "../utils/wallet";

const SwitchNetworkButton = ({ provider }: { provider: BrowserProvider }) => {
    const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

    const handleSwitchNetwork = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsSwitchingNetwork(true);

        try {
            await switchToGoerliNetwork(provider);
        } catch (error: any) {
            console.log(error);
        }

        setIsSwitchingNetwork(false);
    };

    const content = (
        <button
            className="flex items-center justify-center gap-3 rounded-md bg-pop-blue-dark px-3 py-2 enabled:hover:bg-pop-blue-light"
            onClick={handleSwitchNetwork}
            disabled={isSwitchingNetwork}
        >
            {isSwitchingNetwork ? (
                <>
                    <Spinner />
                    Switching network...
                </>
            ) : (
                "Switch Network"
            )}
        </button>
    );

    return content;
};

export default SwitchNetworkButton;
