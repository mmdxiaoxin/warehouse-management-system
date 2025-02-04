import {Icon, ListItem, Text} from '@rneui/themed';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import AnimatedItem from '../../components/AnimatedItem';
import {InventoryScreenProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InventoryScreen({navigation}: InventoryScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text
        h4
        h4Style={{
          padding: 20,
          color: colorStyle.textPrimary,
          textAlign: 'center',
        }}>
        库存管理
      </Text>

      <View style={styles.listItemContainer}>
        {/* 使用封装后的 AnimatedItem 组件 */}
        <AnimatedItem
          itemKey="cargoInventory"
          onPress={() => navigation.navigate('CargoInventory')}>
          <ListItem>
            <Icon name="inbox" type="antdesign" color="#0cabce" />
            <ListItem.Content>
              <ListItem.Title>货品库存</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </AnimatedItem>

        <AnimatedItem
          itemKey="inboundRecord"
          onPress={() => navigation.navigate('InboundRecord')}>
          <ListItem bottomDivider>
            <Icon name="login" type="antdesign" color="#f32598" size={22} />
            <ListItem.Content>
              <ListItem.Title>入库管理</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </AnimatedItem>

        <AnimatedItem
          itemKey="outboundRecord"
          onPress={() => navigation.navigate('OutboundRecord')}>
          <ListItem>
            <Icon name="logout" type="antdesign" color="#e825f3" size={22} />
            <ListItem.Content>
              <ListItem.Title>出库管理</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </AnimatedItem>
      </View>
    </SafeAreaView>
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
