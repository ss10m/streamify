const API_URL =
    process.env.NODE_ENV === "development"
        ? "http://0.0.0.0:8080"
        : "https://streamify.ssprojects.ca";

export { API_URL };
