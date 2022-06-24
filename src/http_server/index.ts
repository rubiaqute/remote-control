import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import Jimp from 'jimp';
import robot from 'robotjs';
import { WebSocketServer, createWebSocketStream } from 'ws';


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

    wsStream.on('data', (data: string) => {
        const command = data.split(' ')[0]
        const distance = +data.split(' ')[1]

        const { x, y } = robot.getMousePos()
        robot.setMouseDelay(100)

        switch (command) {
            case 'mouse_up': {
                robot.moveMouseSmooth(x, y - distance);
                wsStream.write(`${command}:{${y}px}`);
                break
            }
            case 'mouse_down': {
                robot.moveMouseSmooth(x, y + distance);
                wsStream.write(`${command}:{${y}px}`);
                break
            }
            case 'mouse_left': {
                robot.moveMouseSmooth(x - distance, y);
                wsStream.write(`${command}:{${x}px}`);
                break
            }
            case 'mouse_right': {
                robot.moveMouseSmooth(x + distance, y);
                wsStream.write(`${command}:{${x}px}`);
                break
            }
            case 'mouse_position': {
                wsStream.write(`mouse_position ${x},${y}`);
                break
            }
            default: {
                wsStream.write(`unknown_command_${command}`);
                break
            }
        }
    })

    // ws.on('message', (data: Buffer) => {
    //     pipeline(wsStream, ()=>{})
    //     console.log(data.toString())
    //     const command = data.toString().split(' ')[0]
    //     const distance = +data.toString().split(' ')[1]
    //     const { x, y } = robot.getMousePos()
    //     robot.setMouseDelay(100)

    //     switch (command) {
    //         case 'mouse_up': {
    //             robot.moveMouseSmooth(x, y - distance);
    //             const sensStrem =ws.send(`${command}:{${y}px}`);
    //             break
    //         }
    //         case 'mouse_down': {
    //             robot.moveMouseSmooth(x, y + distance);
    //             ws.send(`${command}:{${y}px}`);
    //             break
    //         }
    //         case 'mouse_left': {
    //             robot.moveMouseSmooth(x - distance, y);
    //             ws.send(`${command}:{${x}px}`);
    //             break
    //         }
    //         case 'mouse_right': {
    //             robot.moveMouseSmooth(x + distance, y);
    //             ws.send(`${command}:{${x}px}`);
    //             break
    //         }
    //         case 'mouse_position': {
    //             ws.send(`mouse_position ${x},${y}`);
    //             break
    //         }
    //         default: {
    //             ws.send(`unknown_command_${command}`);
    //             break
    //         }
    //     }

    // });

});

