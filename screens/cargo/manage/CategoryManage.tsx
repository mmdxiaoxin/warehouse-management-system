import {ListItem} from '@rneui/base';
import {Button, Icon, SearchBar, Text} from '@rneui/themed';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useCategory} from '../../../hooks/useCategory';
import {CategoryManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';
import {BSON} from 'realm';
import {Alert} from 'react-native';

export default function CategoryManage({navigation}: CategoryManageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const {categories, deleteCategory} = useCategory();

  const handleDelete = (id: BSON.ObjectId) => {
    try {
      Alert.alert('删除确认', '确定要删除该类别吗？', [
        {text: '取消', style: 'cancel'},
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteCategory(id);
          },
        },
      ]);
    } catch (error) {
      console.error('删除类别失败:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="输入关键词"
        value={searchQuery}
        onChangeText={setSearchQuery}
        lightTheme
        round
      />
      <Button
        icon={<Icon name="add" size={30} color={'white'} />}
        containerStyle={{
          zIndex: 100,
          position: 'absolute',
          right: 20,
          bottom: 20,
          width: 60,
          height: 60,
        }}
        buttonStyle={{width: 60, height: 60, borderRadius: 30}}
        onPress={() => {
          navigation.navigate('AddCategory');
        }}
      />
      <FlatList
        style={{marginTop: 10, marginBottom: 80}}
        data={filteredCategories}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <View style={{marginBottom: 10, backgroundColor: 'white'}}>
            <ListItem.Swipeable
              minSlideWidth={60}
              leftWidth={100}
              leftContent={
                <Button
                  title="编辑"
                  onPress={() => {
                    navigation.navigate('EditCategory', {
                      categoryId: item._id.toHexString(),
                    });
                  }}
                  icon={{name: 'edit', color: 'white'}}
                  buttonStyle={{minHeight: '100%', width: 100}}
                  color={'success'}
                />
              }
              rightWidth={100}
              rightContent={
                <Button
                  title="删除"
                  onPress={() => handleDelete(item._id)}
                  icon={{name: 'delete', color: 'white'}}
                  buttonStyle={{minHeight: '100%', width: 100}}
                  color={'error'}
                />
              }>
              <Icon name="label-important-outline" type="material" />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          </View>
        )}
        ListFooterComponent={
          filteredCategories.length === 0 ? (
            <Text
              style={{
                textAlign: 'center',
                color: colorStyle.textMuted,
                marginTop: 20,
              }}>
              当前暂无数据
            </Text>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: colorStyle.textSecondary,
              }}>
              共{filteredCategories.length}条数据
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    position: 'relative',
    flex: 1,
  },
});
