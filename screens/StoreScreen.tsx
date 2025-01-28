import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {cargoRepository} from '../models/CargoRepository';
import Divider from '../components/Divider';

export default function StoreScreen() {
  const [cargoList, setCargoList] = useState<any[]>([]); // 存储货物种类
  const [filteredCargoList, setFilteredCargoList] = useState<any[]>([]); // 存储过滤后的货物种类
  const [selectedCargo, setSelectedCargo] = useState<string>(''); // 当前选择的货物
  const [quantity, setQuantity] = useState<string>(''); // 入库数量
  const [modalVisible, setModalVisible] = useState(false); // 控制添加新货物的弹窗
  const [newCargoName, setNewCargoName] = useState(''); // 新货物名称
  const [searchTerm, setSearchTerm] = useState(''); // 搜索框文本

  // 延迟搜索的时间（毫秒）
  const debounceDelay = 500;
  let debounceTimer: NodeJS.Timeout;

  // 获取所有货物数据（缓存到 state 中）
  const fetchCargoList = async () => {
    try {
      const cargos = await cargoRepository.getAllCargo();
      setCargoList(cargos); // 将货物列表存储到状态
      setFilteredCargoList(cargos); // 初始时展示所有货物
    } catch (error) {
      console.error('Failed to fetch cargo list:', error);
    }
  };

  // 初始化加载货物列表
  useEffect(() => {
    fetchCargoList();
  }, []);

  // 处理货物入库
  const handleAddToStore = () => {
    if (!selectedCargo || !quantity) {
      Alert.alert('Error', 'Please select a cargo and specify quantity');
      return;
    }
    // TODO: 在这里进行入库逻辑（例如更新数据库或调用API）
    Alert.alert('成功', `添加数量 ${quantity} 的 ${selectedCargo} 到库存`);
  };

  // 过滤货物列表
  const handleSearch = (text: string) => {
    setSearchTerm(text);

    // 清除现有的定时器
    clearTimeout(debounceTimer);

    // 设置新的延时执行
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

      {/* 货物选择 */}
      <Text style={styles.label}>货物选择:</Text>
      {/* 搜索框 */}
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

      {/* 入库数量选择 */}
      <Text style={styles.label}>入库数量:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="请输入入库数量"
      />

      {/* 入库按钮 */}
      <Button title="确认入库" onPress={handleAddToStore} />

      <Divider />

      {/* 添加新货物按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>添加新货物</Text>
      </TouchableOpacity>

      {/* 新货物的模态框 */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>添加新货物</Text>

            <TextInput
              style={styles.input}
              placeholder="请输入新的货物名称"
              value={newCargoName}
              onChangeText={setNewCargoName}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button
                title="确认添加"
                onPress={() => {
                  // TODO: 在此添加新货物的逻辑
                  // 例如通过 cargoRepository.createCargo 添加新的货物
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
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
