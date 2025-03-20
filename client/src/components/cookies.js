const setCookie = (name, value, days = 30) => { 
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name) => {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const logoutClickHandler = () => {
  deleteCookie("access");
  deleteCookie("refresh");
  localStorage.removeItem("userToken");
  window.location.href = "/";
};

const Cookie = { setCookie, getCookie, deleteCookie, logoutClickHandler };

export default Cookie;

// const setCookie = (cookieName, cookieValue, expairydays = 30) => {
//     const today = new Date();
//     today.setTime(today.getTime() + expairydays * 24 * 60 * 60 * 1000);
//     console.log('setting  cookie');
//     let expires = "expires=" + today.toUTCString();
//     document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
//   };
  
//   const getCookie = (cookieName) => {
//     let name = cookieName + "=";
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let cookieList = decodedCookie.split(";");
//     for (let i = 0; i < cookieList.length; i++) {
//       let cookie = cookieList[i];
//       while (cookie.charAt(0) === " ") {
//         cookie = cookie.substring(1);
//       }
//       if (cookie.indexOf(name) === 0) {
//         return cookie.substring(name.length, cookie.length);
//       }
//     }
//     return null;
//   };
  
//   const logoutClickHandler = () => {
//     Cookie.deleteCookie('access');
//     Cookie.deleteCookie('refresh');
//     window.location.href = '/';
//   };

//   const deleteCookie = (cookieName) => {
//     document.cookie =
//       cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//   };

  
//   const Cookie = {
//     setCookie: setCookie,
//     getCookie: getCookie,
//     deleteCookie: deleteCookie,
//     logoutClickHandler: logoutClickHandler
//   };
  
//   export default Cookie;