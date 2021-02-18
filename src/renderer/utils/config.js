/*
 * @Author: xiaobei
 * @Date: 2021-02-04 22:56:52
 * @LastEditTime: 2021-02-18 16:58:13
 * @LastEditors: xiaobei
 */

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}


const baseUrl = `http://127.0.0.1:${remote.getGlobal('goPort').port}`;
const baseFileUrl = `http://${getIPAddress()}:${remote.getGlobal('goPort').port}/file`;

const apiConfig = {
    save: `${baseUrl}/api/createFile`,
    getList: `${baseUrl}/api/getList`,
    deleteFile: `${baseUrl}/api/deleteFile/:id`,
}

module.exports = {
    baseFileUrl, apiConfig
}