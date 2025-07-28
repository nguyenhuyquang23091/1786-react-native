import * as React from 'react';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

type SafeAreaViewProps = React.ComponentProps<typeof RNSafeAreaView> & {
  className?: string;
};

export function SafeAreaView({ className, ...props }: SafeAreaViewProps) {
  return <RNSafeAreaView className={className} {...props} />;
}