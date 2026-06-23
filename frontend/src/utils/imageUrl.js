import { backend_url } from "../server";

export const getImageUrl = (image) => {
  const url = typeof image === "string" ? image : image?.url;

  if (!url) {
    return "";
  }

  if (/^(https?:|data:|blob:)/.test(url)) {
    return url;
  }

  const normalizedBackendUrl = backend_url.endsWith("/")
    ? backend_url.slice(0, -1)
    : backend_url;
  const normalizedImageUrl = url.startsWith("/") ? url : `/${url}`;

  return `${normalizedBackendUrl}${normalizedImageUrl}`;
};
