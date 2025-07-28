import * as React from 'react';
import { Image as ExpoImage, type ImageProps } from 'expo-image';

export function Image({ className, ...props }: ImageProps & { className?: string }) {
  return <ExpoImage className={className} {...props} />;
}