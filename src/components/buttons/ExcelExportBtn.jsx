import React, { useState } from 'react';
import permission from '../../services/permission';
import { useSelector } from 'react-redux';

const ExcelExportBtn = ({ menu, url, fileName, btnName = 'Export', ...props }) => {
  const { data } = useSelector((state) => state.data);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      link.target = '_blank';
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (permission(data, menu, 'Export')) {
    return (
      <button type="button" className="btn btn-sm btn-success mx-2" onClick={handleClick} disabled={isDownloading} {...props}>
        {isDownloading ? (
          <>
            {btnName} &nbsp;
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          </>
        ) : (
          btnName
        )}
      </button>
    );
  } else {
    return null;
  }
};

export default ExcelExportBtn;
