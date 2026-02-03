import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Modal, Button, Title, ActionIcon } from 'rizzui';
import { XMarkIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getThemeColors } from '../theme/colors';

interface ImageUploadProps {
  name: string;
  control: any;
  disabled?: boolean;
  label?: string;
  isDarkMode?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  control,
  disabled = false,
  label = 'Profile Picture',
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Cleanup object URL on unmount
  React.useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          // Handle both File objects (new uploads) and string URLs (existing images)
          const file = value instanceof File ? value : null;
          const existingUrl = typeof value === 'string' ? value : null;
          
          // Create object URL for new files
          React.useEffect(() => {
            if (file) {
              const url = URL.createObjectURL(file);
              setObjectUrl(url);
              return () => URL.revokeObjectURL(url);
            } else {
              setObjectUrl(null);
            }
          }, [file]);

          const displayUrl = objectUrl || existingUrl;

          return (
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-2 ${theme.text.primary}`}>{label}</label>
              <div className="space-y-4">
                {/* Upload Area - Always Visible */}
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${theme.border.input} hover:border-orange-500`}>
                  <PhotoIcon className={`w-8 h-8 ${theme.text.muted}`} />
                  <span className={`text-sm mt-2 ${theme.text.tertiary}`}>
                    {displayUrl ? 'Change Image' : 'Click to upload or drag and drop'}
                  </span>
                  <span className={`text-xs ${theme.text.muted}`}>PNG, JPG, GIF up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={disabled}
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        onChange(selectedFile);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                {/* Image Preview - Show when image is available */}
                {displayUrl && (
                  <div className="relative inline-block">
                    <img
                      src={displayUrl}
                      alt="Profile preview"
                      className={`w-32 h-32 object-cover rounded-lg border-2 cursor-pointer hover:border-orange-500 transition-colors ${theme.border.input}`}
                      onClick={() => setPreviewOpen(true)}
                    />
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => onChange(null)}
                        className={`absolute -top-2 -right-2 rounded-full p-1 transition-colors ${theme.status.error.bg} ${theme.status.error.text}`}
                        title="Remove image"
                      >
                        <XCircleIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      />

      {/* Preview Modal */}
      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)}>
        <div className="m-auto px-7 pt-6 pb-8">
          <div className="mb-7 flex items-center justify-between">
            <Title as="h3">Profile Picture Preview</Title>
            <ActionIcon size="sm" variant="text" onClick={() => setPreviewOpen(false)}>
              <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <div className="flex justify-center">
            <Controller
              name={name}
              control={control}
              render={({ field: { value } }) => {
                const file = value instanceof File ? value : null;
                const existingUrl = typeof value === 'string' ? value : null;
                const displayUrl = file ? URL.createObjectURL(file) : existingUrl;
                
                React.useEffect(() => {
                  if (file) {
                    const url = URL.createObjectURL(file);
                    return () => URL.revokeObjectURL(url);
                  }
                }, [file]);

                return displayUrl ? (
                  <img
                    src={displayUrl}
                    alt="Profile preview"
                    className="max-w-full max-h-96 object-contain rounded-lg"
                  />
                ) : (
                  <div className={theme.text.tertiary}>No image selected</div>
                );
              }}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};