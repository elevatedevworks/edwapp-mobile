import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'edw-mobile-auth-token';

export async function saveAuthToken(token: string) {
  await Keychain.setGenericPassword('authToken', token, {
    service: TOKEN_SERVICE,
  });
}

export async function getAuthToken() {
  const credentials = await Keychain.getGenericPassword({
    service: TOKEN_SERVICE,
  });

  if (!credentials) {
    return null;
  }

  return credentials.password;
}

export async function deleteAuthToken() {
  await Keychain.resetGenericPassword({
    service: TOKEN_SERVICE,
  });
}
