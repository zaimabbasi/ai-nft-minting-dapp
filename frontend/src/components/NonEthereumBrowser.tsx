import GetMetamask from "./GetMetamask";

const NonEthereumBrowser = () => {
    const content = (
        <div className="flex flex-col items-center text-center">
            <h1 className="text-lg sm:text-xl font-semibold">Non-Ethereum Browser</h1>
            <p className="mt-1 text-sm sm:text-base">Non-ethereum browser detected, please install Metamask!</p>

            <div className="mt-7">
                <GetMetamask />
            </div>
        </div>
    );

    return content;
};

export default NonEthereumBrowser;
