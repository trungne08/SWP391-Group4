const API_BASE_URL = "http://localhost:8080";

const api = {
  auth: {
    login: async (credentials) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email.trim(),  // Giữ nguyên là email
            password: credentials.password,
          }),
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Kiểm tra và trích xuất thông tin từ token
        let tokenData = {};
        try {
          tokenData = JSON.parse(atob(data.token.split(".")[1]));
          console.log("Token data:", tokenData);
        } catch (err) {
          console.error("Invalid token format", err);
          throw new Error("Invalid token received");
        }

        return {
          token: data.token,
          user_id: tokenData.id || tokenData.user_id,
          username: tokenData.sub,
          email: tokenData.email,
          role: tokenData.role,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    register: async (userData) => {
      try {
        console.log("Sending registration data:", userData);
        const response = await fetch(`${API_BASE_URL}/api/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            role: "MEMBER",
          }),
        });

        // Xử lý response text trước
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        // Nếu response không ok, ném lỗi với message
        if (!response.ok) {
          throw new Error(responseText || "Registration failed");
        }

        // Nếu response text rỗng, return true để chỉ ra thành công
        if (!responseText) {
          return true;
        }

        // Thử parse JSON nếu có data
        try {
          return JSON.parse(responseText);
        } catch {
          return true; // Nếu không parse được JSON, vẫn coi như thành công
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    changePassword: async (passwordData) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/change-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(passwordData),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Password change failed");
        }
        return data;
      } catch (error) {
        console.error("Change password error:", error);
        throw error;
      }
    },
  },

  user: {
    getAllUsers: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }
        return data;
      } catch (error) {
        console.error("Get all users error:", error);
        throw error;
      }
    },

    deleteUser: async (userId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete user");
        }

        return true;
      } catch (error) {
        console.error("Delete user error:", error);
        throw error;
      }
    },

    updateUserRole: async (userId, newRole) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/user/${userId}/role`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ role: newRole }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update user role");
        }

        return await response.json();
      } catch (error) {
        console.error("Update user role error:", error);
        throw error;
      }
    },
    getProfile: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        let userId;
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          userId = tokenData.id;
          console.log("Token data for profile:", tokenData);
        } catch (err) {
          console.error("Invalid token format", err);
          throw new Error("Invalid token");
        }

        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        console.log("Raw profile data:", data);

        return {
          ...data,
          fullName: data.fullName === undefined ? null : data.fullName,
          phoneNumber: data.phoneNumber === undefined ? null : data.phoneNumber,
          avatar: data.avatar === undefined ? null : data.avatar
        };
      } catch (error) {
        console.error("Get profile error:", error);
        throw error;
      }
    },

    updateProfile: async (data) => {
      try {
        const token = localStorage.getItem("token");
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id;

        console.log("Sending update data:", data);

        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
          }),
        });

        const responseData = await response.json();
        console.log("Update response:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || "Failed to update profile");
        }

        return {
          ...responseData,
          fullName: responseData.fullName,
          phoneNumber: responseData.phoneNumber
        };
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    },
  },
};

export default api;
