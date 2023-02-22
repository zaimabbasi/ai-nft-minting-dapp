import { detect } from "detect-browser";
import {
    METAMASK_CHROME_DOWNLOAD_URL,
    METAMASK_FIREFOX_DOWNLOAD_URL,
    METAMASK_EDGE_DOWNLOAD_URL,
    METAMASK_OPERA_DOWNLOAD_URL,
    METAMASK_OTHER_DOWNLOAD_URL
} from "../constants/appConstants";

const useGetMetamaskDownloadLink = () => {
    const browser = detect();
    const browserName = browser?.name;

    if (browserName === "chrome") return METAMASK_CHROME_DOWNLOAD_URL;
    else if (browserName === "firefox") return METAMASK_FIREFOX_DOWNLOAD_URL;
    else if (browserName === "edge") return METAMASK_EDGE_DOWNLOAD_URL;
    else if (browserName === "opera") return METAMASK_OPERA_DOWNLOAD_URL;
    else return METAMASK_OTHER_DOWNLOAD_URL;
};

export default useGetMetamaskDownloadLink;
