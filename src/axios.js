import axios from "axios";
const instance = axios.create({
  baseURL: "http://api.opentripmap.com/0.1/en/places",
  // timeout: 1000,
  params: {
    apikey: "5ae2e3f221c38a28845f05b6a018fe7938dbde7c551cfe3d26b3e242",
  },
  headers: { "X-Custom-Header": "foobar" },
});

export default instance;
