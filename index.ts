import Jimp from 'jimp';
import { httpServer } from './src/http_server/index';
import robot from 'robotjs';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);


