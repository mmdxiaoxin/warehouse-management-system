import {Button, Divider} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colorStyle, fontStyle} from '../styles';

interface ModelValueItem {
  key: string;
  value: string;
}

export type ModelValue = ModelValueItem[];

interface ModelValueInputProps {
  modelValue: ModelValue;
  onChange: (specs: ModelValue) => void;
}

const ModelValueInput: React.FC<ModelValueInputProps> = ({
  modelValue,
  onChange,
}) => {
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const handleAdd = () => {
    // 校验 key 和 value 是否为空
    if (!key || !value) {
      Alert.alert('错误', '规格名称、规格值和单位不能为空');
      return;
    }

    // 校验 key 是否重复
    if (modelValue.some(spec => spec.key === key)) {
      Alert.alert('错误', '规格名称不能重复');
      return;
    }

    // 添加新的规格
    const newSpec = {key, value};
    const updatedSpecs = [...modelValue, newSpec];
    setKey('');
    setValue('');
    onChange(updatedSpecs);
  };

  const handleRemoveSpec = (keyToRemove: string) => {
    const updatedSpecs = modelValue.filter(spec => spec.key !== keyToRemove);
    onChange(updatedSpecs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{`输入规格详情: (选填)`}</Text>

      {/* 规格表格展示 */}
      {modelValue.length > 0 && (
        <View style={styles.table}>
          {/* 表头 */}
          <View style={styles.tableRow}>
            <Text
              style={[styles.tableHeaderCell, styles.tableHeader, {flex: 2}]}>
              规格名称
            </Text>
            <Text
              style={[styles.tableHeaderCell, styles.tableHeader, {flex: 2}]}>
              规格值
            </Text>
            <Text
              style={[styles.tableHeaderCell, styles.tableHeader, {flex: 1}]}>
              操作
            </Text>
          </View>

          {/* 数据行 */}
          {modelValue.map((spec, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, {flex: 2}]}>{spec.key}</Text>
              <Text style={[styles.tableCell, {flex: 2}]}>{spec.value}</Text>
              <View style={styles.tableCell}>
                <Button
                  buttonStyle={{borderRadius: 5}}
                  onPress={() => handleRemoveSpec(spec.key)}
                  color={'error'}>
                  删除
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}

      {modelValue.length > 0 && (
        <Divider width={1} style={{marginVertical: 10}} />
      )}

      {/* 键值对输入框 */}
      <KeyboardAvoidingView
        style={styles.inputRow}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <TextInput
          style={styles.input}
          placeholder="规格名称"
          value={key}
          onChangeText={setKey}
        />
        <TextInput
          style={styles.input}
          placeholder="规格值"
          value={value}
          onChangeText={setValue}
        />
      </KeyboardAvoidingView>

      <Button onPress={handleAdd} color={'success'} disabled={!key || !value}>
        添加
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: colorStyle.backgroundLight,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '49%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    ...fontStyle.bodyMedium,
  },

  // 表格相关样式
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    flex: 1,
  },
  tableCell: {
    flex: 1,
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
});

export default ModelValueInput;
