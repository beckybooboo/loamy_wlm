import axios from 'axios';
const BASE_URL = '/api/survey';
const withCredentials = true;

const fetchQuestions = async () => {
  const response = await axios.get(`${BASE_URL}/questions`, { withCredentials });
  return response.data;
};

const fetchUnansweredQuestions = async () => {
  const response = await axios.get(`${BASE_URL}/questions/unanswered`, { withCredentials });
  return response.data;
};

const fetchAnsweredQuestions = async () => {
  const response = await axios.get(`${BASE_URL}/questions/answered`, { withCredentials });
  return response.data;
};

const resetAnswers = async () => {
  await axios.post(`${BASE_URL}/reset`, {}, { withCredentials });
};

const submitAnswers = async (answers) => {
  const response = await axios.post(`${BASE_URL}/answers`, answers, { withCredentials });
  return response.data;
};

const fetchMe = async () => {
  const response = await axios.get(`${BASE_URL}/me`, { withCredentials });
  return response.data;
};

export const surveyService = {
  fetchQuestions,
  fetchUnansweredQuestions,
  fetchAnsweredQuestions,
  resetAnswers,
  submitAnswers,
  fetchMe,
};
