import React, { useRef } from 'react';
import permission from '../../services/permission';
import { useSelector } from 'react-redux';
  
const ExcelImportBtn = ({ menu, onUpload, btnName = 'Import', ...props }) => {
  const { data } = useSelector((state) => state.data);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  if (permission(data, menu, 'Import')) {
    return (
      <>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button type="button" className="btn btn-sm btn-primary mx-2" onClick={handleClick} {...props}>
          {btnName}
        </button>
      </>
    );
  } else {
    return null;
  }
};

export default ExcelImportBtn;
