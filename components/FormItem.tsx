import {Input, InputProps} from '@rneui/themed';
import React, {PropsWithChildren} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colorStyle} from '../styles';

// 定义 props 接口
interface SectionProps extends InputProps {
  label: string;
  separator?: React.ReactNode | string;
  labelStyle?: TextStyle;
  labelContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inline?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

// 抽取一个可复用的 `KeyboardAvoiding` 组件
const KeyboardAvoidingWrapper: React.FC<
  PropsWithChildren<{inline: boolean; style?: ViewStyle}>
> = ({inline, style, children}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={[styles.container, inline && styles.inlineContainer, style]}>
    {children}
  </KeyboardAvoidingView>
);

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
  // 渲染标签部分
  const renderLabel = () => (
    <View style={[styles.labelContainer, labelContainerStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {inline && (
        // 确保 separator 渲染方式正确
        <View style={[styles.separatorContainer, {paddingStart: 5}]}>
          {typeof separator === 'string' ? (
            <Text style={styles.separatorText}>{separator}</Text>
          ) : (
            separator
          )}
        </View>
      )}
    </View>
  );

  // 渲染输入框或自定义组件
  const renderInput = () => {
    if (children) {
      return children;
    }
    return (
      <Input
        {...rest}
        placeholder={label}
        containerStyle={{flex: 1}}
        inputStyle={[styles.input, inputStyle]}
        errorStyle={{color: colorStyle.danger}}
      />
    );
  };

  return (
    <KeyboardAvoidingWrapper inline={inline} style={style}>
      {renderLabel()}
      {renderInput()}
    </KeyboardAvoidingWrapper>
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
  separatorContainer: {
    flexDirection: 'row',
  },
  separatorText: {
    fontSize: 16,
    color: colorStyle.textPrimary,
  },
});

export default FormItem;
