import React, { useState, useRef, useCallback } from 'react';
import { useRequest, request, useIntl } from '@umijs/max';
import copy from 'copy-to-clipboard';
import { Button, message, Alert } from 'antd';
import AddTxt from './addTxt';
import styles from './index.less';
const ShearPlate = (props) => {
    const { formatMessage } = useIntl()
    const [list, setList] = useState([])
    const requestCount = useRef(0)

    const getAllText = async () => {
        const { code, data } = await request('/api/getTxt')
        if (code === 1) {
            cancel()
        } else {
            requestCount.current += 1
            if (requestCount.current > 20) {
                cancel()
                requestCount.current = 0
            }
            setList(data)
        }
    }

    const { run, cancel } = useRequest(getAllText, {
        pollingInterval: 3000,
        pollingWhenHidden: false
    });

    return (
        <div className={styles.shearPlateWrap}>
            <Alert message={formatMessage({ id: 'tips' })} type="warning" showIcon />
            <div className={styles.header}>
                <AddTxt />
                <Button onClick={run} style={{ marginLeft: 20 }} danger>{formatMessage({ id: 'startReq' })}</Button>
            </div>
            <div className={styles.txtWrap}>
                {list.map((item) => {
                    return <div key={item} className={styles.txt} onClick={() => {
                        copy(item);
                        message.success(formatMessage({ id: 'copySuccess' }))
                    }}>
                        {item}
                    </div>
                })}
            </div>
        </div>
    )
};
export default ShearPlate;