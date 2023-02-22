import { BrowserProvider } from "ethers";
import ConnectWalletButton from "./ConnectWalletButton";

const NoAccountConnected = ({
    provider,
    onAccountsChanged
}: {
    provider: BrowserProvider;
    onAccountsChanged: (accounts: Array<string>) => void;
}) => {
    const content = (
        <div className="flex flex-col items-center text-center">
            <h1 className=" sm:text-xl text-lg font-semibold">Account Not Connected</h1>
            <p className="mt-1 text-sm sm:text-base">Please connect an account with your ethereum wallet!</p>

            <div className="mt-7">
                <ConnectWalletButton provider={provider} onAccountsChanged={onAccountsChanged} />
            </div>
        </div>
    );

    return content;
};

export default NoAccountConnected;
