/*
 * @Author: xiaobei
 * @Date: 2021-01-29 15:43:57
 * @LastEditTime: 2023-03-20 21:30:34
 * @LastEditors: xiaobei
 */
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-body';
import fs from 'fs'
import path from 'path'
import DB from './db';
import { uploadFilePublic, getTxt, addTxt } from './service'


const app = new Koa();
const router = new Router();
const db = new DB()

const isDev = process.env.NODE_ENV === 'development';

const parseRange = (range, size) => {
    if (range) {
        const [start, end] = range.replace('bytes=', '').split('-')
        return { start: +start, end: end && end <= size ? end : size }
    } else {
        return { start: 0, end: size }
    }
}

let serverStatus

router.get('/file/:id/:name', async (ctx, next) => {
    const { id } = ctx.params;
    // 拿到文件名，检查文件是否存在，存在则返回文件流，不存在404
    const file = await db.findById(id)
    const range = ctx.get('Range')
    if (file) {
        try {
            // 如果文件不存在，则stat会报错，直接404
            const stats = fs.statSync(file.path);
            const filename = path.basename(file.path)
            const { start, end } = parseRange(range, stats.size)

            if (start >= stats.size || end > stats.size) {
                ctx.response.status = 416;
                ctx.body = "";
                return;
            }
            ctx.response.status = 206;
            ctx.set('Accept-Ranges', 'bytes');
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
            ctx.set('Content-Length', !range ? end - start : end - start + 1);
            ctx.set('Content-Range', `bytes ${start}-${end}/${stats.size}`);
            ctx.body = fs.createReadStream(file.path, {
                start,
                end
            });
        } catch (error) {
            console.log('error', error);
            ctx.status = 404
            ctx.body = '文件不存在'
        }
    } else {
        ctx.status = 404
        ctx.body = '文件不存在'
    }
});

router.get('/api/getList', async (ctx, next) => {
    ctx.body = await db.getList();
})

router.delete('/api/deleteFile/:id', async (ctx, next) => {
    const { id } = ctx.params;
    ctx.body = await db.deleteById(id);
})

router.post('/api/createFile', async (ctx, next) => {
    const body = ctx.request.body || {};
    const res = await db.create(body);
    ctx.body = res
})

router.post('/api/uploadFile', async (ctx, next) => {
    const { file } = ctx.request.files;
    const fileArrs = file.length ? file : [file];
    uploadFilePublic(ctx, fileArrs);
})



router.post('/api/addTxt', async (ctx, next) => {
    const { txt } = ctx.request.body || {};
    addTxt(ctx, txt)

})

router.get('/api/getTxt', async (ctx, next) => {
    getTxt(ctx)
})

router.get('/help', async (ctx, next) => {
    if (isDev) {
        ctx.redirect('http://localhost:8011/#/upload')
    } else {
        ctx.type = 'text/html'
        ctx.body = fs.createReadStream(path.join(__dirname, "./index.html"))
    }
})

router.get('/umi.js', async (ctx, next) => {
    ctx.type = 'text/js'
    ctx.body = fs.createReadStream(path.join(__dirname, "./umi.js"))
})
router.get('/umi.css', async (ctx, next) => {
    ctx.type = 'text/css'
    ctx.body = fs.createReadStream(path.join(__dirname, "./umi.css"))
})




app
    .use(cors({ exposeHeaders: '*', }))
    .use(bodyParser({
        multipart: true, // 支持文件上传
        formidable: {
            maxFieldsSize: 2 * 1024 * 1024, // 最大文件为2兆
        }
    }))
    .use(router.routes())
    .use(router.allowedMethods());

const startServer = async (port) => {
    if (!serverStatus) {
        app.listen(port, '0.0.0.0', () => {
            serverStatus = true
            console.log(`server start success port: ${port} `);
        })
    }
}

export default startServer
