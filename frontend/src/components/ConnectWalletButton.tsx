import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { selectAccount, setAccount, clearAccount } from "../features/wallet/walletSlice";
import Spinner from "./Spinner";
import { connectWallet } from "../utils/wallet";
import { BrowserProvider } from "ethers";

const ConnectWalletButton = ({
    provider,
    onAccountsChanged
}: {
    provider: BrowserProvider;
    onAccountsChanged: (accounts: Array<string>) => void;
}) => {
    const [isConnectingWallet, setIsConnectingWallet] = useState(false);

    const handleConnectWallet = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsConnectingWallet(true);

        try {
            await connectWallet(provider, onAccountsChanged);
        } catch (error) {
            console.log(error);
        }

        setIsConnectingWallet(false);
    };

    const content = (
        <button
            className="flex items-center justify-center gap-3 rounded-md bg-pop-blue-dark px-3 py-2 enabled:hover:bg-pop-blue-light"
            onClick={handleConnectWallet}
            disabled={isConnectingWallet}
        >
            {isConnectingWallet ? (
                <>
                    <Spinner />
                    Connecting wallet...
                </>
            ) : (
                "Connect Wallet"
            )}
        </button>
    );

    return content;
};

export default ConnectWalletButton;
