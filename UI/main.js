const express = require('express');
require("dotenv").config({ path: 'ui.env' })

const { createProxyMiddleware } = require('http-proxy-middleware');
const apiProxyTarget = process.env.API_PROXY_TARGET;

const app = express();
app.use(express.static('public'));
if (apiProxyTarget) {
  app.use('/graphql', createProxyMiddleware({ target: apiProxyTarget }));
}

const port = process.env.UI_PORT || 3999
app.listen(port, function () {
  console.log(`App started on port ${port}`);
});