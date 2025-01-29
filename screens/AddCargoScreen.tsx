import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {cargoRepository} from '../models/CargoRepository';

export default function AddCargoScreen({navigation}: any) {
  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCategory, setNewCargoCategory] = useState('');
  const [newCargoUnit, setNewCargoUnit] = useState('个');

  // 处理添加货物
  const handleAddCargo = async () => {
    // 校验输入字段是否为空
    if (!newCargoName.trim()) {
      Alert.alert('请输入货物名称');
      return;
    }

    // 校验类别是否选择
    if (!newCargoCategory) {
      Alert.alert('请选择货物类别');
      return;
    }

    try {
      await cargoRepository.createCargo({
        name: newCargoName,
        category: newCargoCategory,
        unit: newCargoUnit,
      });
      Alert.alert('新货物添加成功!');
      navigation.goBack(); // 返回到库存页面
    } catch (error) {
      console.error('添加货物时出错：', error);
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

      {/* 货物单位 */}
      <Text style={styles.label}>货物单位:</Text>
      <TextInput
        style={styles.input}
        placeholder="请输入货物单位"
        value={newCargoUnit}
        onChangeText={setNewCargoUnit}
      />

      {/* 按钮 */}
      <View style={styles.buttonContainer}>
        <Button title="确认添加" onPress={handleAddCargo} color="#4CAF50" />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="取消"
          onPress={() => navigation.goBack()}
          color="#f44336"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginVertical: 8,
    color: '#333',
  },
  buttonContainer: {
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
    borderColor: '#ddd',
    borderRadius: 5,
    color: 'black',
    backgroundColor: '#fff',
    paddingRight: 30, // to ensure the text is not overrun by the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is not overrun by the icon
  },
});
