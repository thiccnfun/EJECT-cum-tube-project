import { w as writable } from "./index.js";
import { g as goto } from "./navigation.js";
import jwt_decode from "jwt-decode";
let empty = {
  username: "",
  admin: false,
  bearer_token: ""
};
function createStore() {
  const { subscribe, set } = writable(empty);
  const userdata = localStorage.getItem("user");
  if (userdata) {
    set(JSON.parse(userdata));
  }
  return {
    subscribe,
    init: (access_token) => {
      const decoded = jwt_decode(access_token);
      const userdata2 = {
        bearer_token: access_token,
        username: decoded.username,
        admin: decoded.admin
      };
      set(userdata2);
      localStorage.setItem("user", JSON.stringify(userdata2));
    },
    invalidate: () => {
      console.log("Log out user");
      set(empty);
      localStorage.removeItem("user");
      goto("/");
    }
  };
}
const user = createStore();
export {
  user as u
};
