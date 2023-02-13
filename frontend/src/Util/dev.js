export const isMaintaining = false;
export const isDev = process.env.NODE_ENV !== "production";

export const url_base =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_HOST || "http://127.0.0.1:8000";
export const api_url = (url) => {
  return url_base + url;
};
