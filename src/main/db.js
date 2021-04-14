/*
 * @Author: xiaobei
 * @Date: 2021-02-02 15:51:58
 * @LastEditTime: 2021-04-14 15:01:29
 * @LastEditors: xiaobei
 * @desc: 我为啥要写这么复杂🤣🤣🤣
 */
import fs from 'fs'
import { genId } from './helper';

export default class DB {

    constructor() {
        this.dbPath = `${__dirname}/db.json`;
        this.state = []; //数据集合
        this.idIndex = null // 以id为key的索引
        /**
         * 虽然数据量很小，但还是选择建索引了，哈哈哈！
         */
        this.init();
    }

    async syncDataFromDisk() {
        let data = []
        try {
            data = fs.readFileSync(this.dbPath).toString()
            data = JSON.parse(data)
        } catch (error) {

        }
        this.state = data
        this.createIndex()
    }

    createIndex() {
        const length = this.state.length
        this.idIndex = this.idIndex || {}
        for (let index = 0; index < length; index++) {
            this.idIndex[this.state[index].id] = this.state[index]
        }
    }

    updateIndex(obj) {
        this.idIndex[obj.id] = obj
    }

    deleteIndex(obj) {
        this.idIndex[obj.id] = undefined
    }

    async saveDataToDisk() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.state))
    }

    async create(data) {
        /**
         * 支持传入数组，批量添加，存入state的同时
         * 更新索引
         */
        let res
        if (Array.isArray(data)) {
            const callBack = []
            data.forEach((item) => {
                const id = genId()
                const ele = { ...item, id }
                callBack.push(ele)
                this.state.push(ele)
                this.updateIndex(ele)
            })
            res = callBack
        } else {
            const id = genId()
            const ele = { ...data, id }
            this.state.push(ele)
            this.updateIndex(ele)
            res = ele
        }
        setTimeout(() => {
            this.saveDataToDisk()
        }, 1000)
        return res
    }


    async findById(id) {
        let data
        if (this.idIndex) {
            data = this.idIndex[id] || this.state.find((item) => { return item.id === id })
        } else {
            data = this.state.find((item) => { return item.id === id })
        }
        return data
    }

    async deleteById(id) {
        let item;
        const data = [];
        for (const ele of this.state) {
            if (ele.id !== id) {
                data.push(ele)
            } else {
                item = ele
            }
        }
        this.state = data
        this.deleteIndex(item)
        return item
    }

    async getList() {
        return this.state
    }

    init() {
        this.syncDataFromDisk()
    }
}
