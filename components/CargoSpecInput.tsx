import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

interface CargoSpecItem {
  key: string;
  value: string;
}

type CargoSpec = CargoSpecItem[];

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

      {/* 键值对输入框 */}
      <KeyboardAvoidingView style={styles.inputRow}>
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

      {/* 规格列表展示 */}
      <View>
        {specs.map((spec, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={styles.specText}>
              {spec.key}: {spec.value}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveSpec(spec.key)}
              style={styles.removeButton}>
              <Text style={styles.removeButtonText}>删除</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  header: {
    fontSize: 18,
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
    width: '40%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
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
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specText: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#f44336',
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
