
import React, { useEffect, useMemo, useRef } from 'react';
import { WifiOutlined } from '@ant-design/icons';
import FileList from '@/components/FileList';
import { history, request, useIntl, setLocale, getLocale } from '@umijs/max';
import { notification, message, } from 'antd';
import { apiConfig, baseFileUrl, } from '@/utils/config';
import Setting from '@/components/Setting'
import ShowIps from '@/components/ShowIps';
import styles from './index.less';

const Index = (props) => {

  const intl = useIntl();
  const fileListRef = useRef({});

  useEffect(() => {

    if (window.location.pathname === '/help') {
      history.push('/help')
    }
  }, [])



  useEffect(() => {
    const lang = getLocale()
    const { setLang, changeLang, serverState,  } = window.electronApi
    setLang(lang)
    changeLang((event, arg) => {
      setLocale(arg, false);
      window.localStorage.setItem('usl', true)
    })
    serverState((event, arg) => {
      window.localStorage.setItem('serverConfig', JSON.stringify(arg))
    })
  }, []);

  const saveFile = async (filePath) => {
    // 检测是否是文件夹，如果是，则报错，不是则存储
    const { statSync, basename, copy, isFile } = window.electronApi
    console.log('window.electronApi', window.electronApi);
    const stats = statSync(filePath)
    const fileName = basename(filePath)
    if (isFile(filePath)) {
      const data = await request(apiConfig().save, {
        method: 'post',
        data: {
          name: fileName,
          path: filePath,
          size: stats.size
        }
      })
      if (data && data.id) {
        const urls = baseFileUrl();
        // 如果list是展开状态，就不在弹出message
        const { visible, openList } = fileListRef.current
        if (!visible) {
          notification.success({
            key: 'suc',
            message: format('successMsg'),
            description: urls.length > 1 ? format('manyIps') : `${urls[0]}/${data.id}/${data.name}`,
            onClick: () => {
              if (urls.length === 1) {
                copy(`${urls[0]}/${data.id}/${encodeURIComponent(data.name)}`)
                message.success(format('copySuccess'))
                notification.destroy('suc')
              } else if (urls.length > 1) {
                openList()
                notification.destroy('suc')
              }

            },
          })
        }
      }
    } else {
      notification.error({
        message: format('errorMsg'),
      })
    }
  }

  const onDrop = event => {
    const { path } = event.dataTransfer.files[0];
    saveFile(path)
    const { visible, getFileList, } = fileListRef.current
    visible && getFileList && getFileList(true)
  };

  const onDragOver = event => {
    event.preventDefault();
  };

  const format = (id) => {
    return intl.formatMessage({ id })
  }



  return (
    <div className={styles.wrap} onDrop={onDrop}
      onDragOver={onDragOver}>
      <FileList ref={fileListRef} />
      <div
        className={styles.wifiWrap}
      >
        <WifiOutlined className={styles.wifi} />
        <h2 style={{ color: 'white' }}>{format('mainTip')}</h2>
      </div>
      <Setting />
      <ShowIps />
    </div>
  );
}


export default Index

