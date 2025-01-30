import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import Divider from '../components/Divider';
import SectionInput from '../components/SectionInput'; // 假设 Section 组件已存在
import {useCargo} from '../hooks/useCargo';
import {colorStyle} from '../styles';

export default function OutboundScreen({navigation}: any) {
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId>(); // 当前选择的货物

  const {cargoList, deleteCargo} = useCargo();

  // 处理删除货物
  const handleDeleteCargo = () => {
    if (selectedCargo) {
      Alert.alert(
        '删除货物',
        '确定要删除该货物吗？',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '确定',
            onPress: async () => {
              // 删除货物
              await deleteCargo(selectedCargo);
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 货物选择 */}
      <SectionInput label="货物选择">
        <RNPickerSelect
          placeholder={{label: '请选择货物', value: ''}}
          value={selectedCargo}
          onValueChange={setSelectedCargo}
          items={
            cargoList.map(cargo => ({
              label: cargo.name,
              value: cargo._id,
            })) || []
          }
          style={pickerSelectStyles}
        />
      </SectionInput>

      <Divider />

      {/* 删除货物按钮 */}
      <TouchableOpacity style={styles.addButton} onPress={handleDeleteCargo}>
        <Text style={styles.addButtonText}>删除货物</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: colorStyle.buttonPrimary,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: colorStyle.danger,
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
