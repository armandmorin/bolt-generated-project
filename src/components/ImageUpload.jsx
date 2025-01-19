import React, { useState } from 'react';
    import styles from '../styles/modules/imageUpload.module.css';

    const ImageUpload = ({ currentImage, onImageUpload, label = "Logo" }) => {
      const [previewUrl, setPreviewUrl] = useState(currentImage || '');
      const [isDragging, setIsDragging] = useState(false);

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          handleFile(file);
        }
      };

      const handleFile = (file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewUrl(reader.result);
            onImageUpload(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Please upload an image file');
        }
      };

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
      };

      const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
      };

      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          handleFile(file);
        }
      };

      const handleRemove = () => {
        setPreviewUrl('');
        onImageUpload('');
      };

      return (
        <div className={styles.imageUploadContainer}>
          <label className={styles.label}>{label}</label>
          
          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className={styles.previewContainer}>
                <img 
                  src={previewUrl} 
                  alt="Logo Preview" 
                  className={styles.preview}
                />
                <button 
                  type="button" 
                  className={styles.removeButton}
                  onClick={handleRemove}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className={styles.uploadIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                </div>
                <div className={styles.uploadText}>
                  <span>Drag and drop an image here or</span>
                  <label className={styles.uploadButton}>
                    Browse
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.fileInput}
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      );
    };

    export default ImageUpload;
