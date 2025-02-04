import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, ToastAndroid} from 'react-native';
import FormItem from '../../../components/FormItem';
import {useUnit} from '../../../hooks/useUnit';
import {AddUnitProps} from '../../../routes/types';

export default function AddUnit({navigation}: AddUnitProps) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const {units, createUnit} = useUnit();

  // 处理添加单位
  const handleAdd = () => {
    // 校验输入字段是否为空
    if (!newName.trim()) {
      Alert.alert('请输入单位名称');
      return;
    }

    try {
      units.forEach(unit => {
        if (unit.name === newName) {
          throw new Error('单位已存在');
        }
      });

      const newId = createUnit(newName, newDescription);
      if (!newId) {
        throw new Error('创建单位失败');
      }

      ToastAndroid.show('添加单位成功', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert(`添加单位失败: ${error.message}!`);
      return;
    }
  };
  return (
    <ScrollView style={styles.container}>
      <FormItem
        inline
        label="单位名称"
        placeholder="请输入新的单位名称"
        value={newName}
        onChangeText={setNewName}
      />

      <FormItem
        inline
        label="备注"
        placeholder="请输入备注(可选)"
        value={newDescription}
        onChangeText={setNewDescription}
      />

      {/* 确认添加按钮 */}
      <Button
        title="确认添加"
        onPress={handleAdd}
        buttonStyle={{marginBottom: 10}}
        color="success"
      />

      <Button
        title="取消添加"
        onPress={() => navigation.goBack()}
        buttonStyle={{marginBottom: 10}}
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
