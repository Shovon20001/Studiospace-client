// All API calls go through the /server proxy so the HTTPOnly JWT cookie is attached automatically.
export async function apiFetch(path, options = {}) {
  const run = () =>
    fetch(`/server${path}`, {
      ...options,
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });

  let res = await run();
  // The JWT cookie may be missing right after login/Google redirect: mint it once and retry.
  if (res.status === 401) {
    const minted = await fetch("/api/token");
    if (minted.ok) res = await run();
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}

export const json = (method, body) => ({ method, body: JSON.stringify(body) });
