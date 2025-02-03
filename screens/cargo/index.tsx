import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {Icon, ListItem, Text} from '@rneui/themed';
import {Alert} from 'react-native';
import {CargoScreenProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function CargoScreen({navigation}: CargoScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <Text
        h4
        h4Style={{
          padding: 20,
          color: colorStyle.textPrimary,
          textAlign: 'center',
        }}>
        货品管理
      </Text>

      <View style={styles.listItemContainer}>
        <ListItem
          onPress={() => navigation.navigate('CargoManage')}
          bottomDivider>
          <Icon name="isv" type="antdesign" color="#ec4b31" />
          <ListItem.Content>
            <ListItem.Title>货品管理</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          onPress={() => {
            // TODO: 跳转到货品分类
            // navigation.navigate('CargoManage');
            Alert.alert('提示', '功能开发中，敬请期待！');
          }}>
          <Icon name="category" type="material" color="#a640ee" />
          <ListItem.Content>
            <ListItem.Title>货品分类</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>

      <View style={styles.listItemContainer}>
        <ListItem
          onPress={() => navigation.navigate('CategoryManage')}
          bottomDivider>
          <Icon name="folder-open" type="font-awesome" color="#26b0e9" />
          <ListItem.Content>
            <ListItem.Title>类别管理</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem
          onPress={() => navigation.navigate('UnitManage')}
          bottomDivider>
          <Icon name="balance-scale" type="font-awesome" color="#ec8a1f" />
          <ListItem.Content>
            <ListItem.Title>单位管理</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem onPress={() => navigation.navigate('ModelManage')}>
          <Icon name="cogs" type="font-awesome" color="#fabc00" />
          <ListItem.Content>
            <ListItem.Title>规格管理</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  listItemContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
