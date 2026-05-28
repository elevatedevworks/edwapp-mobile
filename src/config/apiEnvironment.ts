// src/config/apiEnvironment.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export type ApiEnvironment = 'mac' | 'pi';

const STORAGE_KEY = 'api_environment';

export const API_URLS: Record<ApiEnvironment, string> = {
  mac: 'http://192.168.1.156:3006',
  pi: 'https://edwapp-api.elevatedw.com',
};

export async function getApiEnvironment(): Promise<ApiEnvironment> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);

  if (saved === 'mac' || saved === 'pi') {
    return saved;
  }

  return 'mac';
}

export async function setApiEnvironment(env: ApiEnvironment) {
  await AsyncStorage.setItem(STORAGE_KEY, env);
}

export async function getApiBaseUrl() {
  const env = await getApiEnvironment();
  return API_URLS[env];
}
