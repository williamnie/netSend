import React, { useState } from 'react';
import { SettingOutlined } from '@ant-design/icons'
import { Button, Modal, Radio } from 'antd';
import { useIntl, setLocale, getLocale } from '@umijs/max'
import styles from './index.less';
const Setting = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState(getLocale())
    const { formatMessage } = useIntl()
    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChange = (e) => {
        setValue(e.target.value)
        setLocale(e.target.value, false);
        window.localStorage.setItem('usl', true)
    }

    return (
        <div className={styles.settingWrap}>
            <SettingOutlined style={{ fontSize: 28, color: '#fff' }} onClick={showModal} />
            <Modal footer={null} title={formatMessage({ id: 'language' })}
                open={isModalOpen} onCancel={handleCancel}>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={'zh-CN'}>中文</Radio>
                    <Radio value={'en-US'}>English</Radio>
                </Radio.Group>
            </Modal>
        </div>
    )
};
export default Setting;