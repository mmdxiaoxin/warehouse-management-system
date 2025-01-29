import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
} from 'react-native';
import {fontStyle} from '../styles/fontStyle';

interface SectionProps extends TextInputProps {
  label: string; // 用来设置输入框的标签
  labelStyle?: object; // 用来设置标签文本的样式
  inputStyle?: object; // 用来设置输入框的样式
  inline?: boolean; // 用来控制标签和输入框是否在同一行显示
  children?: React.ReactNode; // 用来接受自定义的输入组件
}

const SectionInput: React.FC<SectionProps> = ({
  label,
  labelStyle,
  inputStyle,
  inline = false,
  children,
  ...rest
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={[styles.container, inline && styles.inlineContainer]}>
      {/* Label */}
      <Text style={[styles.label, labelStyle]}>{label}</Text>

      {/* 如果有传入 children，就渲染 children，否则渲染 TextInput */}
      {children ? (
        children
      ) : (
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={label}
          {...rest} // 传递所有剩余的 props
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inlineContainer: {
    flexDirection: 'row', // 设置为行布局
    alignItems: 'center', // 垂直居中对齐
  },
  label: {
    marginBottom: 5, // 默认标签和输入框之间的间距
    ...fontStyle.subheading,
  },
  input: {
    minHeight: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    ...fontStyle.bodyMedium,
  },
});

export default SectionInput;
