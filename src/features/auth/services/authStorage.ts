import { accessTokenStorage } from '../../../shared/storage/accessTokenStorage';
import { refreshTokenStorage } from '../../../shared/storage/refreshTokenStorage';
import { userStorage } from '../../../shared/storage/userStorage';
import type { AuthResponse } from '../types/auth';

export async function saveAuthSession(session: AuthResponse): Promise<void> {
  await Promise.all([
    accessTokenStorage.set(session.accessToken),
    userStorage.set<AuthResponse['user']>(session.user),
    session.refreshToken
      ? refreshTokenStorage.set(session.refreshToken)
      : refreshTokenStorage.remove(),
  ]);
}

export async function getAuthSession(): Promise<AuthResponse | null> {
  const [accessToken, refreshToken, storedUser] = await Promise.all([
    accessTokenStorage.get(),
    refreshTokenStorage.get(),
    userStorage.get<AuthResponse['user']>(),
  ]);

  if (!accessToken || !storedUser) {
    return null;
  }

  return { accessToken, refreshToken: refreshToken ?? undefined, user: storedUser };
}

export function clearAuthSession(): Promise<void> {
  return Promise.all([
    accessTokenStorage.remove(),
    refreshTokenStorage.remove(),
    userStorage.remove(),
  ]).then(() => undefined);
}

export const getAccessToken = accessTokenStorage.get;
export const getRefreshToken = refreshTokenStorage.get;