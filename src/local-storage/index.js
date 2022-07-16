export const setLoggedInUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
}

export const getLoggedInUser = () => {
  return JSON.parse(localStorage.getItem('user'));
}