import {ListItem} from '@rneui/base';
import {Button, Icon, SearchBar, Text} from '@rneui/themed';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useCategory} from '../../../hooks/useCategory';
import {CategoryManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';

export default function CategoryManage({navigation}: CategoryManageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const {categories} = useCategory();

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="输入关键词"
        value={searchQuery}
        onChangeText={setSearchQuery}
        platform="android"
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
        data={categories}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => (
          <ListItem>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        )}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: colorStyle.textSecondary,
            }}>
            当前暂无数据
          </Text>
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
