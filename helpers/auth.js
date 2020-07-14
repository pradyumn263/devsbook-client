import cookie from "js-cookie";
import Router from "next/router";

//Set in cookie
export const setCookie = (key, value) => {
	if (process.browser) {
		cookie.set(key, value, {
			expires: 1,
		});
	}
};

//Remove From cookie
export const removeCookie = (key) => {
	if (process.browser) {
		cookie.remove(key);
	}
};

//Get from cookie (stored token)
//Used to make req to server with auth token
export const getCookieFromBrowser = (key) => {
	return cookie.get(key);
};

export const getCookieFromServer = (key, req) => {
	if (!req.headers.cookie) {
		return undefined;
	}
	// console.log("req.header.cookie", req.headers.cookie);
	let token = req.headers.cookie
		.split(";")
		.find((c) => c.trim().startsWith(`${key}=`));
	if (!token) return undefined;

	let tokenValue = token.split("=")[1];
	// console.log("Get Cookie from Server: ", tokenValue);
	return tokenValue;
};

export const getCookie = (key, req) => {
	// if (process.browser) {
	// 	return cookie.get(key);
	// }

	return process.browser
		? getCookieFromBrowser(key)
		: getCookieFromServer(key, req);
};

//set in local storage
export const setLocalStorage = (key, value) => {
	if (process.browser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

//remove from local storage
export const removeLocalStorage = (key) => {
	if (process.browser) {
		localStorage.removeItem(key);
	}
};

//Authenticate user, passing data to cookie and local storage
//during sign in
export const authenticate = (response, next) => {
	setCookie("token", response.data.token);
	setLocalStorage("user", response.data.user);
	next();
};

//Access user info from local Storage
export const isAuth = () => {
	if (process.browser) {
		const cookieChecked = getCookie("token");
		if (cookieChecked) {
			if (localStorage.getItem("user")) {
				return JSON.parse(localStorage.getItem("user"));
			} else {
				return false;
			}
		}
	}
};

export const logout = () => {
	//Remove user info, and token from local storage and cookie
	//respectively
	removeLocalStorage("user");
	removeCookie("token");
	Router.push("/login");
};

//My own function to get the userName
export const updateUser = (user, next) => {
	if (process.browser) {
		if (localStorage.getItem("user")) {
			let auth = JSON.parse(localStorage.getItem("user"));
			auth = user;
			localStorage.setItem("user", JSON.stringify(auth));
			next();
		}
	}
};
