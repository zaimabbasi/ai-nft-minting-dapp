import axios from "axios";
import FormData from "form-data";
import { PINATA_API_BASE_URL, PINATA_API_KEY, PINATA_API_SECRET } from "../constants/appConstants";

interface PinataContent {
    name: string;
    description: string;
    image: string;
}

export const pinFile = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
        "pinataOptions",
        JSON.stringify({
            cidVersion: 1
        })
    );
    formData.append(
        "pinataMetadata",
        JSON.stringify({
            name: file.name
        })
    );

    try {
        const response = await axios.post("pinning/pinFileToIPFS", formData, {
            baseURL: PINATA_API_BASE_URL,
            headers: {
                "Content-Type": `multipart/form-data; boundry=${formData.getBoundary}`,
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET
            },
            maxBodyLength: Number.POSITIVE_INFINITY
        });

        const data = await response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

export const pinJSON = async (content: PinataContent) => {
    const metadata = JSON.stringify({
        pinataContent: content,
        pinataOptions: {
            cidVersion: 1
        },
        pinataMetadata: {
            name: content.name
        }
    });

    try {
        const response = await axios.post("pinning/pinJSONToIPFS", metadata, {
            baseURL: PINATA_API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET
            },
            maxBodyLength: Number.POSITIVE_INFINITY
        });

        const data = await response.data;
        return data;
    } catch (error) {
        throw error;
    }
};

export const unpin = async (cid: string) => {
    try {
        const response = await axios.delete(`/pinning/unpin/${cid}`, {
            baseURL: PINATA_API_BASE_URL,
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET
            }
        });

        const data = await response.data;
        return data;
    } catch (error) {
        throw error;
    }
};
