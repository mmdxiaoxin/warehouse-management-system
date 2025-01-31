import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colorStyle} from '../styles';

interface CustomButtonProps {
  title: string; // 按钮的文本
  onPress: () => void; // 按钮点击事件
  buttonStyle?: ViewStyle; // 自定义按钮容器样式
  textStyle?: TextStyle; // 自定义文本样式
  disabled?: boolean; // 按钮是否禁用
  type?: 'primary' | 'danger' | 'success' | 'warning' | 'info'; // 按钮类型
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  buttonStyle,
  textStyle,
  disabled = false,
  type = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        disabled && styles.buttonDisabled,
        type === 'danger' && {backgroundColor: colorStyle.danger},
        type === 'success' && {backgroundColor: colorStyle.success},
        type === 'warning' && {backgroundColor: colorStyle.warning},
        type === 'info' && {backgroundColor: colorStyle.info},
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colorStyle.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colorStyle.disabled,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
