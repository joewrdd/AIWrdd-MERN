import axios from "axios";

//----- Generate Content -----
export const generateContentAPI = async (userPrompt) => {
  const response = await axios.post(
    "http://localhost:3008/api/openai/generate-content",
    {
      prompt: userPrompt,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
