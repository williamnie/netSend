/*
 * @Author: xiaobei
 * @Date: 2021-01-29 15:43:57
 * @LastEditTime: 2021-04-14 15:00:41
 * @LastEditors: xiaobei
 */
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import fs from 'fs'
import path from 'path'
import DB from './db';
import { tryUsePort } from './helper';

const app = new Koa();
const router = new Router();
const db = new DB()

const defaultPort = 23456;
const parseRange = (range, size) => {
    if (range) {
        const [start, end] = range.replace('bytes=', '').split('-')
        return { start: +start, end: +end }
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
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
            ctx.set('Content-Length', end === stats.size ? stats.size : end + 1);
            ctx.body = fs.createReadStream(file.path, {
                start,
                end
            });
        } catch (error) {
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


app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());


const startServer = async () => {
    if (!serverStatus) {
        const port = await tryUsePort(defaultPort)
        app.listen(port, '0.0.0.0', () => {
            serverStatus = true
            console.log('server start success');
        })
    }
}

export default startServer
