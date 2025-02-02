import {Icon, ListItem, Text} from '@rneui/themed';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {InventoryScreenProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InventoryScreen({navigation}: InventoryScreenProps) {
  return (
    <ScrollView style={styles.container}>
      <Text
        h4
        h4Style={{
          padding: 20,
          color: colorStyle.textPrimary,
          textAlign: 'center',
        }}>
        库存管理
      </Text>

      <ListItem onPress={() => navigation.navigate('CargoInventory')}>
        <Icon name="inbox" type="antdesign" color="grey" />
        <ListItem.Content>
          <ListItem.Title>货品库存</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <View style={{paddingVertical: 10}}></View>

      <ListItem onPress={() => navigation.navigate('OutboundManagement')}>
        <Icon name="logout" type="antdesign" color="grey" size={22} />
        <ListItem.Content>
          <ListItem.Title>出库管理</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem onPress={() => navigation.navigate('InboundManagement')}>
        <Icon name="login" type="antdesign" color="grey" size={22} />
        <ListItem.Content>
          <ListItem.Title>入库管理</ListItem.Title>
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
