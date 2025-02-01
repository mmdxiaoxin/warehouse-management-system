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
import RNPickerSelect from 'react-native-picker-select';
import {colorStyle, fontStyle} from '../styles';

interface CargoSpecItem {
  key: string;
  value: string;
}

export type CargoSpec = CargoSpecItem[];

interface CargoSpecInputProps {
  specifications: CargoSpec;
  onChange: (specs: CargoSpec) => void;
}

const CargoSpecInput: React.FC<CargoSpecInputProps> = ({
  specifications,
  onChange,
}) => {
  const [key, setKey] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [unit, setUnit] = useState<string>(''); // 选择的单位

  const handleAddSpec = () => {
    // 校验 key 和 value 是否为空
    if (!key || !value || !unit) {
      Alert.alert('错误', '规格名称、规格值和单位不能为空');
      return;
    }

    // 校验 key 是否重复
    if (specifications.some(spec => spec.key === key)) {
      Alert.alert('错误', '规格名称不能重复');
      return;
    }

    // 将单位添加到 value 中
    const updatedValue = `${value} ${unit}`;

    // 添加新的规格
    const newSpec = {key, value: updatedValue};
    const updatedSpecs = [...specifications, newSpec];
    setKey('');
    setValue('');
    setUnit('');
    onChange(updatedSpecs);
  };

  const handleRemoveSpec = (keyToRemove: string) => {
    const updatedSpecs = specifications.filter(
      spec => spec.key !== keyToRemove,
    );
    onChange(updatedSpecs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>输入货物规格</Text>

      {/* 规格表格展示 */}
      {specifications.length > 0 && (
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
          {specifications.map((spec, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, {flex: 2}]}>{spec.key}</Text>
              <Text style={[styles.tableCell, {flex: 2}]}>{spec.value}</Text>
              <View style={styles.tableCell}>
                <Button
                  onPress={() => handleRemoveSpec(spec.key)}
                  color={'error'}>
                  删除
                </Button>
              </View>
            </View>
          ))}
        </View>
      )}

      {specifications.length > 0 && (
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

      {/* 单位选择器 */}
      <View>
        <RNPickerSelect
          style={pickerSelectStyles}
          placeholder={{label: '选择单位', value: ''}}
          value={unit}
          onValueChange={setUnit}
          items={[
            //重量
            {label: 'kg', value: 'kg'},
            {label: 'g', value: 'g'},
            //长度
            {label: 'm', value: 'm'},
            {label: 'cm', value: 'cm'},
            {label: 'mm', value: 'mm'},
            //体积
            {label: 'm³', value: 'm³'},
            {label: 'dm³', value: 'dm³'},
            {label: 'cm³', value: 'cm³'},
            //面积
            {label: 'm²', value: 'm²'},
            {label: 'dm²', value: 'dm²'},
            {label: 'cm²', value: 'cm²'},
          ]}
        />
      </View>

      <Button onPress={handleAddSpec} color={'success'}>
        添加
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colorStyle.borderLight,
    marginBottom: 15,
    backgroundColor: colorStyle.backgroundLight,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: '100%',
  },
});

export default CargoSpecInput;
