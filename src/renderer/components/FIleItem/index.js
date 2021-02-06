import React, { useState } from 'react';
import { apiConfig, baseFileUrl } from '@/utils/config';
import { Popover } from 'antd';
import classnames from 'classnames';
import { CopyOutlined, QrcodeOutlined, DeleteOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { conver } from '@/utils/helper';
import QRCode from 'qrcode.react';
import styles from './index.less';

const FileItem = (props) => {
    const { data, getFileList } = props
    const [showAllInfo, setShowAllInfo] = useState(false);

    const copyFile = (item) => {
        clipboard.writeText(`${baseFileUrl}/${item.id}/${item.name}`)
    }

    const deleteFileById = (id) => {
        request(`${apiConfig.deleteFile.replace(':id', id)}`, {
            method: 'delete',
        }).then((data) => {
            console.log(data);
            getFileList && getFileList(true)
        })
    }

    return (
        <div
            className={classnames(styles.fileBorder)}
            onClick={() => { setShowAllInfo(!showAllInfo) }}
        >
            <div className={styles.files}>

                {!showAllInfo ? <p className={styles.fileName}>{data.name}</p> : <div className={styles.allInfo}>
                    <p className={styles.fileName}>名称：{data.name}</p>
                    <p className={styles.filePath}>路径：{data.path}</p>
                    <p>大小：{conver(data.size)}</p>
                    <div className={styles.toolBox}>
                        <div
                            className={styles.tool}
                            onClick={(e) => {
                                e.stopPropagation()
                                deleteFileById(data.id)
                            }}
                        >
                            <DeleteOutlined />
                        </div>
                        <div
                            className={styles.tool}
                            onClick={(e) => {
                                e.stopPropagation()
                                copyFile(data)
                            }}
                        >
                            <CopyOutlined />
                        </div>
                        <div
                            className={styles.tool}
                        >
                            <Popover content={<QRCode value={`${baseFileUrl}/${data.id}/${data.name}`} />} trigger="hover">
                                <QrcodeOutlined />
                            </Popover>

                        </div>
                    </div>
                </div>}
            </div>

        </div>
    )
};
export default FileItem;