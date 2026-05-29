function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

export async function buildListingPayload(data, { cities = [], agents = [] } = {}) {
  const city = cities.find((c) => String(c.id) === String(data.city_id));
  const agent = agents.find((a) => String(a.id) === String(data.agent_id));

  return {
    address: data.address,
    image: await fileToDataUrl(data.image[0]),
    region_id: Number(data.region_id),
    city_id: Number(data.city_id),
    city: city
      ? {
          id: Number(city.id),
          name: city.name,
          region_id: Number(city.region_id),
        }
      : null,
    zip_code: data.zip_code,
    price: Number(data.price),
    area: Number(data.area),
    bedrooms: Number(data.bedrooms),
    description: data.description,
    is_rental: Number(data.is_rental),
    agent_id: Number(data.agent_id),
    agent: agent || null,
    created_at: new Date().toISOString(),
  };
}

export async function buildCreateAgentPayload(data) {
  return {
    name: data.name,
    surname: data.surname,
    email: data.email,
    phone: data.phone,
    avatar: await fileToDataUrl(data.avatar[0]),
  };
}
