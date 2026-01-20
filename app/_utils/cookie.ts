import Cookies from 'js-cookie';

export const setAuthCookie = (token: string, user: any) => {
  Cookies.set('token', token, { expires: 7 });
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getAuthCookie = () => {
  const token = Cookies.get('token');
  const user = Cookies.get('user');
  return { token, user: user ? JSON.parse(user) : null };
};

export const clearAuthCookie = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};
