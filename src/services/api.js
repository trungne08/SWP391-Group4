const API_BASE_URL = "https://poetic-helping-mallard.ngrok-free.app";

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
            email: credentials.email.trim(), // Giữ Snguyên là email
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
              newPassword: passwordData.newPassword,
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
          credentials: "include",
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
            avatar: data.avatar,
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
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/membership/packages`, // Sửa lại endpoint đúng theo API docs
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            mode: "cors",
            credentials: "include",
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
            body: JSON.stringify({ packageId }), // Thêm packageId vào body
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
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
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
            },
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
  community: {
    createPost: async (postData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        console.log("Sending post data:", postData); // Debug log

        const response = await fetch(`${API_BASE_URL}/api/community/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        });

        const responseText = await response.text();
        console.log("Server response:", responseText); // Debug log

        if (!response.ok) {
          const errorMessage = responseText || "Failed to create post";
          console.error("Server error:", response.status, errorMessage);
          throw new Error(errorMessage);
        }

        return responseText ? JSON.parse(responseText) : { success: true };
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },

    getAllPosts: async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/community/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          mode: "cors",
          credentials: "include", // Add this back as it might be needed for authentication
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Raw response:", responseText);

        // Check if response is empty
        if (!responseText.trim()) {
          return [];
        }

        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error("Parse error:", parseError);
          console.error("Response that failed to parse:", responseText);
          throw new Error("Invalid JSON response from server");
        }
      } catch (error) {
        console.error("Get posts error:", error);
        throw error;
      }
    },

    getPostById: async (postId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/community/posts/${postId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            mode: "cors",
            credentials: "include",
          }
        );

        const responseText = await response.text();
        console.log("Post details response:", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Failed to fetch post");
        }

        if (!responseText.trim()) {
          throw new Error("Empty response from server");
        }

        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error("Parse error:", parseError);
          console.error("Response that failed to parse:", responseText);
          throw new Error("Invalid JSON response from server");
        }
      } catch (error) {
        console.error("Get post error:", error);
        throw error;
      }
    },

    createComment: async (postId, commentData) => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/community/posts/${postId}/comments`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(commentData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create comment");
        }

        return await response.json();
      } catch (error) {
        console.error("Create comment error:", error);
        throw error;
      }
    },
    // Add comma here
    deletePost: async (postId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/community/posts/${postId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to delete post");
        }

        return true;
      } catch (error) {
        console.error("Delete post error:", error);
        throw error;
      }
    },

    deleteComment: async (commentId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/community/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to delete comment");
        }

        return true;
      } catch (error) {
        console.error("Delete comment error:", error);
        throw error;
      }
    },
  },
  reminders: {
    getAllReminders: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_BASE_URL}/api/reminders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(`Failed to fetch reminders: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Raw reminders response:", responseText);

        if (!responseText.trim()) {
          return [];
        }

        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error("Parse error:", parseError);
          console.error("Response that failed to parse:", responseText);
          throw new Error("Invalid JSON response from server");
        }
      } catch (error) {
        console.error("Get reminders error:", error);
        throw error;
      }
    },

    getReminderById: async (reminderId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/reminders/${reminderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              mode: "cors",
              credentials: "include",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(`Failed to fetch reminders: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Raw reminders response:", responseText);

        if (!responseText.trim()) {
          return [];
        }

        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.error("Parse error:", parseError);
          console.error("Response that failed to parse:", responseText);
          throw new Error("Invalid JSON response from server");
        }
      } catch (error) {
        console.error("Get reminders error:", error);
        throw error;
      }
    },

    createReminder: async (reminderData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_BASE_URL}/api/reminders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reminderData),
        });

        if (!response.ok) {
          throw new Error("Failed to create reminder");
        }

        return await response.json();
      } catch (error) {
        console.error("Create reminder error:", error);
        throw error;
      }
    },

    updateReminder: async (reminderId, reminderData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/reminders/${reminderId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reminderData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update reminder");
        }

        return await response.json();
      } catch (error) {
        console.error("Update reminder error:", error);
        throw error;
      }
    },

    deleteReminder: async (reminderId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/reminders/${reminderId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete reminder");
        }

        return true;
      } catch (error) {
        console.error("Delete reminder error:", error);
        throw error;
      }
    },

    updateReminderStatus: async (reminderId, status) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        console.log("Updating status:", { reminderId, status }); // Debug log

        const response = await fetch(
          `${API_BASE_URL}/api/reminders/${reminderId}/status`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(status),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to update reminder status");
        }

        // Only read the response body once
        const responseText = await response.text();
        return responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.error("Update reminder status error:", error);
        throw error;
      }
    },
  },
  blog: {
    getAllBlogs: async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/blogs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
        });

        const responseText = await response.text();
        console.log("Raw blogs response:", responseText);

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        return Array.isArray(data) ? data : [data];
      } catch (error) {
        console.error("Blog API Error:", error);
        return [];
      }
    },

    createBlog: async (blogData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Ensure imageUrls is always an array
        const formattedData = {
          title: blogData.title,
          content: blogData.content,
          imageUrls: Array.isArray(blogData.imageUrls)
            ? blogData.imageUrls
            : [],
        };

        console.log("Creating blog with data:", formattedData);

        const response = await fetch(`${API_BASE_URL}/api/blogs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formattedData),
        });

        // ... rest of the code

        const responseText = await response.text();
        console.log("Create blog response:", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Failed to create blog");
        }

        return JSON.parse(responseText);
      } catch (error) {
        console.error("Create blog error:", error);
        throw error;
      }
    },

    updateBlog: async (blogId, blogData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const formattedData = {
          title: blogData.title,
          content: blogData.content,
          imageUrls: blogData.imageUrls, // Changed from images to imageUrls
        };

        const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });

        const responseText = await response.text();
        if (!response.ok) {
          throw new Error(responseText || "Failed to update blog");
        }

        return responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.error("Update blog error:", error);
        throw error;
      }
    },
    // ... deleteBlog remains the same ...

    deleteBlog: async (blogId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to delete blog");
        }

        return true;
      } catch (error) {
        console.error("Delete blog error:", error);
        throw error;
      }
    },
  },
  pregnancy: {
    getCurrentPregnancy: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id;

        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/ongoing/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors", // Add CORS mode
            credentials: "include", // Include credentials
          }
        );

        // First check if response is HTML
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          console.error(
            "Received HTML instead of JSON. API endpoint might be unavailable."
          );
          return null;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch pregnancy data: ${response.status}`);
        }

        const responseText = await response.text();
        console.log("Pregnancy API response:", responseText);

        if (!responseText.trim()) {
          return null;
        }

        try {
          const pregnancyData = JSON.parse(responseText);
          return pregnancyData;
        } catch (parseError) {
          console.error("Failed to parse pregnancy data:", parseError);
          return null;
        }
      } catch (error) {
        console.error("Get pregnancy error:", error);
        return null; // Return null instead of throwing
      }
    },
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
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
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

        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const userId = tokenData.id || tokenData.user_id;
        if (!userId) {
          throw new Error("User ID not found in token");
        }

        // Đảm bảo dữ liệu đúng định dạng
        const formattedData = {
          userId: userId,
          gestationalWeeks: parseInt(pregnancyData.gestationalWeeks),
          gestationalDays: parseInt(pregnancyData.gestationalDays),
          examDate: pregnancyData.examDate,
          totalFetuses: parseInt(pregnancyData.totalFetuses),
          status: "ONGOING",
          startDate: new Date().toISOString().split("T")[0], // Thêm ngày bắt đầu
        };

        console.log("Sending pregnancy data:", formattedData);

        const response = await fetch(`${API_BASE_URL}/api/pregnancies`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formattedData),
          mode: "cors",
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create pregnancy");
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Create pregnancy error:", error);
        throw error;
      }
    },

    updatePregnancyStatus: async (pregnancyId, fetusId, status) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Case 1: Update specific fetus status
        if (fetusId) {
          const response = await fetch(
            `${API_BASE_URL}/api/pregnancies/fetus/${fetusId}/status?status=CANCEL`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Could not update fetus status");
          }
          return true;
        }

        // Case 2: Update entire pregnancy status
        if (pregnancyId) {
          const response = await fetch(
            `${API_BASE_URL}/api/pregnancies/${pregnancyId}/status?status=${
              status || "COMPLETED"
            }`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Could not update pregnancy status");
          }
          return true;
        }

        throw new Error("Either pregnancyId or fetusId must be provided");
      } catch (error) {
        console.error(`Update status error:`, error);
        throw error;
      }
    },
    updatePregnancy: async (pregnancyId, updateData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Format data according to API spec
        const formattedData = {
          userId: updateData.userId,
          examDate: updateData.examDate, // Changed from checkupDate to examDate
          gestationalWeeks: parseInt(updateData.gestationalWeeks),
          gestationalDays: parseInt(updateData.gestationalDays),
          totalFetuses: parseInt(updateData.totalFetuses || 0),
        };

        console.log("Sending update data:", formattedData); // Debug log

        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/${pregnancyId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(formattedData),
            mode: "cors",
            credentials: "include",
          }
        );

        const responseText = await response.text();
        console.log("Update pregnancy response:", responseText);

        if (!response.ok) {
          throw new Error(responseText || "Failed to update pregnancy");
        }

        return responseText ? JSON.parse(responseText) : null;
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
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
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

        // Using the correct endpoint that works
        const response = await fetch(
          `${API_BASE_URL}/api/pregnancies/ongoing/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
          }
        );

        const responseText = await response.text();
        console.log("Pregnancy history response:", responseText);

        if (!response.ok) {
          throw new Error("Failed to fetch pregnancy history");
        }

        try {
          const data = responseText ? JSON.parse(responseText) : null;
          // Convert single pregnancy object to array if needed
          return data ? [data] : [];
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
  fetus: {
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
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
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

    createFetusRecord: async (fetusId, measurements) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const formattedData = {
          fetalWeight: measurements.fetalWeight?.toString() || "0",
          femurLength: measurements.femurLength?.toString() || "0",
          headCircumference: measurements.headCircumference?.toString() || "0",
        };
        console.log("Sending data:", { fetusId, formattedData });

        const response = await fetch(
          `${API_BASE_URL}/api/fetus-records/${fetusId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formattedData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create fetus record");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Create fetus record error:", error);
        throw error;
      }
    },

    getFetusRecords: async (fetusId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/fetus-records/${fetusId}/growth-data`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const responseText = await response.text();
        console.log("Raw growth data response:", responseText);

        if (!response.ok) {
          throw new Error(`Failed to fetch fetus growth data: ${responseText}`);
        }

        try {
          const data = JSON.parse(responseText);
          console.log("Parsed growth data:", data);

          // Transform the data into table format
          const transformedData = [];

          // Check if data is an array
          if (Array.isArray(data)) {
            data.forEach((record) => {
              transformedData.push({
                key: record.week,
                week: record.week,
                fetalWeight: record.fetalWeight,
                femurLength: record.femurLength,
                headCircumference: record.headCircumference,
              });
            });
          }

          console.log("Transformed data:", transformedData);
          return transformedData;
        } catch (parseError) {
          console.error("Parse error:", parseError);
          return [];
        }
      } catch (error) {
        console.error("Get fetus growth data error:", error);
        return [];
      }
    },
  },
  standards: {
    getPregnancyStandards: async (fetusNumber) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/standards/pregnancy/fetus/${fetusNumber}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            mode: "cors",
            credentials: "include",
          }
        );

        const responseText = await response.text();
        console.log("Raw standards response:", responseText);

        if (!response.ok) {
          console.error("Standards API error:", response.status, responseText);
          throw new Error(`Failed to fetch standards: ${response.status}`);
        }

        try {
          const data = JSON.parse(responseText);
          console.log("Parsed standards data:", data);

          // Transform data to include min/max values
          const transformedData = data.map((standard) => ({
            week: standard.week,
            avgWeight: standard.avgWeight,
            minWeight: standard.minWeight,
            maxWeight: standard.maxWeight,
            avgLength: standard.avgLength,
            minLength: standard.minLength,
            maxLength: standard.maxLength,
            avgHeadCircumference: standard.avgHeadCircumference,
            minHeadCircumference: standard.minHeadCircumference,
            maxHeadCircumference: standard.maxHeadCircumference,
          }));

          console.log("Transformed standards with min/max:", transformedData);
          return transformedData;
        } catch (parseError) {
          console.error("Standards parse error:", parseError);
          console.error("Response that failed to parse:", responseText);
          return [];
        }
      } catch (error) {
        console.error("Get standards error:", error);
        return [];
      }
    },
  },
  payment: {
    createPaymentUrl: async (userId, packageId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Add returnUrl parameter
        const returnUrl = `${window.location.origin}/confirm`;

        const response = await fetch(
          `${API_BASE_URL}/api/payment/create/${userId}/${packageId}?returnUrl=${encodeURIComponent(returnUrl)}`,
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
          throw new Error(errorText || "Failed to create payment URL");
        }

        const paymentUrl = await response.text();
        return { paymentUrl: paymentUrl.trim() };
      } catch (error) {
        console.error("Create VNPay URL error:", error);
        throw error;
      }
    },

    processPaymentReturn: async (queryParams) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Get order info from VNPay response
        const orderInfo = queryParams.get('vnp_OrderInfo');
        const [userId, packageId] = orderInfo.split('_');
        const responseCode = queryParams.get('vnp_ResponseCode');

        if (responseCode === '00') {
          // Create subscription with the package
          const response = await fetch(
            `${API_BASE_URL}/api/subscriptions/subscribe/${packageId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                transactionId: queryParams.get('vnp_TransactionNo'),
                amount: parseInt(queryParams.get('vnp_Amount')) / 100,
                bankCode: queryParams.get('vnp_BankCode'),
                paymentDate: queryParams.get('vnp_PayDate')
              })
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to process payment");
          }

          const result = await response.json();
          return {
            success: true,
            ...result
          };
        } else {
          throw new Error("Payment failed: Transaction declined");
        }
      } catch (error) {
        console.error("Process payment return error:", error);
        throw error;
      }
    },

    getSubscriptionHistory: async (userId) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch(
          `${API_BASE_URL}/api/membership/subscriptions/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscription history");
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Get subscription history error:", error);
        throw error;
      }
    },
  },
};

export default api;