const robot = require("robotjs");

if (process.argv.length < 3) {
    return;
}

try {
    let input = parseInt(process.argv[2]);
    // console.log(input);
    let index = input - 1;
    robot.moveMouse(55 + 40 * index, 1905);
    robot.mouseClick();
} catch (error) {
    console.error(error);
}