export const getToken = () => localStorage.getItem('mediscan_token');
export const setToken = (token) => localStorage.setItem('mediscan_token', token);
export const removeToken = () => localStorage.removeItem('mediscan_token');

export const getUserData = () => {
  try {
    const data = localStorage.getItem('mediscan_user');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setUserData = (user) => {
  localStorage.setItem('mediscan_user', JSON.stringify(user));
};

export const removeUserData = () => {
  localStorage.removeItem('mediscan_user');
};

export const clearAuth = () => {
  removeToken();
  removeUserData();
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
