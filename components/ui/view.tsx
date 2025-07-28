import * as React from 'react';
import { View as RNView, type ViewProps } from 'react-native';

export function View({ className, ...props }: ViewProps & { className?: string }) {
  return <RNView className={className} {...props} />;
}