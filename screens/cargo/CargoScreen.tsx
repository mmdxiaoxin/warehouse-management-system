import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {Icon, ListItem, Text} from '@rneui/themed';
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
      <ListItem onPress={() => navigation.navigate('CargoManagement')}>
        <Icon name="isv" type="antdesign" color="grey" />
        <ListItem.Content>
          <ListItem.Title>货品管理</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem>
        <Icon name="category" type="material" color="grey" />
        <ListItem.Content>
          <ListItem.Title>货品分类</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <View style={{paddingVertical: 10}}></View>
      <ListItem>
        <Icon name="folder-open" type="font-awesome" color="grey" />
        <ListItem.Content>
          <ListItem.Title>类别管理</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem>
        <Icon name="balance-scale" type="font-awesome" color="grey" />
        <ListItem.Content>
          <ListItem.Title>单位管理</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem>
        <Icon name="cogs" type="font-awesome" color="grey" />
        <ListItem.Content>
          <ListItem.Title>规格管理</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
});
