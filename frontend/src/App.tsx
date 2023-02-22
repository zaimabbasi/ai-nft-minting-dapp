import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { BrowserProvider, ethers, Signer } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";
import { Header, Loading, NoAccountConnected, NonEthereumBrowser, Spinner, WrongNetwork } from "./components";
import { selectAccount, setAccount, clearAccount } from "./features/wallet/walletSlice";
import { getNftDeployment } from "./utils/nft";
import { createImage } from "./utils/openai";
import { pinFile, pinJSON, unpin } from "./utils/pinata";

const App = () => {
    const dispatch = useDispatch();
    const account = useSelector(selectAccount);
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [b64Json, setB64Json] = useState<string>();
    const [isCreatingImage, setIsCreatingImage] = useState<boolean>(false);
    const [isMintingNFT, setIsMintingNFT] = useState<boolean>(false);
    const [isAppStarted, setIsAppStarted] = useState<boolean>(false);
    const [provider, setProvider] = useState<BrowserProvider>();
    const [nft, setNft] = useState<any>();
    const [mintedTokenURI, setMintedTokenURI] = useState<string>();
    const [safeMintLocation, setSafeMintLocation] = useState<string>();
    const [withdrawLocation, setWithdrawLocation] = useState<string>();

    useEffect(() => {
        const detectProvider = async () => {
            try {
                const detectedProvider = await detectEthereumProvider();

                if (detectedProvider) {
                    detectedProvider.on("accountsChanged", onAccountsChanged);
                    detectedProvider.on("chainChanged", onChainChanged);

                    startApp(detectedProvider);
                }

                setIsAppStarted(true);

                return detectedProvider;
            } catch (error) {
                console.log(error);
            }
        };

        const detectedProvider = detectProvider();

        return () => {
            detectedProvider.then((provider) => {
                provider?.removeListener("accountsChanged", onAccountsChanged);
                provider?.removeListener("chainChanged", onChainChanged);
            });
        };
    }, []);

    useEffect(() => {
        nft?.on("SafeMint", onSafeMint);
        nft?.on("WithdrawBalance", onWithdrawBalance);

        return () => {
            nft?.removeListener("SafeMint", onSafeMint);
            nft?.removeListener("WithdrawBalance", onWithdrawBalance);
        };
    }, [nft]);

    const onAccountsChanged = (accounts: Array<string>) => {
        if (accounts.length === 0) {
            dispatch(clearAccount());
        } else if (accounts[0] !== account) {
            dispatch(setAccount({ account: accounts[0] }));
        }
    };

    const onChainChanged = (chainId: any) => {
        window.location.reload();
    };

    const onSafeMint = (recipient: string, tokenId: BigInt, tokenURI: string) => {
        console.log("onSafeMint:", recipient, tokenId, tokenURI);
        setMintedTokenURI(tokenURI);
    };

    const onWithdrawBalance = (amount: BigInt) => {
        console.log("onWithdrawBalance", amount);
    };

    const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onDescriptionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const startApp = async (detectedProvider: any) => {
        const { ethereum } = window as any;

        if (detectedProvider !== ethereum) {
            console.log("Do you have multiple wallets installed?");
        } else {
            // create browser provider instance
            const provider = new ethers.BrowserProvider(ethereum);
            setProvider(provider);

            // get network
            const network = await provider.getNetwork();

            // get nft deployment
            const nftArtifact = getNftDeployment(Number(network.chainId));

            if (nftArtifact) {
                // create nft contract instance
                const nft = new ethers.Contract(nftArtifact.address, nftArtifact.abi, provider);
                setNft(nft);
            }
        }
    };

    const handleCreateImage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // requesting image
        setIsCreatingImage(true);

        try {
            // create image from description
            const result = await createImage(description);
            setB64Json(result);
        } catch (error: any) {
            console.log(error);
        }

        // image request complete
        setIsCreatingImage(false);
    };

    const handleMintNFT = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsMintingNFT(true);

        try {
            // create file from base64 image
            const file = new File([Buffer.from(b64Json as string, "base64")], name, { type: "image/png" });

            // pin file to ipfs
            const pinFileResult = await pinFile(file);

            // create image uri
            const imageURI: string = `ipfs://${pinFileResult.IpfsHash}`;

            // pin json to ipfs
            const pinJSONResult = await pinJSON({
                name,
                description,
                image: imageURI
            });

            // create token uri
            const tokenURI: string = pinJSONResult.IpfsHash;

            // mint an NFT token
            try {
                await provider?.getSigner().then(async (signer) => {
                    // get recipient address
                    const recipient = await signer.getAddress();

                    // safeMint
                    const safeMintTx = await nft?.connect(signer).safeMint(recipient, tokenURI, {
                        value: ethers.parseUnits("0.01", "ether")
                    });

                    // wait for block confirmation
                    await safeMintTx.wait();
                });
            } catch (error) {
                try {
                    // unpin file and metadata if transaction failed
                    await unpin(pinFileResult.IpfsHash);
                    await unpin(pinJSONResult.IpfsHash);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }

        setIsMintingNFT(false);
    };

    const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        setName("");
        setDescription("");
        setB64Json(undefined);
        setMintedTokenURI("");
    };

    const content = (
        <>
            <Header />

            <main className="container mx-auto max-w-5xl p-5">
                {!isAppStarted ? (
                    <Loading />
                ) : !provider ? (
                    <NonEthereumBrowser />
                ) : !nft ? (
                    <WrongNetwork provider={provider} />
                ) : !account ? (
                    <NoAccountConnected provider={provider} onAccountsChanged={onAccountsChanged} />
                ) : !b64Json ? (
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h1 className="text-lg font-semibold sm:text-xl">Create Image</h1>
                            <p className="mt-1 text-sm sm:text-base">
                                Please write down the description about the image you want to create!
                            </p>
                        </div>

                        <form
                            className="mt-7 flex w-full max-w-xl flex-col justify-center gap-5 rounded-md bg-pop-dark_ui-500 p-5"
                            onSubmit={handleCreateImage}
                        >
                            <input
                                className="w-full rounded-md border bg-pop-dark_ui-300 px-3 py-2"
                                id="description"
                                type="text"
                                value={description}
                                placeholder="Enter image description"
                                onChange={onDescriptionChanged}
                                autoFocus
                                required
                            />

                            <button
                                className="flex w-full items-center justify-center gap-1 rounded-md bg-pop-blue-dark px-3 py-2 enabled:hover:bg-pop-blue-light"
                                type="submit"
                                disabled={isCreatingImage}
                            >
                                {isCreatingImage ? (
                                    <>
                                        <Spinner />
                                        Creating image...
                                    </>
                                ) : (
                                    "Create Image"
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h1 className="text-lg font-semibold sm:text-xl">Mint NFT</h1>
                            <p className="mt-1 text-sm sm:text-base">Give your image a nice name and start minting!</p>
                        </div>

                        <img
                            className="mt-7 w-full max-w-xl rounded-md"
                            src={`data:image/png;base64,${b64Json}`}
                            alt=""
                        />

                        {mintedTokenURI ? (
                            <div className="flex w-full max-w-xl flex-col items-center justify-center gap-5">
                                <div className="mt-7 flex w-full max-w-xl items-center justify-center rounded-md bg-pop-dark_ui-500 p-5">
                                    <a className="hover:underline" href={mintedTokenURI} target="_blank">
                                        <span> {mintedTokenURI}</span>
                                    </a>
                                </div>
                                <button
                                    className="flex w-full max-w-xl items-center justify-center rounded-md bg-pop-grey-light px-3 py-2 enabled:hover:bg-pop-grey-dark dark:bg-pop-blue-dark dark:enabled:hover:bg-pop-blue-light"
                                    type="button"
                                    disabled={isMintingNFT}
                                    onClick={handleReset}
                                >
                                    Done!
                                </button>
                            </div>
                        ) : (
                            <form
                                className="mt-7 flex w-full max-w-xl flex-col justify-center gap-5 rounded-md bg-pop-dark_ui-500 p-5"
                                onSubmit={handleMintNFT}
                            >
                                <input
                                    className="w-full rounded-md border bg-pop-dark_ui-300 px-3 py-2"
                                    id="name"
                                    type="text"
                                    value={name}
                                    placeholder="Enter image name"
                                    disabled={isMintingNFT}
                                    onChange={onNameChanged}
                                    required
                                    autoFocus
                                />
                                <div className="items-center-justify-between flex gap-3">
                                    <button
                                        className="flex w-full items-center justify-center gap-1 rounded-md bg-pop-red-dark px-3 py-2 enabled:hover:bg-pop-red-light"
                                        type="button"
                                        disabled={isMintingNFT}
                                        onClick={handleReset}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="flex w-full items-center justify-center gap-1 rounded-md bg-pop-blue-dark px-3 py-2 enabled:hover:bg-pop-blue-light"
                                        type="submit"
                                        disabled={isMintingNFT}
                                    >
                                        {isMintingNFT ? (
                                            <>
                                                <Spinner />
                                                Minting NFT...
                                            </>
                                        ) : (
                                            "Mint NFT"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </>
    );

    return content;
};

export default App;
