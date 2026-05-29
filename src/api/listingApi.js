// const BASE_URL = "https://api.real-estate-manager.redberryinternship.ge/api";
const BASE_URL = "http://localhost:3000";
const token = "a1d9b040-db27-4aee-9b3a-295bc2d10abd";

export async function getRegions() {
  const response = await fetch(`${BASE_URL}/regions`, {
    method: "GET",
  });

  if (!response.ok) throw new Error();

  return await response.json();
}

export async function getCities() {
  const response = await fetch(`${BASE_URL}/cities`, {
    method: "GET",
  });

  if (!response.ok) throw new Error();

  return await response.json();
}

export async function getAgents() {
  const response = await fetch(`${BASE_URL}/agents`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error();

  return response.json();
}

export async function createAgent(payload) {
  const response = await fetch(`${BASE_URL}/agents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error();

  return response.json();
}

export async function getListings() {
  const response = await fetch(`${BASE_URL}/real-estates`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error();

  return response.json();
}

export async function getListing(id) {
  const response = await fetch(`${BASE_URL}/real-estates/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error();

  return response.json();
}

export async function createListing(payload) {
  const response = await fetch(`${BASE_URL}/real-estates`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error();

  return response.json();
}

export async function deleteListing(id) {
  const response = await fetch(`${BASE_URL}/real-estates/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error();

  return response;
}
