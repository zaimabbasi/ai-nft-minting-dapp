import useGetMetamaskDownloadLink from "../hooks/useGetMetamaskDownloadLink";

const GetMetamask = () => {
    const downloadLink = useGetMetamaskDownloadLink();

    const content = (
        <a
            className="flex items-center justify-center gap-3 rounded-md bg-pop-blue-dark px-3 py-2 hover:bg-pop-blue-light"
            href={downloadLink}
            target="_blank"
        >
            Get MetaMask
        </a>
    );

    return content;
};

export default GetMetamask;
