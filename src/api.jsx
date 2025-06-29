const API_BASE_URL = "https://waldo-api-ivmo.onrender.com/api";

const apiClient = {
  async request(endpoint, { method = "GET", data = null } = {}) {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "An error occurred");
      }

      if (response.status === 204) { 
        return null;
      }
      
      if (response.headers.get("content-type")?.includes("application/json")) {
        return response.json();
      }

      return response.text(); 
    } catch (error) {
      console.error("API Client Error:", error);
      throw error;
    }
  },
};

export default apiClient;