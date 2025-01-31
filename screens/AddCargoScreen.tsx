import {NavigationProp} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import SectionInput from '../components/SectionInput'; // 假设Section组件已经在项目中
import {useCargo} from '../hooks/useCargo';
import {RootStackParamList} from '../routes';
import {colorStyle, fontStyle} from '../styles';
import AdvancedButton from '../components/AdvancedButton';

export default function AddCargoScreen({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) {
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
    <View style={styles.container}>
      <Text style={styles.title}>添加新货物</Text>

      <SectionInput
        label="货物名称"
        placeholder="请输入新的货物名称"
        value={newCargoName}
        onChangeText={setNewCargoName}
      />

      <SectionInput label="货物类别">
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
      </SectionInput>

      <SectionInput
        label="货物单位"
        placeholder="请输入货物单位"
        value={newCargoUnit}
        onChangeText={setNewCargoUnit}
      />

      <SectionInput
        label="货物描述"
        placeholder="请输入新的货物描述"
        value={newCargoDescription}
        onChangeText={setNewCargoDescription}
      />

      {/* 确认添加按钮 */}
      <AdvancedButton
        title="确认添加"
        onPress={handleAddCargo}
        buttonStyle={{marginBottom: 10}}
        type="success"
      />
      {/* 取消按钮 */}
      <AdvancedButton
        title="取消添加"
        onPress={() => navigation.goBack()}
        buttonStyle={{marginBottom: 40}}
        type="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
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
