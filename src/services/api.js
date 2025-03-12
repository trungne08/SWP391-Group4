const API_BASE_URL = "https://hare-causal-prawn.ngrok-free.app";

const api = {
  auth: {
    login: async (credentials) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({
            email: credentials.email.trim(), // Giữ nguyên là email
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        console.log("Request data:", {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/user/change-password`, // Sửa lại endpoint theo API docs
          {
            method: "PUT", // Đổi method thành POST
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              oldPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword
            }),
          }
        );

        const responseText = await response.text();
        console.log("Response:", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Password change failed");
        }

        return { success: true };
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
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          mode: "cors",
          credentials: "include"
        });
    
        const responseText = await response.text();
        console.log("Get all users response:", responseText);
    
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
    
        try {
          return responseText ? JSON.parse(responseText) : [];
        } catch (parseError) {
          console.error("Parse error:", parseError);
          return [];
        }
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

        // Handle non-JSON response
        const responseText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }

        if (!response.ok) {
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
          mode: "cors",
          credentials: "include",
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
          avatar: data.avatar === undefined ? null : data.avatar,
        };
      } catch (error) {
        console.error("Get profile error:", error);
        throw error;
      }
    },

    updateProfile: async (data) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id;

        const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify({
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            avatar: data.avatar
          }),
        });

        const responseText = await response.text();
        console.log("Update profile response:", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Failed to update profile");
        }

        try {
          return JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse response:", e);
          return data;
        }
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    },
  },
  membership: {
    getAllPackages: async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(
          `${API_BASE_URL}/api/membership/packages`,  // Sửa lại endpoint đúng theo API docs
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` })
            },
            mode: "cors",
            credentials: "include"
          }
        );
    
        console.log("Response status:", response.status);
        const responseText = await response.text();
        console.log("Raw response:", responseText);
    
        if (!response.ok) {
          throw new Error(`Failed to fetch packages: ${response.status}`);
        }
    
        if (!responseText) {
          return [];
        }
    
        const data = JSON.parse(responseText);
        console.log("Parsed data:", data);
        return Array.isArray(data) ? data : [data];
      } catch (error) {
        console.error("Get packages error:", error);
        return [];
      }
    },

    registerMembership: async (packageId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        console.log("Registering with packageId:", packageId); // Debug log

        const response = await fetch(
          `${API_BASE_URL}/api/subscriptions/subscribe/${packageId}`, // Endpoint đúng
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ packageId }) // Thêm packageId vào body
          }
        );

        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (!response.ok) {
          const errorMessage = responseText || "Failed to register membership";
          console.error("Server error:", errorMessage);
          throw new Error(errorMessage);
        }

        return responseText ? JSON.parse(responseText) : { success: true };
      } catch (error) {
        console.error("Register membership error:", error);
        throw error;
      }
    },

    getUserMembership: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/subscriptions/my-subscriptions`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            mode: "cors",
            credentials: "include"
          }
        );

        const responseText = await response.text();
        console.log("User membership response:", responseText);

        if (!response.ok) {
          throw new Error("Failed to fetch user membership");
        }

        try {
          return responseText ? JSON.parse(responseText) : [];
        } catch (parseError) {
          console.error("Parse error:", parseError);
          return [];
        }
      } catch (error) {
        console.error("Get user membership error:", error);
        return [];
      }
    },

    cancelSubscription: async (subscriptionId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        
        const response = await fetch(
          `${API_BASE_URL}/api/subscriptions/cancel/${subscriptionId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to cancel subscription");
        }
        
        return true;
      } catch (error) {
        console.error("Cancel subscription error:", error);
        throw error;
      }
    },
    upgradeSubscription: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // ID của gói Premium Plan là 2
        const premiumPackageId = 2;

        const response = await fetch(
          `${API_BASE_URL}/api/subscriptions/subscribe/${premiumPackageId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to upgrade subscription");
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Upgrade subscription error:", error);
        throw error;
      }
    },
  },
  pregnancy: {
    getOngoingPregnancy: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Lấy userId từ token thay vì localStorage
        let userId;
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          userId = tokenData.id || tokenData.user_id;
          if (!userId) {
            throw new Error("User ID not found in token");
          }
        } catch (err) {
          console.error("Failed to extract user ID from token:", err);
          throw new Error("Invalid token format");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/ongoing/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            mode: "cors",
            credentials: "include"
          }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers));
        
        const responseText = await response.text();
        console.log("Raw pregnancy response:", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Failed to fetch pregnancy data");
        }

        if (!responseText || responseText.includes("<!DOCTYPE html>")) {
          console.error("Received HTML instead of JSON");
          return null;
        }

        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse pregnancy data:", parseError);
          return null;
        }
      } catch (error) {
        console.error("Get pregnancy error:", error);
        return null;
      }
    },

    createPregnancy: async (pregnancyData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
    
        // Extract user ID from token
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id || tokenData.user_id;
        if (!userId) {
          throw new Error("User ID not found in token");
        }
    
        // Add userId to pregnancy data
        const pregnancyDataWithUserId = {
          ...pregnancyData,
          userId: userId
        };
    
        const response = await fetch(`${API_BASE_URL}/api/pregnancies`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(pregnancyDataWithUserId)
        });
    
        const responseText = await response.text();
        console.log("Create pregnancy response:", responseText);
    
        if (!response.ok) {
          const errorMessage = responseText || "Failed to create pregnancy";
          throw new Error(errorMessage);
        }
    
        try {
          return responseText ? JSON.parse(responseText) : null;
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          return null;
        }
      } catch (error) {
        console.error("Create pregnancy error:", error);
        throw error;
      }
    },

    updatePregnancy: async (pregnancyId, updateData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/${pregnancyId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updateData)
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update pregnancy");
        }

        return await response.json();
      } catch (error) {
        console.error("Update pregnancy error:", error);
        throw error;
      }
    },

    getUserPregnancies: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        let userId;
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          userId = tokenData.id || tokenData.user_id;
          if (!userId) {
            throw new Error("User ID not found in token");
          }
        } catch (err) {
          console.error("Failed to extract user ID from token:", err);
          throw new Error("Invalid token format");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/user/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            mode: "cors",
            credentials: "include"
          }
        );

        const responseText = await response.text();
        console.log("User pregnancies response:", responseText);

        if (!response.ok) {
          throw new Error("Failed to fetch user pregnancies");
        }

        try {
          return responseText ? JSON.parse(responseText) : [];
        } catch (parseError) {
          console.error("Parse error:", parseError);
          return [];
        }
      } catch (error) {
        console.error("Get user pregnancies error:", error);
        return [];
      }
    },

    updatePregnancyStatus: async (pregnancyId, status) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/${pregnancyId}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update pregnancy status");
        }

        return await response.json();
      } catch (error) {
        console.error("Update pregnancy status error:", error);
        throw error;
      }
    },
    getPregnancyHistory: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
  
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id || tokenData.user_id;
        if (!userId) {
          throw new Error("User ID not found in token");
        }
  
        const response = await fetch(`${API_BASE_URL}/api/pregnancies/history/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: "cors",
          credentials: "include"
        });
  
        const responseText = await response.text();
        console.log("Pregnancy history response:", responseText);
  
        if (!response.ok) {
          throw new Error("Failed to fetch pregnancy history");
        }
  
        try {
          return responseText ? JSON.parse(responseText) : [];
        } catch (parseError) {
          console.error("Parse error:", parseError);
          return [];
        }
      } catch (error) {
        console.error("Get pregnancy history error:", error);
        return [];
      }
    },
  },

