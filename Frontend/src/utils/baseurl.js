// const baseUrl = process.env.REACT_APP_BACKEND_URL
//   ? `${process.env.REACT_APP_BACKEND_URL}/api`
//   : "undefined";

// console.log("🔎 Base URL being used:", baseUrl);

// export default baseUrl;

const baseUrl =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api";

console.log("🔎 Base URL being used:", baseUrl);

export default baseUrl;
