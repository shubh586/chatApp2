export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "/api/auth";
export const SEARCH_ROUTES = "/api/search";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/signin`;
export const UPDATE_USER_ROUTE = `${AUTH_ROUTES}/update-user`;
export const GET_USER_INFO = `${AUTH_ROUTES}/get-user`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const DELETE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/delete-profile-image`;
export const LOGOUT_USER = `${AUTH_ROUTES}/log-out`;
export const SEARCH_CONTACTS = `${SEARCH_ROUTES}/search-contacts`;
