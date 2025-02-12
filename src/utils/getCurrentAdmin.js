export async function getCurrentAdmin() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    // Return parsed user data from localStorage
    return JSON.parse(storedUser);
  }
  // If not found, return null to trigger login prompt
  return null;
}
