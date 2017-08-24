import { combineReducers } from "redux";

export default function(reduxifiedServices) {
  return combineReducers({
    count: reduxifiedServices.count.reducer,
    light: reduxifiedServices.light.reducer,
    sign: (state = {}, action) => {
      switch (action.type) {
        case "SERVICES_COUNT_UPDATED":
        case "SERVICES_COUNT_GET_FULFILLED":
          return Object.assign({}, state, {
            count: action.payload
          });
        case "SERVICES_LIGHT_UPDATED":
        case "SERVICES_LIGHT_GET_FULFILLED":
          return Object.assign({}, state, {
            light: action.payload
          });
        default:
          return state;
      }
    }
  });
}
