import {ListItem} from '@rneui/base';
import {Button, Icon, SearchBar, Text} from '@rneui/themed';
import React from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import {BSON} from 'realm';
import {useUnit} from '../../../hooks/useUnit';
import {UnitManageProps} from '../../../routes/types';
import {colorStyle} from '../../../styles';

export default function UnitManage({navigation}: UnitManageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const {units, deleteUnit} = useUnit();

  const handleDelete = (id: BSON.ObjectId) => {
    try {
      Alert.alert('删除确认', '确定要删除该单位吗？', [
        {text: '取消', style: 'cancel'},
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteUnit(id);
          },
        },
      ]);
    } catch (error) {
      console.error('删除单位失败:', error);
    }
  };

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="输入关键词"
        value={searchQuery}
        onChangeText={setSearchQuery}
        platform="android"
        containerStyle={{borderRadius: 50}}
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
          navigation.navigate('AddUnit');
        }}
      />
      <FlatList
        style={{marginTop: 10, marginBottom: 80}}
        data={filteredUnits}
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
                    navigation.navigate('EditUnit', {
                      unitId: item._id.toHexString(),
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
              <Icon name="balance-scale" type="font-awesome" />
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem.Swipeable>
          </View>
        )}
        ListFooterComponent={
          filteredUnits.length === 0 ? (
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
              共{filteredUnits.length}条数据
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
