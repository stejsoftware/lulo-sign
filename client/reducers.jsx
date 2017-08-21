import { combineReducers } from "redux";

export default function(reduxifiedServices) {
  return combineReducers({
    count: reduxifiedServices.count.reducer,
    light: reduxifiedServices.light.reducer
  });
}
