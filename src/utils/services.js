const BASE_URL = "https://coursetable-api.herokuapp.com/";

export const request = async (url, options) => {
  return fetch(BASE_URL + url, options).then((resp) => resp.json());
};

export const getColleges = () => {
  return request("/colleges");
};

export const getFaculties = (college = "") => {
  let url = "/faculties?";
  if (college) url += `college=${college}&`;

  return request(url);
};

export const getSpecialities = (college = "", faculty = "") => {
  let url = "/specialities?";
  if (college) url += `college=${college}&`;
  if (faculty) url += `faculty=${faculty}&`;

  return request(url);
};

export const getCourses = (
  college = "",
  faculty = "",
  speciality = "",
  semester = ""
) => {
  let url = "/courses?";
  if (college) url += `college=${college}&`;
  if (faculty) url += `faculty=${faculty}&`;
  if (speciality) url += `speciality=${speciality}&`;
  if (semester) url += `semester=${semester}&`;

  return request(url);
};
