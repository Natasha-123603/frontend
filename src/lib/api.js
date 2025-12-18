const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://airbnb-production-57d7.up.railway.app/api";

console.log("🔧 API_BASE_URL configured as:", API_BASE_URL);


async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    // Try to parse JSON error first
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || fallbackMessage);
    } catch (parseError) {
      // If JSON parsing fails, try text
      try {
        const text = await response.text();
        throw new Error(text || fallbackMessage);
      } catch {
        throw new Error(fallbackMessage);
      }
    }
  }
  return response.json();
}

export async function getAllProperties() {
  console.log("🔵 API Call: getAllProperties", `${API_BASE_URL}/properties`);
  const res = await fetch(`${API_BASE_URL}/properties`);
  console.log("🔵 API Response:", res.status, res.statusText);
  return handleResponse(res, "Failed to fetch properties");
}

export async function getPropertyById(id) {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`);
  return handleResponse(res, "Failed to fetch property");
}

export async function createProperty(data) {
  const res = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create property");
}

export async function updateProperty(id, data) {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update property");
}

export async function deleteProperty(id) {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete property");
}

export async function getAllUsers() {
  console.log("🔵 API Call: getAllUsers", `${API_BASE_URL}/users`);
  const res = await fetch(`${API_BASE_URL}/users`);
  console.log("🔵 API Response:", res.status, res.statusText);
  return handleResponse(res, "Failed to fetch users");
}

export async function getUserById(id) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`);
  return handleResponse(res, "Failed to fetch user");
}

export async function createUser(data) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create user");
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update user");
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete user");
}

export async function loginUser(data) {
  console.log("🔵 API Call: loginUser", `${API_BASE_URL}/auth/login`, data);
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("🔵 API Response status:", res.status, res.statusText);
    const result = await handleResponse(res, "Failed to login");
    console.log("✅ Login successful:", result);
    return result;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

export async function registerUser(data) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to register user");
}

export async function getAllGuests() {
  console.log("🔵 API Call: getAllGuests", `${API_BASE_URL}/guests`);
  const res = await fetch(`${API_BASE_URL}/guests`);
  console.log("🔵 API Response:", res.status, res.statusText);
  return handleResponse(res, "Failed to fetch guests");
}

export async function getGuestById(id) {
  const res = await fetch(`${API_BASE_URL}/guests/${id}`);
  return handleResponse(res, "Failed to fetch guest");
}

export async function createGuest(data) {
  const res = await fetch(`${API_BASE_URL}/guests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create guest");
}

export async function updateGuest(id, data) {
  const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update guest");
}

export async function deleteGuest(id) {
  const res = await fetch(`${API_BASE_URL}/guests/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete guest");
}

export async function getAllBookings() {
  console.log("🔵 API Call: getAllBookings", `${API_BASE_URL}/bookings`);
  const res = await fetch(`${API_BASE_URL}/bookings`);
  console.log("🔵 API Response:", res.status, res.statusText);
  return handleResponse(res, "Failed to fetch bookings");
}

export async function getBookingById(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`);
  return handleResponse(res, "Failed to fetch booking");
}

export async function createBooking(data) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create booking");
}

export async function updateBooking(id, data) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update booking");
}

export async function deleteBooking(id) {
  const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete booking");
}

export async function getAllPayments() {
  console.log("🔵 API Call: getAllPayments", `${API_BASE_URL}/payments`);
  const res = await fetch(`${API_BASE_URL}/payments`);
  console.log("🔵 API Response:", res.status, res.statusText);
  return handleResponse(res, "Failed to fetch payments");
}

export async function getPaymentById(id) {
  const res = await fetch(`${API_BASE_URL}/payments/${id}`);
  return handleResponse(res, "Failed to fetch payment");
}

export async function createPayment(data) {
  const res = await fetch(`${API_BASE_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create payment");
}

export async function updatePayment(id, data) {
  const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update payment");
}

export async function deletePayment(id) {
  const res = await fetch(`${API_BASE_URL}/payments/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete payment");
}

export async function getAllPermissions() {
  const res = await fetch(`${API_BASE_URL}/permissions`);
  return handleResponse(res, "Failed to fetch permissions");
}

export async function getPermissionById(id) {
  const res = await fetch(`${API_BASE_URL}/permissions/${id}`);
  return handleResponse(res, "Failed to fetch permission");
}

export async function createPermission(data) {
  const res = await fetch(`${API_BASE_URL}/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create permission");
}

export async function updatePermission(id, data) {
  const res = await fetch(`${API_BASE_URL}/permissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update permission");
}

export async function deletePermission(id) {
  const res = await fetch(`${API_BASE_URL}/permissions/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete permission");
}

export async function getAllTasks() {
  console.log("🔵 API Call: getAllTasks", `${API_BASE_URL}/tasks`);
  const res = await fetch(`${API_BASE_URL}/tasks`);
  console.log("🔵 API Response:", res.status, res.statusText);
  return handleResponse(res, "Failed to fetch tasks");
}

export async function getTasksByStatus(status) {
  const res = await fetch(
    `${API_BASE_URL}/tasks?status=${encodeURIComponent(status)}`
  );
  return handleResponse(res, "Failed to fetch tasks by status");
}

export async function createTask(data) {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create task");
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update task");
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete task");
}

export async function getUserRoles() {
  const res = await fetch(`${API_BASE_URL}/users/roles/list`);
  return handleResponse(res, "Failed to fetch roles");
}

// Auth API functions
export async function getCurrentUser() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('luxeboard.authToken') : null;
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return handleResponse(res, "Failed to fetch user data");
}

export async function updateProfile(data) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('luxeboard.authToken') : null;
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res, "Failed to update profile");
}

export async function changePassword(currentPassword, newPassword) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('luxeboard.authToken') : null;
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const res = await fetch(`${API_BASE_URL}/auth/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  return handleResponse(res, "Failed to change password");
}

