import React, { useCallback, useRef, useState } from 'react';

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
      style={{
        border: '2px dashed #ccc',
        borderRadius: 8,
        padding: '24px',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: isDragging ? '#f5f5f5' : '#fafafa',
        color: disabled ? '#999' : '#333',
        outline: 'none',
      }}
      aria-disabled={disabled}
    >
      <p style={{ margin: '0 0 8px' }}>上传前端项目 zip 文件</p>
      <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{statusText}</p>
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
