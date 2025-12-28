const KEY = "begorgeous_admin_ok";

export function setAdminAuthed(v) {
  localStorage.setItem(KEY, v ? "true" : "false");
}
export function isAdminAuthed() {
  return localStorage.getItem(KEY) === "true";
}
export function clearAdminAuthed() {
  localStorage.removeItem(KEY);
}
