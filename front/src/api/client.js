const BASE_URL = "http://localhost:5000";

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  // gestion erreur de token
  if (response.status == 401) {
    localStorage.removeItem("token"); // suppression du token dans le local storage
    window.location.href = "/"; // redirection vers l'URL de base http://localhost:5173
  }

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return null;
}

export function get(url) {
  return request(url, { method: "GET" });
}

export function post(url, body) {
  return request(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put(url, body) {
  return request(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del(url) {
  return request(url, { method: "DELETE" });
}
