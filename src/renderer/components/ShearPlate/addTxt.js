import React, { useState, useEffect } from 'react';
import { useRequest, request, useIntl } from '@umijs/max';
import { Input, Button, message } from 'antd';

const { Search } = Input;
// import styles from './styles.less';
const AddTxt = (props) => {
    const { formatMessage } = useIntl()
    const [value, setValue] = useState('')

    const sendTxt = async () => {
        const { code } = await request('/api/addTxt', {
            method: 'POST',
            data: {
                txt: value,
            }
        })
        if (code === 0) {
            message.success(formatMessage({ id: 'sendSuccess' }))
            setValue('')
        } else {
            message.error(formatMessage({ id: 'sendError' }))
        }
    }

    return (
        <div style={{ width: '85%' }}>
            <Input.Group compact style={{ display: 'flex' }}>
                <Input value={value} onChange={e => setValue(e.target.value)} onPressEnter={sendTxt} placeholder="Controlled autosize" />
                <Button type="primary" onClick={sendTxt}>{formatMessage({ id: 'send' })}</Button>
            </Input.Group>
        </div>
    )
};
export default React.memo(AddTxt);