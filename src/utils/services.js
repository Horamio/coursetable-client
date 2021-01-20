import { config } from "../config";
import { cleanObject } from "./helpers";

const BASE_URL = config.url.API_URL;

export const request = async (url, options) => {
  return fetch(BASE_URL + url, options).then((resp) => resp.json());
};

export const requestBuilder = (base) => (params, options) => {
  let urlParams = new URLSearchParams(cleanObject(params));
  let url = `/${base}?${urlParams.toString()}`;
  return request(url, options);
};

export const getColleges = requestBuilder("colleges");
export const getFaculties = requestBuilder("faculties");
export const getSpecialities = requestBuilder("specialities");
export const getCourses = requestBuilder("courses");
export const getSections = requestBuilder("sections");
