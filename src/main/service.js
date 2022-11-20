import fs from 'fs'
import path from 'path'
import { app } from 'electron'
const sendToWormhole = require('stream-wormhole');

const fileExist = (file) => {
    let isExist = false
    try {
        // 确定文件是否存在及是否有可读属性
        isExist = fs.existsSync(file)
    } catch (err) {
    }
    return isExist
}

const genNewFileName = (_path) => {


    const fileExt = path.extname(_path)
    const fileName = path.basename(_path).replace(fileExt, '')
    const destPath = _path.replace(path.basename(_path), '')
    let count = 1
    const rname = () => {
        const name = path.join(destPath, `${fileName}-(${count})`)
        return `${name}${fileExt}`
    }
    while (fileExist(rname())) {
        count++
    }
    return path.join(destPath, `${fileName}-(${count})${fileExt}`)
}


const genFilePath = (_path) => {
    let realPath = _path
    const isExist = fileExist(_path)
    if (isExist) {
        realPath = genNewFileName(_path)
    }
    return realPath
}


export const uploadFilePublic = function (ctx, files) {
    const filePath = app.getPath('downloads')
    let fileReader,
        fileResource,
        writeStream;

    const fileFunc = function (file) {
        // 读取文件流
        fileReader = fs.createReadStream(file.filepath);
        // 组装成绝对路径
        fileResource = filePath + `/${file.originalFilename}`;
        // 检测地址是否已经存在了同名文件，如果存在则自动重命名
        const realPath = genFilePath(fileResource)
        /*
         使用 createWriteStream 写入数据，然后使用管道流pipe拼接
        */
        writeStream = fs.createWriteStream(realPath);
        writeStream.once('error', () => {
            sendToWormhole(fileReader, true)
        });
        fileReader.pipe(writeStream);
    };
    const returnFunc = function () {
        let url = '';
        ctx.body = {
            url: url,
            code: 0,
            message: '上传成功'
        };
    };
    // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
    if (!fs.existsSync(filePath)) {
        fs.mkdir(filePath, (err) => {
            if (err) {
                throw new Error(err);
            } else {
                returnFunc();
            }
        });
    } else {
        returnFunc();
    }
    // 多个文件上传
    for (let i = 0; i < files.length; i++) {
        const f1 = files[i];
        fileFunc(f1);
    }
}

const filePath = `${__dirname}/word.txt`;

const isFileExist = () => {
    let isExist = false
    try {
        // 确定文件是否存在及是否有可读属性
        fs.accessSync(filePath, fs.constants.R_OK)
        isExist = true
    } catch (err) {
    }
    return isExist
}
export const addTxt = (ctx, txt) => {
    try {
        let allString = ''
        if (isFileExist()) {
            allString = fs.readFileSync(filePath).toString()
        }
        const allWords = allString.trim().split(' ')
        if (allWords.length > 50) {
            fs.writeFileSync(filePath, '')
        }
        fs.appendFileSync(filePath, ` ${txt}`)
        ctx.body = { code: 0, msg: '发送成功' }
    } catch (error) {
        console.log(error);
        ctx.body = { code: 2, msg: '发送失败' }
    }
}

export const getTxt = (ctx) => {
    console.log('filePath', isFileExist());
    try {
        let txt = ''

        if (isFileExist()) {
            txt = fs.readFileSync(filePath).toString()
        }
        ctx.body = { code: 0, data: txt.trim().split(' ').reverse() }
    } catch (error) {
        ctx.body = { code: 1, data: [], msg: '读取文件失败' }
    }
}