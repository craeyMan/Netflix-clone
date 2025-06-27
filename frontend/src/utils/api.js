import axios from "axios";

const API_TOKEN = process.env.REACT_APP_TMDB_BEARER;

const Api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export default Api;