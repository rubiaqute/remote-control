import robot from 'robotjs';

export const drawRectangle = (sideA: number, sideB?: number) => {
    const width = sideA
    const length = sideB ? sideB : sideA
    let coords = robot.getMousePos();
    robot.mouseToggle('down')
    for (let i = 0; i <= width; i += 5) {
        const x = coords.x + i;
        robot.dragMouse(x, coords.y);
    }
    coords = robot.getMousePos();
    for (let i = 0; i <= length; i += 5) {
        const y = coords.y + i;
        robot.dragMouse(coords.x, y);
    }
    coords = robot.getMousePos();
    for (let i = 0; i <= width; i += 5) {
        const x = coords.x - i;
        robot.dragMouse(x, coords.y);
    }
    coords = robot.getMousePos();
    for (let i = 0; i <= length; i += 5) {
        const y = coords.y - i;
        robot.dragMouse(coords.x, y);
    }
    robot.mouseToggle('up')
};