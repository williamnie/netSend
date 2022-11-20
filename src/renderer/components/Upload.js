import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { useIntl } from '@umijs/max';

const { Dragger } = Upload;
const UploadFiles = () => {
    const { formatMessage } = useIntl()
    const props = {
        name: 'file',
        multiple: true,
        action: '/api/uploadFile',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(formatMessage({ id: 'uploadSuccess' }, { name: info.file.name }));
            } else if (status === 'error') {
                message.error(formatMessage({ id: 'uploadErr' }, { name: info.file.name }));
            }
        },
    };
    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">{formatMessage({ id: 'uploadText' })}</p>
            <p className="ant-upload-hint">
                {formatMessage({ id: 'uploadHint' })}
            </p>
        </Dragger>
    )
};
export default UploadFiles;