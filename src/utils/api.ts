import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-2ba89cfc`;

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  let data;

  try {
    data = await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    const statusError = `API request failed with status ${response.status}`;
    throw new Error(statusError);
  }

  if (!response.ok) {
    throw new Error(data.error || `API request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  signup: (email: string, password: string, name: string) =>
    apiCall('/signup', { method: 'POST', body: { email, password, name } }),

  createProfile: (profileData: any, token: string) =>
    apiCall('/profile', { method: 'POST', body: profileData, token }),

  getProfile: (token: string) =>
    apiCall('/profile', { token }),

  generateRoadmap: (token: string) =>
    apiCall('/generate-roadmap', { method: 'POST', token }),

  getRoadmap: (token: string) =>
    apiCall('/roadmap', { token }),

  updateProgress: (progressData: any, token: string) =>
    apiCall('/progress', { method: 'POST', body: progressData, token }),

  getProgress: (token: string) =>
    apiCall('/progress', { token }),

  chat: (message: string, conversationHistory: any[], token: string) =>
    apiCall('/chat', { method: 'POST', body: { message, conversationHistory }, token }),

  getChatHistory: (token: string) =>
    apiCall('/chat/history', { token }),

  saveAssessment: (assessmentData: any, token: string) =>
    apiCall('/assessment', { method: 'POST', body: assessmentData, token }),

  saveChallenge: (challengeData: any, token: string) =>
    apiCall('/challenge', { method: 'POST', body: challengeData, token }),

  getAchievements: (token: string) =>
    apiCall('/achievements', { token }),

  updateAchievement: (achievementData: any, token: string) =>
    apiCall('/achievements', { method: 'POST', body: achievementData, token }),

  generateTopicContent: (topicData: any, token: string) =>
    apiCall('/generate-topic-content', { method: 'POST', body: topicData, token }),

  getTopicContent: (moduleId: string, topic: string, token: string) =>
    apiCall(`/topic-content/${encodeURIComponent(moduleId)}/${encodeURIComponent(topic)}`, { token }),
};
