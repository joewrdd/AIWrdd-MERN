import axios from "axios";

// View content details
export const viewContentAPI = async (contentId) => {
  const response = await axios.get(
    `http://localhost:3008/api/history/${contentId}`,
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

// Update content
export const updateContentAPI = async ({ contentId, content }) => {
  const response = await axios.put(
    `http://localhost:3008/api/history/${contentId}`,
    { content },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

// Delete content
export const deleteContentAPI = async (contentId) => {
  const response = await axios.delete(
    `http://localhost:3008/api/history/${contentId}`,
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
