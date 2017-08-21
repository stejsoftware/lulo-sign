import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

import io from "socket.io-client";
import feathers from "feathers-client";
import reduxifyServices, { getServicesStatus } from "feathers-redux";

import configureStore from "./store";
import App from "./App";

// Configure Feathers

const feathersClient = feathers()
  .configure(feathers.socketio(io(), { timeout: 60000 }))
  .configure(feathers.hooks());

// Configure Redux

const services = reduxifyServices(feathersClient, ["count", "light"]);
const store = configureStore(services);

// Render App

render(
  <Provider store={store}>
    <App services={services} getServicesStatus={getServicesStatus} />
  </Provider>,
  document.getElementById("root")
);
