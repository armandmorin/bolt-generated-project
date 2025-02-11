import React, { useState, useEffect } from 'react';
import styles from '../styles/modules/imageUpload.module.css';

const ImageUpload = ({ currentImage, onImageUpload, label = "Logo" }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');

  useEffect(() => {
    setPreviewUrl(currentImage || '');
  }, [currentImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className={styles.imageUploadContainer}>
      <label className={styles.label}>{label}</label>
      <div 
        className={styles.dropZone}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Logo Preview" className={styles.preview} />
        ) : (
          <span>Drag and drop an image or click to upload</span>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
      </div>
    </div>
  );
};

export default ImageUpload;
