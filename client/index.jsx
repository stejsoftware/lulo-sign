import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import io from "socket.io-client";
import feathers from "feathers-client";
import reduxifyServices from "feathers-redux";

import configureStore from "./store";
import App from "./App";

// Configure Feathers

const feathersClient = feathers()
  .configure(feathers.socketio(io()))
  .configure(feathers.hooks());

// Configure Redux

const services = reduxifyServices(feathersClient, ["count", "light"]);
const store = configureStore(services);

const SERVICES_COUNT_UPDATED = "SERVICES_COUNT_UPDATED";
const SERVICES_LIGHT_UPDATED = "SERVICES_LIGHT_UPDATED";

feathersClient.service("/count").on("updated", data => {
  store.dispatch({
    type: SERVICES_COUNT_UPDATED,
    payload: data
  });
});

feathersClient.service("/light").on("updated", data => {
  store.dispatch({
    type: SERVICES_LIGHT_UPDATED,
    payload: data
  });
});

// Render App

render(
  <Provider store={store}>
    <App services={services} />
  </Provider>,
  document.getElementById("root")
);
