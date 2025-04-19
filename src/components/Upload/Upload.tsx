'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import Button from '../Button/Button';
import './Upload.scss';
import uploadIcon from '../../assets/icon/upload.svg';

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error';

export interface UploadFile {
  /**
   * Original File object
   */
  raw: File;
  /**
   * Unique identifier for the file
   */
  uid: string;
  /**
   * File name
   */
  name: string;
  /**
   * File size in bytes
   */
  size: number;
  /**
   * Upload status
   */
  status: UploadFileStatus;
  /**
   * Upload progress (0-100)
   */
  percent?: number;
  /**
   * Error message if status is 'error'
   */
  error?: string;
}

export interface UploadProps {
  /**
   * Action URL for uploading
   */
  action: string;
  /**
   * Default file list
   */
  defaultFileList?: UploadFile[];
  /**
   * Whether to support multiple file upload
   */
  multiple?: boolean;
  /**
   * Whether to show the file list
   */
  showFileList?: boolean;
  /**
   * Whether to support drag and drop
   */
  drag?: boolean;
  /**
   * Accepted file types
   * @example 'image/*' | '.jpg,.png' | 'image/png,image/jpeg'
   */
  accept?: string;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Custom request function
   */
  customRequest?: (file: File) => Promise<Record<string, unknown>>;
  /**
   * Callback before upload
   * @returns boolean | Promise<boolean>
   */
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  /**
   * Callback when upload progress changes
   */
  onProgress?: (percentage: number, file: UploadFile) => void;
  /**
   * Callback when upload succeeds
   */
  onSuccess?: (data: Record<string, unknown>, file: UploadFile) => void;
  /**
   * Callback when upload fails
   */
  onError?: (error: Error | { message: string }, file: UploadFile) => void;
  /**
   * Callback when file is removed
   */
  onRemove?: (file: UploadFile) => void;
  /**
   * Callback when file status changes
   */
  onChange?: (file: UploadFile) => void;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

/**
 * Upload component for file uploads
 */
export const Upload: React.FC<UploadProps> = ({
  action,
  defaultFileList = [],
  multiple = false,
  showFileList = true,
  drag = false,
  accept,
  maxSize,
  customRequest,
  beforeUpload,
  onProgress,
  onSuccess,
  onError,
  onRemove,
  onChange,
  className = '',
  children,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Generate a unique ID for each file
  const generateUid = (): string => {
    return Date.now() + Math.random().toString(36).substring(2, 8);
  };

  // Convert File to UploadFile
  const fileToUploadFile = (file: File): UploadFile => {
    return {
      uid: generateUid(),
      name: file.name,
      size: file.size,
      status: 'ready',
      raw: file,
    };
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    uploadFiles(Array.from(files));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      uploadFiles(Array.from(files));
    }
  };

  // Handle drag events
  const handleDrag = (e: DragEvent<HTMLDivElement>, isDragging: boolean) => {
    e.preventDefault();
    setIsDragging(isDragging);
  };

  // Upload files
  const uploadFiles = (files: File[]) => {
    files.forEach(file => {
      if (maxSize && file.size > maxSize) {
        // File is too large
        const uploadFile: UploadFile = {
          ...fileToUploadFile(file),
          status: 'error',
          error: `File size exceeds ${formatFileSize(maxSize)}`,
        };
        setFileList(prevList => [...prevList, uploadFile]);
        onChange?.(uploadFile);
        return;
      }

      const processUpload = (shouldUpload: boolean) => {
        if (shouldUpload) {
          const uploadFile = fileToUploadFile(file);
          setFileList(prevList => [...prevList, uploadFile]);
          onChange?.(uploadFile);
          uploadFile.status = 'uploading';
          uploadFile.percent = 0;
          onChange?.(uploadFile);

          // Use custom request function or default XHR
          const uploadPromise = customRequest
            ? customRequest(file)
            : defaultUploadRequest(file, uploadFile);

          uploadPromise
            .then(res => {
              const updatedFile = {
                ...uploadFile,
                status: 'success' as const,
                percent: 100,
              };
              setFileList(prevList =>
                prevList.map(item =>
                  item.uid === uploadFile.uid ? updatedFile : item
                )
              );
              onSuccess?.(res, updatedFile);
              onChange?.(updatedFile);
            })
            .catch(err => {
              const updatedFile = {
                ...uploadFile,
                status: 'error' as const,
                error: err.message,
              };
              setFileList(prevList =>
                prevList.map(item =>
                  item.uid === uploadFile.uid ? updatedFile : item
                )
              );
              onError?.(err, updatedFile);
              onChange?.(updatedFile);
            });
        }
      };

      if (beforeUpload) {
        const result = beforeUpload(file);
        if (result instanceof Promise) {
          result.then(processUpload);
        } else {
          processUpload(result);
        }
      } else {
        processUpload(true);
      }
    });
  };

  // Default upload request using XMLHttpRequest
  const defaultUploadRequest = (
    file: File,
    uploadFile: UploadFile
  ): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          const updatedFile = { ...uploadFile, percent: percentage };
          setFileList(prevList =>
            prevList.map(item =>
              item.uid === uploadFile.uid ? updatedFile : item
            )
          );
          onProgress?.(percentage, updatedFile);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({ message: `Upload failed with status ${xhr.status}` });
        }
      });

      xhr.addEventListener('error', () => {
        reject({ message: 'Upload failed' });
      });

      xhr.open('POST', action);
      xhr.send(formData);
    });
  };

  // Handle file removal
  const handleRemove = (file: UploadFile) => {
    setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
    onRemove?.(file);
  };

  // Format file size for display
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Render upload button or custom children
  const renderUploadButton = () => {
    if (children) {
      return (
        <div className="upload-custom" onClick={handleClick}>
          {children}
        </div>
      );
    }
    return (
      <Button onClick={handleClick} className="upload-button">
        <img src={uploadIcon} alt="Upload" className="upload-icon" />
        Upload File
      </Button>
    );
  };

  // Render file list
  const renderFileList = () => {
    if (!showFileList || fileList.length === 0) return null;

    return (
      <ul className="upload-file-list">
        {fileList.map(file => (
          <li
            key={file.uid}
            className={`upload-file-item upload-file-item--${file.status}`}
          >
            <div className="upload-file-info">
              <span className="upload-file-name">{file.name}</span>
              <span className="upload-file-size">
                {formatFileSize(file.size)}
              </span>
            </div>
            {file.status === 'uploading' && (
              <div className="upload-progress">
                <div
                  className="upload-progress-bar"
                  style={{ width: `${file.percent || 0}%` }}
                ></div>
              </div>
            )}
            {file.status === 'error' && (
              <div className="upload-file-error">
                {file.error || 'Upload failed'}
              </div>
            )}
            <button
              className="upload-file-remove"
              onClick={() => handleRemove(file)}
              aria-label="Remove file"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    );
  };

  // Render drag area
  const renderDragArea = () => {
    if (!drag) return null;

    return (
      <div
        className={`upload-drag-area ${isDragging ? 'is-dragging' : ''}`}
        onDragOver={e => handleDrag(e, true)}
        onDragLeave={e => handleDrag(e, false)}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-drag-content">
          <img src={uploadIcon} alt="Upload" className="upload-icon" />
          <p>Drag files here or click to upload</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`upload-wrapper ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
      />
      {drag ? renderDragArea() : renderUploadButton()}
      {renderFileList()}
    </div>
  );
};

Upload.displayName = 'Upload';

export default Upload;
