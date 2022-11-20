/*
 * @Author: xiaobei
 * @Date: 2021-02-02 16:19:42
 * @LastEditTime: 2021-02-05 17:52:22
 * @LastEditors: xiaobei
 */

// 递归检测端口是否可用

import net from 'net';

const portInUse = async (port) => {
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port, '0.0.0.0');
        server.on('listening', function () {
            server.close();
            resolve(port);
        });
        server.on('error', function (err) {
            if (err.code == 'EADDRINUSE') {
                port++;
                reject(err);
            }
        });
    });
}

export const tryUsePort = async (_port) => {
    let port
    for (let index = 0; index < 1000; index++) {
        try {
            port = await portInUse(_port);
            break
        } catch (error) {
            _port++;
        }
    }
    return port
}

export const genId = (range = 24) => {
    let str = '';
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < range; i++) {
        const index = Math.round(Math.random() * (arr.length - 1));
        str += arr[index];
    }
    return str;
};