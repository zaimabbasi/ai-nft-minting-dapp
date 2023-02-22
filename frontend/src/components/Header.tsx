import { useSelector } from "react-redux";
import Blockies from "react-blockies";
import { TbPlugConnectedX } from "react-icons/tb";
import { selectAccount } from "../features/wallet/walletSlice";

const Header = () => {
    const account = useSelector(selectAccount);

    const slicedAccount = (account: string) => {
        return `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`;
    };

    const content = (
        <nav className="flex h-20 items-center bg-pop-dark_ui-900 p-5">
            <div className="container mx-auto flex max-w-7xl items-center justify-between gap-10">
                <span className="text-center text-xl font-semibold">AI NFT</span>

                {account ? (
                    <>
                        <a
                            className="flex items-center hover:underline"
                            href={`https://goerli.etherscan.io/address/${account}`}
                            target="_blank"
                        >
                            {slicedAccount(account)}
                            <Blockies className="ml-3 rounded-full" seed={account} scale={5} />
                        </a>
                    </>
                ) : (
                    <TbPlugConnectedX className="h-7 w-7 rounded-md"></TbPlugConnectedX>
                )}
            </div>
        </nav>
    );

    return content;
};

export default Header;
