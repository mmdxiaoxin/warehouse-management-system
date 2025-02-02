import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import FormItem from '../../components/FormItem'; // 假设Section组件已经在项目中
import {useCargo} from '../../hooks/useCargo';
import {AddCargoProps} from '../../routes/types';
import {pickerSelectStyles} from '../../styles';

export default function AddCargo({navigation}: AddCargoProps) {
  const [newCargoName, setNewCargoName] = useState('');
  const [newCargoCategory, setNewCargoCategory] = useState('');
  const [newCargoUnit, setNewCargoUnit] = useState('个');
  const [newCargoDescription, setNewCargoDescription] = useState('');

  const {createCargo} = useCargo(); // 使用 useCargo 钩子

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
      const newCargoId = createCargo({
        name: newCargoName,
        category: newCargoCategory,
        unit: newCargoUnit,
        description: newCargoDescription,
      });
      if (!newCargoId) {
        throw new Error('创建货物失败');
      }
      Alert.alert('新货物添加成功!');
      navigation.goBack(); // 返回到库存页面
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
          items={[
            {label: '门', value: '门'},
            {label: '地板', value: '地板'},
            {label: '辅料', value: '辅料'},
          ]}
          style={pickerSelectStyles}
        />
      </FormItem>

      <FormItem
        inline
        label="货物单位"
        placeholder="请输入货物单位"
        value={newCargoUnit}
        onChangeText={setNewCargoUnit}
      />

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
        onPress={handleAddCargo}
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
