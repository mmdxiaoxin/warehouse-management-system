import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import FormItem from '../../components/FormItem';
import {useCategory} from '../../hooks/useCategory';
import {AddCategoryProps} from '../../routes/types';
import {fontStyle} from '../../styles';

export default function AddCategory({navigation}: AddCategoryProps) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const {categories, createCategory} = useCategory(); // 使用 useCategory 钩子

  // 处理添加类别
  const handleAdd = () => {
    // 校验输入字段是否为空
    if (!newName.trim()) {
      Alert.alert('请输入类别名称');
      return;
    }

    try {
      categories.forEach(category => {
        if (category.name === newName) {
          throw new Error('类别已存在');
        }
      });

      const newId = createCategory(newName, newDescription);
      if (!newId) {
        throw new Error('创建类别失败');
      }
    } catch (error: any) {
      Alert.alert(`添加类别失败: ${error.message}!`);
      return;
    }
    Alert.alert('新类别添加成功!');
    navigation.goBack();
  };
  return (
    <ScrollView style={styles.container}>
      <FormItem
        inline
        label="类别名称"
        placeholder="请输入新的类别名称"
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
  title: {
    ...fontStyle.heading1,
    marginBottom: 20,
    textAlign: 'center',
  },
});
