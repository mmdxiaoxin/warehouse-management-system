import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FormItem from '../../components/FormItem'; // 假设Section组件已经在项目中
import {useCargo} from '../../hooks/useCargo';
import {useCategory} from '../../hooks/useCategory';
import {useUnit} from '../../hooks/useUnit';
import {AddCargoProps} from '../../routes/types';
import {pickerSelectStyles} from '../../styles';

export default function AddCargo({navigation}: AddCargoProps) {
  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCategory, setNewCargoCategory] = useState('');
  const [newCargoUnit, setNewCargoUnit] = useState('个');
  const [newCargoDescription, setNewCargoDescription] = useState('');

  const {createCargo} = useCargo();
  const {categories} = useCategory();
  const {units} = useUnit();

  // 处理添加货物
  const handleAdd = async () => {
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

    // 校验单位是否选择
    if (!newCargoUnit) {
      Alert.alert('请选择货物单位');
      return;
    }

    try {
      const newCargoId = createCargo({
        name: newCargoName,
        category: newCargoCategory,
        unit: newCargoUnit,
        description: newCargoDescription,
      });
      if (!newCargoId) {
        throw new Error('创建货物失败');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('添加货物失败，请重试！');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FormItem
        inline
        label="货物名称"
        placeholder="请输入新的货物名称"
        value={newCargoName}
        onChangeText={setNewCargoName}
      />

      <FormItem inline label="货物类别">
        <RNPickerSelect
          placeholder={{label: '请选择货物类别', value: ''}}
          value={newCargoCategory}
          onValueChange={setNewCargoCategory}
          useNativeAndroidPickerStyle={false}
          items={categories.map(category => ({
            label: category.name,
            value: category.name,
          }))}
          style={pickerSelectStyles}
        />
      </FormItem>

      <FormItem inline label="货物单位">
        <RNPickerSelect
          placeholder={{label: '请选择货物单位', value: ''}}
          value={newCargoUnit}
          onValueChange={setNewCargoUnit}
          useNativeAndroidPickerStyle={false}
          items={units.map(unit => ({
            label: unit.name,
            value: unit.name,
          }))}
          style={pickerSelectStyles}
        />
      </FormItem>

      <FormItem
        inline
        label="货物描述"
        placeholder="请输入新的货物描述"
        value={newCargoDescription}
        onChangeText={setNewCargoDescription}
      />

      {/* 确认添加按钮 */}
      <Button
        title="确认添加"
        onPress={handleAdd}
        buttonStyle={{marginBottom: 10}}
        color="success"
      />

      {/* 取消按钮 */}
      <Button
        title="取消添加"
        onPress={() => navigation.goBack()}
        buttonStyle={{marginBottom: 40}}
        color="warning"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
});
