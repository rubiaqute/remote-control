import robot from 'robotjs';

export const drawCircle = (radius: number) => {
    const coords = robot.getMousePos();
    const x = coords.x + (radius * Math.cos(0));
    const y = coords.y + (radius * Math.sin(0));
    robot.dragMouse(x, y)
    robot.mouseToggle('down')
    for (let i = 0; i <= Math.PI * 2 + 0.05; i += 0.1) {
        const x = coords.x + (radius * Math.cos(i));
        const y = coords.y + (radius * Math.sin(i));
        robot.dragMouse(x, y);
    }
    robot.mouseToggle('up')
};