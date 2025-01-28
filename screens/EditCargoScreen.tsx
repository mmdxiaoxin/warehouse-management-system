import React, {useState, useEffect} from 'react';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {cargoRepository} from '../models/CargoRepository';
import {CargoData} from '../models/CargoRepository'; // 导入 CargoData 类型
import RNPickerSelect from 'react-native-picker-select';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native'; // 用于路由和导航
import {RootStackParamList} from '../routes';

export default function EditCargoScreen() {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const navigation = useNavigation();

  const cargoId = route.params?.cargoId; // 获取传递的 cargoId
  const [cargo, setCargo] = useState<CargoData | null>(null);

  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCategory, setNewCargoCategory] = useState('');
  const [newCargoQuantity, setNewCargoQuantity] = useState('0');
  const [newCargoUnit, setNewCargoUnit] = useState('个');
  const [newCargoDescription, setNewCargoDescription] = useState('');

  // 获取原始 Cargo 数据
  useEffect(() => {
    if (cargoId) {
      cargoRepository.getCargoById(cargoId).then(data => {
        if (data) {
          setCargo(data);
          setNewCargoName(data.name);
          setNewCargoCategory(data.category);
          setNewCargoQuantity(data.quantity.toString());
          setNewCargoUnit(data.unit);
          setNewCargoDescription(data.description || '');
        }
      });
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
    const quantity = parseInt(newCargoQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('请输入有效的货物数量');
      return;
    }

    try {
      if (!cargo) {
        throw new Error('货物数据不存在');
      }
      await cargoRepository.updateCargo(cargoId as string, {
        name: newCargoName,
        category: newCargoCategory,
        quantity: quantity,
        unit: newCargoUnit,
        description: newCargoDescription,
        ctime: cargo?.ctime || new Date(), // 保持原有的创建时间
        utime: new Date(), // 更新时间
      });
      Alert.alert('货物更新成功');
      navigation.goBack(); // 返回上一页
    } catch (error) {
      console.error('更新货物失败:', error);
      Alert.alert('更新货物失败，请重试！');
    }
  };

  if (!cargo) {
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

      {/* 货物数量 */}
      <Text style={styles.label}>货物数量:</Text>
      <TextInput
        style={styles.input}
        value={newCargoQuantity}
        onChangeText={setNewCargoQuantity}
        placeholder="请输入货物数量"
        keyboardType="numeric"
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
