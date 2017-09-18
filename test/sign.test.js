const fetch = require("node-fetch");

const putJson = (url, json) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(json)
    })
      .then(res => {
        if (res.status == 200) {
          resolve(res.json());
        } else {
          reject(new Error(`${res.status} ${res.statusText}`));
        }
      })
      .catch(e => reject(e));
  });
};

const getJson = url => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(res => {
        if (res.status == 200) {
          resolve(res.json());
        } else {
          reject(new Error(`${res.status} ${res.statusText}`));
        }
      })
      .catch(e => reject(e));
  });
};

const getCount = () => {
  return getJson("http://lulo-sign:3030/count/1");
};

const setCount = number => {
  return putJson("http://lulo-sign:3030/count/1", { number });
};

const setLight = state => {
  return putJson("http://lulo-sign:3030/light/1", { state });
};

setInterval(() => {
  getCount()
    .then(data => {
      var number = data.number + 1;
      var light = number > 0 && number % 10 in [0, 1, 2];

      console.log({ number, light });

      setCount(number);
      setLight(light);
    })
    .catch(e => console.error(e));
}, 1000);
