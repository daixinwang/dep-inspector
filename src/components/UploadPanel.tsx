import React, { useCallback, useRef, useState } from 'react';
import './UploadPanel.css';

interface UploadPanelProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onFileSelected,
  disabled,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) return;
      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = event.target.files?.[0];
    handleFile(file);
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const triggerInput = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const statusText = selectedFile
    ? `已选择: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`
    : '支持拖拽或点击选择 .zip 文件';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={triggerInput}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') triggerInput();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`upload-panel ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
      aria-disabled={disabled}
    >
      <div className="upload-icon">📦</div>
      <p className="upload-title">上传前端项目 ZIP 文件</p>
      <p className="upload-subtitle">{statusText}</p>
      <div className="upload-hint">或按 Enter 键选择文件</div>
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        style={{ display: 'none' }}
        onChange={handleInputChange}
        disabled={disabled}
      />
    </div>
  );
};
