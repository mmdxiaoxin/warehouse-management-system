import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {cargoRepository} from '../models/CargoRepository';

export default function AddCargoScreen({navigation}: any) {
  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCount, setNewCargoCount] = useState('0');
  const [newCargoCategory, setNewCargoCategory] = useState('');

  const handleAddCargo = async () => {
    if (!newCargoName || !newCargoCategory) {
      Alert.alert('请输入货物名称和类别');
      return;
    }

    try {
      await cargoRepository.createCargo({
        name: newCargoName,
        count: parseInt(newCargoCount),
        category: newCargoCategory,
      });
      Alert.alert('新货物添加成功!');
      navigation.goBack(); // 返回到库存页面
    } catch (error) {
      console.error('Error adding cargo:', error);
      Alert.alert('添加货物失败，请重试！');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>添加新货物</Text>

      {/* 货物名称 */}
      <Text style={styles.label}>货物名称:</Text>
      <TextInput
        style={styles.input}
        placeholder="请输入新的货物名称"
        value={newCargoName}
        onChangeText={setNewCargoName}
      />

      {/* 货物数量 */}
      <Text style={styles.label}>货物数量:</Text>
      <TextInput
        style={styles.input}
        placeholder="请输入货物数量"
        keyboardType="numeric"
        value={newCargoCount.toString()}
        onChangeText={setNewCargoCount}
      />

      {/* 货物类别选择框 */}
      <Text style={styles.label}>货物类别:</Text>
      <RNPickerSelect
        placeholder={{label: '请选择货物类别', value: ''}}
        value={newCargoCategory}
        onValueChange={setNewCargoCategory}
        items={[
          {label: '木门', value: '木门'},
          {label: '木地板', value: '木地板'},
          {label: '辅料', value: '辅料'},
        ]}
        style={pickerSelectStyles}
      />

      <Button title="确认添加" onPress={handleAddCargo} />
      <Button title="取消" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
});

// RNPickerSelect 样式
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is not overrun by the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is not overrun by the icon
  },
});
