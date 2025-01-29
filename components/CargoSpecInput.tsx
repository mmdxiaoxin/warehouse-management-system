import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colorStyle, fontStyle} from '../styles';
import Divider from './Divider';

interface CargoSpecItem {
  key: string;
  value: string;
}

export type CargoSpec = CargoSpecItem[];

interface CargoSpecInputProps {
  onChange: (specs: CargoSpec) => void;
}

const CargoSpecInput: React.FC<CargoSpecInputProps> = ({onChange}) => {
  const [specs, setSpecs] = useState<CargoSpec>([]);
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const handleAddSpec = () => {
    // 校验 key 和 value 是否为空
    if (!key || !value) {
      Alert.alert('错误', '规格名称和规格值不能为空');
      return;
    }

    // 校验 key 是否重复
    if (specs.some(spec => spec.key === key)) {
      Alert.alert('错误', '规格名称不能重复');
      return;
    }

    // 添加新的规格
    const newSpec = {key, value};
    const updatedSpecs = [...specs, newSpec];
    setSpecs(updatedSpecs);
    setKey('');
    setValue('');
    onChange(updatedSpecs); // 向父组件传递更新的规格数据
  };

  const handleRemoveSpec = (keyToRemove: string) => {
    const updatedSpecs = specs.filter(spec => spec.key !== keyToRemove);
    setSpecs(updatedSpecs);
    onChange(updatedSpecs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>输入货物规格</Text>

      {/* 规格表格展示 */}
      {specs.length > 0 && (
        <View style={styles.table}>
          {/* 表头 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, styles.tableHeader]}>
              规格名称
            </Text>
            <Text style={[styles.tableHeaderCell, styles.tableHeader]}>
              规格值
            </Text>
            <Text style={[styles.tableHeaderCell, styles.tableHeader]}>
              操作
            </Text>
          </View>

          {/* 数据行 */}
          {specs.map((spec, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{spec.key}</Text>
              <Text style={styles.tableCell}>{spec.value}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveSpec(spec.key)}
                style={styles.removeButton}>
                <Text style={styles.removeButtonText}>删除</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {specs.length > 0 && <Divider />}

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
        <TouchableOpacity onPress={handleAddSpec} style={styles.addButton}>
          <Text style={styles.addButtonText}>添加</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    ...fontStyle.subheading,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '40%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    ...fontStyle.bodyMedium,
  },
  addButton: {
    backgroundColor: colorStyle.success,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

  // 删除按钮样式
  removeButton: {
    backgroundColor: colorStyle.danger,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CargoSpecInput;
