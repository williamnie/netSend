import React, { useMemo } from 'react';
import { getIPAddress, getPort } from '@/utils/config';
import { Tooltip, Alert } from 'antd';
import { useIntl, } from '@umijs/max';
import styles from './index.less';
const ShowIps = (props) => {
    const { formatMessage } = useIntl()
    const renderIp = () => {
        const ips = getIPAddress()
        const port = getPort()
        return (
            <div>
                <Alert showIcon message={formatMessage({ id: 'ipTips' })} type="info" />
                {ips && ips.map((ip) => {
                    return <p style={{ color: '#1a1a1a', margin: '3px 0 3px 0' }}>{`${ip}:${port}/help`}</p>
                })}

            </div>
        )
    }


    return (
        <div className={styles.showIpsWrap}>
            <Tooltip
                color='#f2f2f2'
                placement="left"
                title={renderIp}
            >
                <span className={styles.ipsWrap} onClick={() => {
                    window.open('127.0.0.1:23456/#/help')
                }}>IP</span>
            </Tooltip>
        </div>
    )
};
export default ShowIps;