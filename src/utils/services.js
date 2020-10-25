const BASE_URL = "https://coursetable-api.herokuapp.com/";

const request = async (url, options) => {
  return fetch(BASE_URL + url, options).then((resp) => resp.json());
};

export default request;