fetus:{
  getFetusMeasurements: async (fetusId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/fetus-records/${fetusId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: "cors",
          credentials: "include"
        }
      );

      const responseText = await response.text();
      console.log("Fetus measurements response:", responseText);

      if (!response.ok) {
        throw new Error("Failed to fetch fetus measurements");
      }

      try {
        return responseText ? JSON.parse(responseText) : [];
      } catch (parseError) {
        console.error("Parse error:", parseError);
        return [];
      }
    } catch (error) {
      console.error("Get fetus measurements error:", error);
      return [];
    }
  },
  createFetusRecord: async (fetusId, recordData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
  
      // Format the data according to the API requirements
      const formattedData = {
        fetusId: fetusId,
        week: parseInt(recordData.week),
        fetalWeight: parseInt(recordData.fetalWeight),
        crownHeelLength: parseInt(recordData.crownHeelLength),
        headCircumference: parseInt(recordData.headCircumference),
        examDate: new Date().toISOString().split('T')[0]
      };
  
      console.log('Sending formatted data:', formattedData);
  
      const response = await fetch(
        `${API_BASE_URL}/api/fetus-records/${fetusId}`, // Changed back to include fetusId in URL
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formattedData)
        }
      );
  
      // Log the full response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
      
      const responseText = await response.text();
      console.log('Server response text:', responseText);
  
      if (!response.ok) {
        throw new Error(responseText || "Failed to create fetus record");
      }
  
      return responseText ? JSON.parse(responseText) : null;
  
    } catch (error) {
      console.error("Create fetus record error:", error);
      throw error;
    }
  }
  
}
};

export default api;

