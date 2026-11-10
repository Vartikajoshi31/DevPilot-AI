export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "/api/v1"
    : "http://localhost:8000/api/v1");

export const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/v1`
    : "ws://localhost:8000/api/v1");

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  let token = localStorage.getItem("devpilot_token");
  if (!token) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/demo-token`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        token = data.access_token;
        if (token) {
          localStorage.setItem("devpilot_token", token);
          if (data.user) {
            localStorage.setItem("devpilot_user", JSON.stringify(data.user));
          }
        }
      }
    } catch {
      // Fallback silently if offline
    }
  }
  return token;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let token = typeof window !== "undefined" ? localStorage.getItem("devpilot_token") : null;
  if (!token && typeof window !== "undefined") {
    token = await getAuthToken();
  }
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure leading slash formatting
  const url = endpoint.startsWith("/") ? `${API_BASE_URL}${endpoint}` : `${API_BASE_URL}/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Request Failed with status ${response.status}`);
  }

  return response.json();
}
