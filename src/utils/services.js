import { config } from "../config";
import param from "jquery-param";

const BASE_URL = config.url.API_URL;

export const request = async (url, options) => {
  return fetch(BASE_URL + url, options).then((resp) => resp.json());
};

export const getColleges = () => {
  return request("/colleges");
};

export const getFaculties = (college = "") => {
  let url = "/faculties?";
  if (college) url += `college_id=${college}&`;

  return request(url);
};

export const getSpecialities = (college = "", faculty = "") => {
  let url = "/specialities?";
  if (college) url += `college_id=${college}&`;
  if (faculty) url += `faculty_id=${faculty}&`;

  return request(url);
};

export const getCourses = (
  college = "",
  faculty = "",
  speciality = "",
  semester = ""
) => {
  let url = "/courses?";
  if (college) url += `college_id=${college}&`;
  if (faculty) url += `faculty_id=${faculty}&`;
  if (speciality) url += `speciality_id=${speciality}&`;
  if (semester) url += `semester=${semester}&`;

  return request(url);
};

export const getSections = (course = "") => {
  let url = "/sections?";
  if (course) url += `course_id=${course}&`;

  return request(url);
};

export const getSchedules = (courses) => {
  let url = "/section_associations/generate_schedules?";
  // const courses = { a: "m" };
  let courseParams = param({ courses });
  // console.log({ courses, courseParams });
  url += courseParams;
  return request(url);
};
