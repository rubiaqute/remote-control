import robot from 'robotjs';
import Jimp from 'jimp';

export const printScreen = async () => {
    const { x, y } = robot.getMousePos()
    const print = robot.screen.capture(x - 50, y + 50, 200, 200)
    const result = new Jimp({
        "data": print.image,
        "width": 200,
        "height": 200
    })

    return await result.getBase64Async(Jimp.MIME_JPEG)
};