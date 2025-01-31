import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useObject} from '@realm/react';
import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import {useCargo} from '../hooks/useCargo';
import {Cargo} from '../models/Cargo';
import {RootStackParamList} from '../routes';

export default function EditCargoScreen() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const {updateCargo} = useCargo();

  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCategory, setNewCargoCategory] = useState('');
  const [newCargoUnit, setNewCargoUnit] = useState('个');
  const [newCargoDescription, setNewCargoDescription] = useState('');
  const foundCargo = useObject(Cargo, cargoId);

  // 获取原始 Cargo 数据
  useEffect(() => {
    if (cargoId) {
      if (foundCargo) {
        setNewCargoName(foundCargo.name);
        setNewCargoCategory(foundCargo.category);
        setNewCargoUnit(foundCargo.unit);
        setNewCargoDescription(foundCargo.description || '');
      }
    }
  }, [cargoId]);

  // 校验输入数据
  const handleSaveCargo = async () => {
    if (!newCargoName.trim()) {
      Alert.alert('请输入货物名称');
      return;
    }
    if (!newCargoCategory.trim()) {
      Alert.alert('请选择货物类别');
      return;
    }

    try {
      if (!foundCargo) {
        throw new Error('货物数据不存在');
      }

      // 更新货物信息
      if (cargoId) {
        updateCargo(cargoId, {
          name: newCargoName,
          category: newCargoCategory,
          unit: newCargoUnit,
          description: newCargoDescription,
        });
      }

      Alert.alert('货物更新成功');
      navigation.goBack(); // 返回上一页
    } catch (error) {
      console.error('更新货物失败:', error);
      Alert.alert('更新货物失败，请重试！');
    }
  };

  if (!foundCargo) {
    return <Text>加载货物信息...</Text>; // 如果 cargo 数据未加载完成，显示加载信息
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>编辑货物</Text>

      {/* 货物名称 */}
      <Text style={styles.label}>货物名称:</Text>
      <TextInput
        style={styles.input}
        value={newCargoName}
        onChangeText={setNewCargoName}
        placeholder="请输入货物名称"
      />

      {/* 货物类别 */}
      <Text style={styles.label}>货物类别:</Text>
      <RNPickerSelect
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
        value={newCargoUnit}
        onChangeText={setNewCargoUnit}
        placeholder="请输入货物单位"
      />

      {/* 货物描述 */}
      <Text style={styles.label}>货物描述:</Text>
      <TextInput
        style={styles.input}
        value={newCargoDescription}
        onChangeText={setNewCargoDescription}
        placeholder="请输入货物描述"
      />

      {/* 保存按钮 */}
      <Button title="保存" onPress={handleSaveCargo} color="#4CAF50" />

      {/* 取消按钮 */}
      <Button
        title="取消"
        onPress={() => navigation.goBack()}
        color="#f44336"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});

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
    backgroundColor: '#fff',
    paddingRight: 30, // to ensure the text is not overrun by the icon
  },
});
