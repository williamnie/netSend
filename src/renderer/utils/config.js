/*
 * @Author: xiaobei
 * @Date: 2021-02-04 22:56:52
 * @LastEditTime: 2021-02-19 23:30:08
 * @LastEditors: xiaobei
 */

function getIPAddress() {
    const interfaces = os.networkInterfaces();
    const ips = []
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                // return alias.address;
                ips.push(alias.address)
            }
        }
    }
    return ips
}

// TODO: 这里可能会有两个ip，还没想好怎么处理，暂时先搁置
const baseUrl = `http://127.0.0.1:${remote.getGlobal('goPort').port}`;
const baseFileUrl = `http://${getIPAddress()[0]}:${remote.getGlobal('goPort').port}/file`;
// const baseFileUrl = getIPAddress().map((item) => {
//     return `http://${item}:${remote.getGlobal('goPort').port}/file`;
// })

const apiConfig = {
    save: `${baseUrl}/api/createFile`,
    getList: `${baseUrl}/api/getList`,
    deleteFile: `${baseUrl}/api/deleteFile/:id`,
}

module.exports = {
    baseFileUrl, apiConfig
}