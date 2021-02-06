/*
 * @Author: xiaobei
 * @Date: 2021-02-04 16:06:03
 * @LastEditTime: 2021-02-05 17:31:40
 * @LastEditors: xiaobei
 */
import React, { useState, } from 'react';
import { ImportOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { request } from 'umi';
import { apiConfig } from '@/utils/config';
import FileItem from '../FIleItem'
import styles from './index.less';
const FileList = (props) => {
    const [visible, setVisible] = useState(false);
    const [fileList, setFileList] = useState([]);

    const getFileList = async (update) => {
        if (!visible || update) {
            const data = await request(apiConfig.getList, {
                method: 'get',
            })
            setFileList(data.reverse())
        }
    }

    return (
        <div className={classnames(styles.fileList)}>
            <ImportOutlined rotate={!visible ? 0 : 180} className={classnames(styles.switch, { [styles.showIcon]: visible })} onClick={() => {
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

export default FileList;