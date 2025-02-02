import {Input} from '@rneui/themed';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from 'react-native';
import {colorStyle} from '../styles';

interface SectionProps extends TextInputProps {
  label: string; // 标签
  separator?: React.ReactNode | string; // 分隔符
  labelStyle?: object; // 标签样式
  labelContainerStyle?: object; // 标签容器样式
  inputStyle?: object; // 输入框样式
  inline?: boolean; // 标签和输入框是否在同一行
  children?: React.ReactNode; // 自定义输入组件
  errorMessage?: string; // 错误信息
}

const FormItem: React.FC<SectionProps> = ({
  label,
  separator = ':',
  labelStyle,
  labelContainerStyle,
  inputStyle,
  inline = false,
  children,
  errorMessage,
  style,
  ...rest
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        inline && styles.inlineContainer,
        !children && {alignItems: 'baseline'},
        style,
      ]}>
      {/* 标签 */}
      <View style={[styles.labelContainer, labelContainerStyle]}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {inline && (
          <Text style={[styles.label, {paddingStart: 5}]}>{separator}</Text>
        )}
      </View>

      {/* 输入框或自定义组件 */}
      {children ? (
        children
      ) : (
        <Input
          {...rest}
          placeholder={label}
          containerStyle={{flex: 1}}
          inputStyle={[styles.input, inputStyle]}
          errorStyle={{color: colorStyle.danger}}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: colorStyle.backgroundLight,
  },
  inlineContainer: {
    flexDirection: 'row',
    height: 50,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colorStyle.textPrimary,
  },
  input: {
    fontSize: 16,
  },
});

export default FormItem;
