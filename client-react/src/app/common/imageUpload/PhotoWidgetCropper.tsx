import React from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface PhotoWidgetCropperProps {
  setCropper: React.Dispatch<React.SetStateAction<Cropper | undefined>>;
  imagePreview: string;
}

export default function PhotoWidgetCropper({
  setCropper,
  imagePreview,
}: PhotoWidgetCropperProps) {
  return (
    <Cropper
      src={imagePreview}
      style={{ height: 200, width: '100%' }}
      initialAspectRatio={1}
      aspectRatio={1}
      preview='.img-preview'
      guides={false}
      viewMode={1}
      autoCropArea={1}
      background={false}
      onInitialized={(cropper) => setCropper(cropper)}
    />
  );
}
