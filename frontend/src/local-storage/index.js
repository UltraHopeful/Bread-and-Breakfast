export const setLoggedInUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
}

export const getLoggedInUser = () => {
  return JSON.parse(localStorage.getItem('user'));
}

export const getUserName = () => {
  const local = JSON.parse(JSON.stringify(localStorage));
  const keys = Object.keys(local);

  for (const key of keys){
    if(key.includes("userData")){
      console.log(key);
      return JSON.parse(local[key])['Username'];
    }
  }
}