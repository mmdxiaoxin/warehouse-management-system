import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {cargoRepository} from '../models/CargoRepository';

export default function AddCargoScreen({navigation}: any) {
  const [newCargoName, setNewCargoName] = useState('');

  const handleAddCargo = async () => {
    if (!newCargoName) {
      Alert.alert('请输入货物名称');
      return;
    }

    try {
      await cargoRepository.createCargo({name: newCargoName});
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
      <TextInput
        style={styles.input}
        placeholder="请输入新的货物名称"
        value={newCargoName}
        onChangeText={setNewCargoName}
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
});
