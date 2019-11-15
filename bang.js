const robot = require("robotjs");

if (process.argv.length < 3) {
    return;
}

try {
    let input = parseInt(process.argv[2]);
    // console.log(input);
    let index = input - 1;
    robot.moveMouse(55 + 40 * index, 6);
    robot.mouseClick();
    //robot.moveMouse(2380, 3);
} catch (error) {
    console.error(error);
}