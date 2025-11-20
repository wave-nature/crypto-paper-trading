const CREATED_SUCCESSFULLY = "created successfully";
const UPDATED_SUCCESSFULLY = "updated successfully";
const DELETED_SUCCESSFULLY = "deleted successfully";
const FETCHED_SUCCESSFULLY = "fetched successfully";

export const LOADING_LOGIN = "Logging you in";
export const CREATING_USER = "Creating user";
export const LOGGED_IN_SUCCESSFULLY = "User logged in successfully!";
export const LOGGING_OUT_USER = "Logging out user";
export const LOGGED_OUT_USER = "User logged out successfully!";
export const PASSWORD_MISMATCH = "Password didn't match";
export const ALL_FIELDS_ARE_REQUIRED = "Please fill all fields";

export const SOMETHING_WENT_WRONG = "Something went wrong!";

export function created(module: string) {
  return `${module} ${CREATED_SUCCESSFULLY}`;
}
export function updated(module: string) {
  return `${module} ${UPDATED_SUCCESSFULLY}`;
}
export function deleted(module: string) {
  return `${module} ${DELETED_SUCCESSFULLY}`;
}
export function fetched(module: string) {
  return `${module} ${FETCHED_SUCCESSFULLY}`;
}
