import React, { useState } from 'react';
import Upload from '@/components/Upload'
import ShearPlate from '@/components/ShearPlate'
import { Tabs } from 'antd';
import { useIntl } from '@umijs/max'
import styles from './help.less';


const Help = (props) => {
    const { formatMessage } = useIntl();
    let tabConfig = [
        {
            label: formatMessage({ id: 'upload' }),
            key: 'upload',
            children: <Upload />,
        },
        {
            label: formatMessage({ id: 'shearPlate' }),
            key: 'shearPlate',
            children: <ShearPlate />,
        },
    ]
    if (window?.location?.host?.includes('127.0.0.1')) {
        tabConfig = [
            {
                label: formatMessage({ id: 'shearPlate' }),
                key: 'shearPlate',
                children: <ShearPlate />,
            },
        ]
    }

    return (
        <div className={styles.helpWrap}>
            <Tabs
                defaultActiveKey="upload"
                type="card"
                items={tabConfig}
                destroyInactiveTabPane
            />
        </div>
    )
};
export default Help;