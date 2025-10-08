export async function getAllUsersClient() {
  const token = localStorage.getItem("access_token");

  const res = await fetch("http://localhost:4000/user/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
