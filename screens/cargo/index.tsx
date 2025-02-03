import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {Icon, ListItem, Text} from '@rneui/themed';
import {CargoScreenProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function CargoScreen({navigation}: CargoScreenProps) {
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
        {/* 使用 TouchableOpacity 和 Animated.View 配合来实现点击效果 */}
        <TouchableOpacity
          onPress={() => {
            handleItemPress('cargoManage');
            navigation.navigate('CargoManage');
          }}>
          <Animated.View
            style={{
              transform: [
                {scale: animValues.get('cargoManage') || new Animated.Value(1)},
              ],
            }}>
            <ListItem bottomDivider>
              <Icon name="isv" type="antdesign" color="#ec4b31" />
              <ListItem.Content>
                <ListItem.Title>货品管理</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleItemPress('cargoCategory');
            Alert.alert('提示', '功能开发中，敬请期待！');
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    animValues.get('cargoCategory') || new Animated.Value(1),
                },
              ],
            }}>
            <ListItem>
              <Icon name="category" type="material" color="#a640ee" />
              <ListItem.Content>
                <ListItem.Title>货品分类</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.listItemContainer}>
        <TouchableOpacity
          onPress={() => {
            handleItemPress('categoryManage');
            navigation.navigate('CategoryManage');
          }}>
          <Animated.View
            style={{
              transform: [
                {
                  scale:
                    animValues.get('categoryManage') || new Animated.Value(1),
                },
              ],
            }}>
            <ListItem bottomDivider>
              <Icon name="folder-open" type="font-awesome" color="#26b0e9" />
              <ListItem.Content>
                <ListItem.Title>类别管理</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleItemPress('unitManage');
            navigation.navigate('UnitManage');
          }}>
          <Animated.View
            style={{
              transform: [
                {scale: animValues.get('unitManage') || new Animated.Value(1)},
              ],
            }}>
            <ListItem bottomDivider>
              <Icon name="balance-scale" type="font-awesome" color="#ec8a1f" />
              <ListItem.Content>
                <ListItem.Title>单位管理</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleItemPress('modelManage');
            navigation.navigate('ModelManage');
          }}>
          <Animated.View
            style={{
              transform: [
                {scale: animValues.get('modelManage') || new Animated.Value(1)},
              ],
            }}>
            <ListItem>
              <Icon name="cogs" type="font-awesome" color="#fabc00" />
              <ListItem.Content>
                <ListItem.Title>规格管理</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Animated.View>
        </TouchableOpacity>
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
