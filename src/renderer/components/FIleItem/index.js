import React, { useState } from 'react';
import { apiConfig, baseFileUrl, getIPAddress } from '@/utils/config';
import { Popover } from 'antd';
import classnames from 'classnames';
import { CopyOutlined, QrcodeOutlined, DeleteOutlined } from '@ant-design/icons';
import { request, useIntl } from 'umi';
import { conver } from '@/utils/helper';
import QRCode from 'qrcode.react';
import styles from './index.less';

const FileItem = (props) => {

    const intl = useIntl()
    const { data, getFileList } = props
    const [showAllInfo, setShowAllInfo] = useState(false);
    const urls = baseFileUrl()
    const ips = getIPAddress()

    const copyFile = (url,item) => {
        clipboard.writeText(`${url}/${item.id}/${item.name}`)
    }

    const deleteFileById = (id) => {
        request(`${apiConfig.deleteFile.replace(':id', id)}`, {
            method: 'delete',
        }).then((data) => {
            console.log(data);
            getFileList && getFileList(true)
        })
    }

    const format = (id) => {
        return intl.formatMessage({ id })
    }

    return (
        <div
            className={classnames(styles.fileBorder)}
            onClick={() => { setShowAllInfo(!showAllInfo) }}
        >
            <div className={styles.files}>

                {!showAllInfo ? <p className={styles.fileName}>{data.name}</p> : <div className={styles.allInfo}>
                    <p className={styles.fileName}>{format('fileName')}：{data.name}</p>
                    <p className={styles.filePath}>{format('filePath')}：{data.path}</p>
                    <p>{format('fileSize')}：{conver(data.size)}</p>
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
                        >
                            {urls.length > 1
                                ?
                                <Popover
                                    placement="bottom"
                                    overlayClassName='manyUrls'
                                    content={
                                        <div style={{ width: 300 }}>
                                            {urls.map((item) => {
                                                return (
                                                    <div className='realUrl'>
                                                        <p>{`${item}/${data.id}/${data.name}`}</p>
                                                        <CopyOutlined onClick={(e) => {
                                                            e.stopPropagation()
                                                            copyFile(item,data)
                                                        }} />
                                                    </div>
                                                )
                                            })}
                                        </div>} trigger="hover">
                                    <CopyOutlined />
                                </Popover>
                                :
                                <CopyOutlined onClick={(e) => {
                                    e.stopPropagation()
                                    copyFile(urls[0],data)
                                }} />}
                        </div>
                        <div
                            className={styles.tool}
                        >
                            <Popover content={<div>{urls.map((item, index) => {
                                return (
                                    <>
                                        <p>ip:{ips[index]}</p>
                                        <QRCode value={`${item}/${data.id}/${data.name}`} />
                                    </>
                                )
                            })}</div>} trigger="hover">
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