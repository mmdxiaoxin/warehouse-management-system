import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {cargoRepository} from '../models/CargoRepository';
import Divider from '../components/Divider';

export default function StoreScreen({navigation}: any) {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物种类
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储过滤后的货物种类
  const [selectedCargo, setSelectedCargo] = useState<string>(''); // 当前选择的货物
  const [quantity, setQuantity] = useState<string>(''); // 入库数量
  const [searchTerm, setSearchTerm] = useState(''); // 搜索框文本

  const debounceDelay = 500;
  let debounceTimer: NodeJS.Timeout;

  const fetchCargoList = async () => {
    try {
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(cargos);
      setFilteredCargoList(cargos);
    } catch (error) {
      console.error('Failed to fetch cargo list:', error);
    }
  };

  useEffect(() => {
    fetchCargoList();
  }, []);

  const handleAddToStore = () => {
    if (!selectedCargo || !quantity) {
      Alert.alert('Error', 'Please select a cargo and specify quantity');
      return;
    }
    Alert.alert('成功', `添加数量 ${quantity} 的 ${selectedCargo} 到库存`);
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const filtered = cargoList.filter(cargo =>
        cargo.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCargoList(filtered);
    }, debounceDelay);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>货物入库</Text>

      <Text style={styles.label}>货物选择:</Text>
      <TextInput
        style={styles.input}
        placeholder="过滤筛选"
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <RNPickerSelect
        placeholder={{label: '请选择货物', value: ''}}
        value={selectedCargo}
        onValueChange={value => setSelectedCargo(value)}
        items={filteredCargoList.map(cargo => ({
          label: cargo.name,
          value: cargo.name,
        }))}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>入库数量:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="请输入入库数量"
      />

      <Button title="确认入库" onPress={handleAddToStore} />

      <Divider />

      {/* 添加新货物按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddCargo')}>
        <Text style={styles.addButtonText}>添加新货物</Text>
      </TouchableOpacity>
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
  label: {
    fontSize: 18,
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
});
