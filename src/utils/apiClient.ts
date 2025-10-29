export async function apiClient(url: string, options: RequestInit = {}, headerType: string = "application/json") {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": headerType,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { headers, ...options});

  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/signin";
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "新規登録に失敗しました");
  }

  return data;
}
