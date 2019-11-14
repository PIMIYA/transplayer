const process = require('process');
const util = require('util');
const processWindows = require("./win-focus");

const getProcesses = util.promisify(processWindows.getProcesses);

class Utils {
    static getPlatform() {
        var osPlatform = process.platform;

        if (osPlatform == 'darwin') {
            return 'mac';
        } else if (osPlatform == 'win32') {
            return 'win';
        } else {
            return 'linux';
        }
    }

    /**
     *
     * @param {string} targetProcessName
     *
     * @return {Promise<Array.<{pid: number, mainWindowTitle: string, processName: string}>>}
     */
    static async getPID(targetProcessName) {
        /** @type {Array.<{pid: number, mainWindowTitle: string, processName: string}>} */
        let pids = await getProcesses();
        if (!pids) {
            return [];
        }

        var targetProcesses = (targetProcessName === undefined) ?
            pids :
            pids.filter(p =>
                p.processName.indexOf(targetProcessName) >= 0 &&
                p.mainWindowTitle != ''
            );

        return targetProcesses;
    }

    /**
     *
     * @param {number} pid
     */
    static focusWindow(pid) {
        // if (!pid) { return; }
        processWindows.focusWindow(pid);
    }
}

module.exports = Utils;