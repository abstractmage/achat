module.exports = {
  appName: 'AChat',
  apiURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : 'http://huy.asd',
  backendURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://huy.asd',
};
