import {Icon, ListItem, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {InventoryScreenProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InventoryScreen({navigation}: InventoryScreenProps) {
  // 记录每个项的动画值
  const [animValues, setAnimValues] = useState<Map<string, Animated.Value>>(
    new Map(),
  );

  // 处理点击时的动画效果
  const handleItemPress = (itemKey: string) => {
    let animValue = animValues.get(itemKey);

    // 如果没有找到该项的动画值，则初始化它
    if (!animValue) {
      animValue = new Animated.Value(1);
      animValues.set(itemKey, animValue);
    }

    // 执行点击动画
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95, // 点击时稍微缩小
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1, // 还原回原来大小
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
        {/* 使用 TouchableOpacity 和 Animated.View 配合来实现点击效果 */}
        <TouchableOpacity
          onPress={() => {
            handleItemPress('cargoInventory');
            navigation.navigate('CargoInventory');
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    animValues.get('cargoInventory') || new Animated.Value(1),
                },
              ],
            }}>
            <ListItem>
              <Icon name="inbox" type="antdesign" color="#0cabce" />
              <ListItem.Content>
                <ListItem.Title>货品库存</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.listItemContainer}>
        <TouchableOpacity
          onPress={() => {
            handleItemPress('inboundRecord');
            navigation.navigate('InboundRecord');
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    animValues.get('inboundRecord') || new Animated.Value(1),
                },
              ],
            }}>
            <ListItem bottomDivider>
              <Icon name="login" type="antdesign" color="#f32598" size={22} />
              <ListItem.Content>
                <ListItem.Title>入库管理</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleItemPress('outboundRecord');
            navigation.navigate('OutboundRecord');
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    animValues.get('outboundRecord') || new Animated.Value(1),
                },
              ],
            }}>
            <ListItem>
              <Icon name="logout" type="antdesign" color="#e825f3" size={22} />
              <ListItem.Content>
                <ListItem.Title>出库管理</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>
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
