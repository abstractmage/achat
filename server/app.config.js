module.exports = {
  port: 3001,
  host: process.env.NODE_ENV === 'development' ? 'localhost' : 'test.test',
  backDomain: process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://test.test',
  frontDomain: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://asd.asd',
  mongoose: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  auth: {
    secret: 'CEKPET KEY',
    options: {
      access: {
        expiresIn: 600
      },
      refresh: {
        expiresIn: 604800
      }
    }
  }
};
