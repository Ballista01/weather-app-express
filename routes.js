const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const asyncHandler = require('express-async-handler');

module.exports = function (app, database) {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.route('/hello').get((req, res) => {
    res.send({ helloMsg: 'Hello World!' });
  });
  app.route('/weather').get((req, res) => {
    // console.log(`sending react file ${process.cwd()}/client/public/index.html`);
    // console.log(`dir: ${__dirname}`);
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
    // res.redirect('http://localhost:3000');
  });

  app.route('/geo/api/coords').get(
    asyncHandler(async (req, res) => {
      const { latitude, longitude } = req.query;
      console.log(`x-forwarded-for: ${req.headers['x-forwarded-for']}`);
      console.log(req.headers);
      console.log(`latitude: ${latitude}, longitude: ${longitude}`);
      const response = await fetch(
        `https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=${latitude}&lon=${longitude}&accept-language=en&polygon_threshold=0.0`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '4df3927c4emsh79df6aa6434b683p1bae0bjsnfc287b792f74',
            'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com',
          },
        },
      );
      const body = await response.json();
      if (body.display_name == undefined) {
        throw Error(`Unable to get address from coordinate ${latitude} ${longitude}`);
      }
      const address = { ...body.address, display_name: body.display_name };
      console.log(address);
      res.send(address);
    }),
  );

  app.route('/weather/api/coords').get(
    asyncHandler(async (req, res) => {
      const { lat, lon } = req.query;
      const response = await fetch(
        `https://weatherapi-com.p.rapidapi.com/current.json?q=${lat},${lon}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '4df3927c4emsh79df6aa6434b683p1bae0bjsnfc287b792f74',
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
          },
        },
      );
      const body = await response.json();
      res.send(body);
    }),
  );

  app.route('/geo/api/coords/test').get(
    asyncHandler(async (req, res) => {
      const response = await fetch(
        'https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=41.8755616&lon=-87.6244212&accept-language=en&polygon_threshold=0.0',
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': 'e010855dbfmshed7acac4d8c9cbcp15d615jsn50d769834e79',
            'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com',
          },
        },
      );
      const body = await response.json();
      const address = { ...body.address, display_name: body.display_name };
      console.log(address);
      res.send(address);
    }),
  );
};
