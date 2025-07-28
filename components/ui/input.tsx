import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  className?: string;
  variant?: 'default' | 'outlined';
};

export function Input({ 
  className, 
  variant = 'default', 
  ...props 
}: InputProps) {
  const baseStyles = 'px-4 py-3 text-base rounded-lg';
  
  const variantStyles = {
    default: 'bg-gray-100 border-gray-300',
    outlined: 'border border-gray-300 bg-white'
  };

  const inputClassName = `${baseStyles} ${variantStyles[variant]} ${className || ''}`;

  return (
    <TextInput 
      className={inputClassName} 
      placeholderTextColor="#9CA3AF"
      {...props} 
    />
  );
}