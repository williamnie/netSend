/*
 * @Author: xiaobei
 * @Date: 2021-01-29 15:43:57
 * @LastEditTime: 2021-02-05 17:52:36
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

const defaultPort = 23456

let serverStatus

router.get('/file/:id/:name', async (ctx, next) => {
    const { id } = ctx.params;
    // 拿到文件名，检查文件是否存在，存在则返回文件流，不存在404
    const file = await db.findById(id)
    if (file) {
        try {
            // 如果文件不存在，则stat会报错，直接404
            const stats = fs.statSync(file.path);
            const filename = path.basename(file.path)
            ctx.set('Content-Type', 'application/octet-stream');
            ctx.set('Content-Disposition', 'attachment; filename=' + filename);
            ctx.set('Content-Length', stats.size);
            ctx.body = fs.createReadStream(file.path);
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
