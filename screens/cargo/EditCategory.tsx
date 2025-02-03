import {useObject} from '@realm/react';
import {Button} from '@rneui/themed';
import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet} from 'react-native';
import {BSON} from 'realm';
import FormItem from '../../components/FormItem';
import {useCategory} from '../../hooks/useCategory';
import {Category} from '../../models/Category';
import {EditCategoryProps} from '../../routes/types';
import {fontStyle} from '../../styles';

export default function EditCategory({navigation, route}: EditCategoryProps) {
  const categoryId = new BSON.ObjectId(route.params?.categoryId);
  const category = useObject(Category, categoryId);

  const [newName, setNewName] = useState(category?.name || '');
  const [newDescription, setNewDescription] = useState(
    category?.description || '',
  );

  const {categories, updateCategory} = useCategory(); // 使用 useCategory 钩子

  const handleSave = () => {
    // 校验输入字段是否为空
    if (!newName.trim()) {
      Alert.alert('请输入类别名称');
      return;
    }

    try {
      const found = categories.find(c => c.name === newName);
      if (found && found._id.toString() !== categoryId.toString()) {
        throw new Error('类别名称已存在');
      }

      updateCategory(categoryId, {
        name: newName,
        description: newDescription,
      });
    } catch (error: any) {
      Alert.alert(`修改失败: ${error.message}!`);
      return;
    }
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
        title="保存修改"
        onPress={handleSave}
        buttonStyle={{marginBottom: 10}}
        color="success"
      />

      <Button
        title="取消修改"
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
