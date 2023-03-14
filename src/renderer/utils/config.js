/*
 * @Author: xiaobei
 * @Date: 2021-02-04 22:56:52
 * @LastEditTime: 2023-03-14 21:55:30
 * @LastEditors: xiaobei
 */

function getIPAddress() {
    const interfaces = window.electronApi.networkInterfaces();
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

const getPort = () => {
    let config = window.localStorage.getItem('serverConfig')
    if (false && config) {
        config = JSON.parse(config)
    } else {
        const { getConfig } = window.electronApi
        config = getConfig && getConfig()
        window.localStorage.setItem('serverConfig', JSON.stringify(config))
    }
    return config && config.port || 23456
}


const baseFileUrl = () => {
    return getIPAddress().map((item) => {
        return `http://${item}:${getPort()}/file`;
    })
}

const apiConfig = () => {
    const baseUrl = `http://127.0.0.1:${getPort()}`;
    return {
        save: `${baseUrl}/api/createFile`,
        getList: `${baseUrl}/api/getList`,
        deleteFile: `${baseUrl}/api/deleteFile/:id`,
        upload: `${baseUrl}/api/uploadFile`
    }
}





module.exports = {
    baseFileUrl, apiConfig, getIPAddress, getPort
}