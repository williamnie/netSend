/*
 * @Author: xiaobei
 * @Date: 2021-02-04 16:06:03
 * @LastEditTime: 2022-11-19 22:16:09
 * @LastEditors: xiaobei
 */
import React, { useState, useImperativeHandle, forwardRef, } from 'react';
import { LeftCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { request } from '@umijs/max';
import { apiConfig } from '@/utils/config';
import FileItem from '../FileItems'
import styles from './index.less';
const FileList = (props, ref) => {
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);

    const getFileList = async (update) => {
        if (!visible || update) {
            const data = await request(apiConfig().getList, {
                method: 'get',
            })
            setFileList(data.reverse())
        }
    }


    const openList = () => {
        setVisible(true)
        getFileList()
    }

    useImperativeHandle(ref, () => ({
        // 将这个方法暴露给父组件
        visible,
        getFileList,
        openList
    }));

    return (
        <div className={classnames(styles.fileList)}>

            <LeftCircleOutlined style={{ fontSize: 30 }} rotate={!visible ? 0 : 180} className={classnames(styles.switch, { [styles.showIcon]: visible })} onClick={() => {
                setVisible(!visible)
                getFileList()
            }} />
            <div className={classnames(styles.fileBox, { [styles.show]: visible })}>
                {fileList.length > 0 && fileList.map((item) => {
                    return (
                        <FileItem key={item.id} data={item} getFileList={getFileList} />
                    )
                })}
            </div>
        </div >
    )
}

export default forwardRef(FileList);