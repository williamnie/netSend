/*
 * @Author: xiaobei
 * @Date: 2021-02-02 15:51:58
 * @LastEditTime: 2021-02-05 16:50:38
 * @LastEditors: xiaobei
 * @desc: 我为啥要写这么复杂🤣🤣🤣
 */
import fs from 'fs'
import { genId } from './helper';

export default class DB {

    constructor() {
        this.dbPath = './db.json';
        this.state = []; //数据集合
        this.idIndex = null // 以id为key的索引
        this.nameIndex = null // 以name为key的索引
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
        this.nameIndex = this.nameIndex || {}

        for (let index = 0; index < length; index++) {
            this.idIndex[this.state[index].id] = this.state
            this.nameIndex[this.state[index].name] = this.state
        }
    }

    updateIndex(obj) {
        this.idIndex[obj.id] = obj
        this.nameIndex[obj.name] = obj
    }

    deleteIndex(obj) {
        this.idIndex[obj.id] = undefined
        this.nameIndex[obj.name] = undefined
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
            console.log('tthis.state', this.state);
            this.state.push(ele)
            this.updateIndex(ele)
            res = ele
        }
        setTimeout(() => {
            this.saveDataToDisk()
        }, 1000)
        console.log('res', res);
        return res
    }

    /**
     * 
     * @param {} name 
     * 根据name查找，有索引的时候，去索引里查询
     * 如果查不到，默认在从所有数据里查一遍
     * 以防索引有遗漏，但几率很小
     * 如果此时没有索引，则直接从所有数据里查询
     */
    async findByName(name) {
        let data
        if (this.nameIndex) {
            data = this.nameIndex[name] || this.state.find((item) => { return item.name === name })
        } else {
            data = this.state.find((item) => { return item.name === name })
        }
        return data
    }

    async findById(id) {
        let data
        if (this.idIndex) {
            data = this.idIndex[id] || this.state.find((item) => { return item.id === id })
        } else {
            Fdata = this.state.find((item) => { return item.id === id })
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
