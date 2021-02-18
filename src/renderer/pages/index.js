
import React, { useEffect } from 'react';
import { WifiOutlined } from '@ant-design/icons';
import FileList from '@/components/FileList';
import { request, useIntl, setLocale, getLocale } from 'umi';
import { notification } from 'antd';
import { apiConfig, baseFileUrl } from '@/utils/config';
import styles from './index.less';


const Index = (props) => {

  const intl = useIntl();

  ipcRenderer.on('mainChangeLanguage', (event, arg) => {
    setLocale(arg, false);
    window.localStorage.setItem('usl', true)
  });

  useEffect(() => {
    const lang = getLocale()
    ipcRenderer.sendSync('syncLanguage', lang)
  }, []);

  const saveFile = async (filePath) => {
    // 检测是否是文件夹，如果是，则报错，不是则存储
    const stats = fs.statSync(filePath)
    const fileName = path.basename(filePath)
    if (stats.isFile()) {
      const data = await request(apiConfig.save, {
        method: 'post',
        data: {
          name: fileName,
          path: filePath,
          size: stats.size
        }
      })
      if (data && data.id) {
        notification.success({
          message: format('successMsg'),
          description: `${baseFileUrl}/${data.id}/${data.name}`,
          onClick: () => {
            clipboard.writeText(`${baseFileUrl}/${data.id}/${data.name}`)
          },
          // duration: 666
        })
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
      <FileList />
      <div
        className={styles.wifiWrap}

      >
        <WifiOutlined className={styles.wifi} />
        <h2 style={{ color: 'white' }}>{format('mainTip')}</h2>
      </div>

    </div>
  );
}


export default Index

