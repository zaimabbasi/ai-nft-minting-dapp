import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../constants/appConstants";

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

export const createImage = async (prompt: string) => {
    console.log(configuration);
    try {
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: "512x512",
            response_format: "b64_json"
        });

        return response.data.data[0].b64_json;
    } catch (error) {
        throw error;
    }
};
