export function getCurrentAdmin() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}
