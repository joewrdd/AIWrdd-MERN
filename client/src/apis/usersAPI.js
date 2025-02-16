import axios from "axios";

//----- Registration -----
export const regesterAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:3008/api/users/register",
    {
      username: userData?.username,
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//----- Login -----
export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:3008/api/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//----- Check Authentication -----
export const authAPI = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3008/api/users/auth/check",
      {
        withCredentials: true,
      }
    );

    // Debug logging
    console.log("Auth check response:", response.data);

    if (!response.data) {
      throw new Error("No data received from auth check");
    }

    return response.data;
  } catch (error) {
    console.error("Auth check error:", error.response?.data || error.message);
    throw error;
  }
};

//----- Logout -----
export const logoutAPI = async () => {
  const response = await axios.post(
    "http://localhost:3008/api/users/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//----- Dashboard -----
export const profileAPI = async () => {
  const response = await axios.get("http://localhost:3008/api/users/profile", {
    withCredentials: true,
  });
  return response?.data;
};
