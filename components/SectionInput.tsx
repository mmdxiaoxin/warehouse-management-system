import React from 'react';
import {View, Text, TextInput, StyleSheet, TextInputProps} from 'react-native';

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
    <View style={[styles.container, inline && styles.inlineContainer]}>
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
    </View>
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
    fontSize: 18,
    marginBottom: 5, // 默认标签和输入框之间的间距
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    flex: 1, // 使输入框自适应宽度
  },
});

export default SectionInput;
