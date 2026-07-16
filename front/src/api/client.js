const BASE_URL = "http://localhost:5000/api";

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

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
