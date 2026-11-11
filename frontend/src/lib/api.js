const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tn-backend-1.onrender.com';

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

function jsonOptions(method, body, token) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-auth-token': token } : {}),
    },
    body: JSON.stringify(body),
  };
}

export async function createProgram(name) {
  return request('/api/programs', jsonOptions('POST', { name }));
}

export async function createMentor(data) {
  return request('/api/mentors', jsonOptions('POST', data));
}

export async function addMentorToProgram(programId, mentorId) {
  return request(`/api/programs/${programId}/add-mentor`, jsonOptions('POST', { mentorId }));
}

export async function getAllPrograms() {
  return request('/api/programs');
}

export async function getAllMentors() {
  return request('/api/mentors');
}

export async function mentorLogin(email, password) {
  return request('/api/mentors/login', jsonOptions('POST', { email, password }));
}

export async function addMentee(token, { email, name, enrollmentNumber, programId }) {
  return request('/api/mentees', jsonOptions('POST', { email, name, enrollmentNumber, programId }, token));
}

export async function addResource(token, resourceData, isQuiz = false) {
  const endpoint = isQuiz ? '/api/resources/quiz' : '/api/resources';
  return request(endpoint, jsonOptions('POST', resourceData, token));
}

export async function getProgramMentees(programId, token) {
  return request(`/api/${programId}/mentees`, {
    headers: { 'x-auth-token': token },
  });
}

export async function getProgramResources(programId, token) {
  return request(`/api/${programId}/resources`, {
    headers: { 'x-auth-token': token },
  });
}
