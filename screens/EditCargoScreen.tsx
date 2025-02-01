import {useObject} from '@realm/react';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {BSON} from 'realm';
import AdvancedButton from '../components/AdvancedButton';
import SectionInput from '../components/SectionInput';
import {useCargo} from '../hooks/useCargo';
import {Cargo} from '../models/Cargo';
import {EditCargoProps} from '../routes';
import {fontStyle, pickerSelectStyles} from '../styles';

export default function EditCargoScreen({navigation, route}: EditCargoProps) {
  const cargoId = new BSON.ObjectId(route.params?.cargoId);

  const {updateCargo} = useCargo();
  const foundCargo = useObject(Cargo, cargoId);

  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCategory, setNewCargoCategory] = useState('');
  const [newCargoUnit, setNewCargoUnit] = useState('个');
  const [newCargoDescription, setNewCargoDescription] = useState('');

  // 获取原始 Cargo 数据
  useEffect(() => {
    if (foundCargo) {
      setNewCargoName(foundCargo.name);
      setNewCargoCategory(foundCargo.category);
      setNewCargoUnit(foundCargo.unit);
      setNewCargoDescription(foundCargo.description || '');
    }

    return () => {
      setNewCargoName('');
      setNewCargoCategory('');
      setNewCargoUnit('个');
      setNewCargoDescription('');
    };
  }, [foundCargo]);

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

      updateCargo(foundCargo._id, {
        name: newCargoName,
        category: newCargoCategory,
        unit: newCargoUnit,
        description: newCargoDescription,
      });

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>编辑货物</Text>

      {/* 货物名称 */}
      <SectionInput
        label="货物名称"
        value={newCargoName}
        onChangeText={setNewCargoName}
        placeholder="请输入货物名称"
      />

      {/* 货物类别 */}
      <SectionInput label="货物类别">
        <RNPickerSelect
          value={newCargoCategory}
          onValueChange={setNewCargoCategory}
          items={[
            {label: '门', value: '门'},
            {label: '地板', value: '地板'},
            {label: '辅料', value: '辅料'},
          ]}
          style={pickerSelectStyles}
        />
      </SectionInput>

      {/* 货物单位 */}
      <SectionInput
        label="货物单位"
        value={newCargoUnit}
        onChangeText={setNewCargoUnit}
        placeholder="请输入货物单位"
      />

      {/* 货物描述 */}
      <SectionInput
        label="货物描述"
        value={newCargoDescription}
        onChangeText={setNewCargoDescription}
        placeholder="请输入货物描述"
      />

      {/* 保存按钮 */}
      <AdvancedButton
        title="保存"
        onPress={handleSaveCargo}
        type="primary"
        buttonStyle={{marginBottom: 10}}
      />

      {/* 取消按钮 */}
      <AdvancedButton
        title="取消"
        onPress={() => navigation.goBack()}
        type="warning"
        buttonStyle={{marginBottom: 10}}
      />

      {/* 库管 */}
      <AdvancedButton
        title="库管"
        onPress={() =>
          navigation.navigate('HomeTabs', {
            screen: 'Management',
            params: {cargoId: foundCargo._id.toHexString()},
          })
        }
        type="success"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },
});
