import server from './server';

let port = 5000;

if (process.env.NODE_ENV === 'production' && process.env.PORT) {
  port = parseFloat(process.env.PORT);
}

server.start(port);
