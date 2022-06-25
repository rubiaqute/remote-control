import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import robot from 'robotjs';
import { WebSocketServer, createWebSocketStream } from 'ws';
import { drawCircle } from './circle';
import { drawRectangle } from './rectangle';
import { printScreen } from './print-screen';


export const httpServer = http.createServer(function (req, res) {
    const __dirname = path.resolve(path.dirname(''));
    const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
    fs.readFile(file_path, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocketServer) => {
    const wsStream = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false })
    wsStream.write(`WS_params:${JSON.stringify(ws._socket.address())}`)

    wsStream.on('data', async (data: string) => {
        const command = data.split(' ')[0]
        const distance = +data.split(' ')[1]

        const { x, y } = robot.getMousePos()
        robot.setMouseDelay(100)

        switch (command) {
            case 'mouse_up': {
                robot.moveMouseSmooth(x, y - distance);
                wsStream.write(`${command}`);
                break
            }
            case 'mouse_down': {
                robot.moveMouseSmooth(x, y + distance);
                wsStream.write(`${command}`);
                break
            }
            case 'mouse_left': {
                robot.moveMouseSmooth(x - distance, y);
                wsStream.write(`${command}`);
                break
            }
            case 'mouse_right': {
                robot.moveMouseSmooth(x + distance, y);
                wsStream.write(`${command}`);
                break
            }
            case 'mouse_position': {
                wsStream.write(`${command} ${x},${y}`);
                break
            }
            case 'draw_circle': {
                drawCircle(distance)
                wsStream.write(`${command}`);
                break
            }
            case 'draw_square': {
                drawRectangle(distance)
                wsStream.write(`${command}`);
                break
            }
            case 'draw_rectangle': {
                const length = +data.split(' ')[2]
                drawRectangle(distance, length)
                wsStream.write(`${command}`);
                break
            }
            case 'prnt_scrn': {
                const print = await printScreen()
                wsStream.write(`${command} ${print.split(',')[1]}`);
                break
            }
            default: {
                wsStream.write(`unknown_command_${command}`);
                break
            }
        }
    })

});

