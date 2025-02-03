import {Icon, ListItem, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  SectionList,
  SectionListProps,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {BSON} from 'realm';
import {useCargo} from '../hooks/useCargo';
import {Cargo} from '../models/Cargo';
import {colorStyle} from '../styles';

interface CargoListProps extends Omit<SectionListProps<Cargo>, 'sections'> {
  searchQuery?: string;
  selectedCargo: BSON.ObjectId | null;
  onCargoSelect: (cargoId: BSON.ObjectId) => void;
}

const CargoList: React.FC<CargoListProps> = ({
  searchQuery,
  selectedCargo,
  onCargoSelect,
  ...props
}) => {
  const {cargoList} = useCargo();

  // 为每个列表项单独创建动画值
  const [animValues, setAnimValues] = useState<
    Map<BSON.ObjectId, Animated.Value>
  >(new Map());

  const categorizedCargoList = () => {
    const categorized = cargoList
      .filtered('name CONTAINS $0', searchQuery)
      .reduce((acc, cargo) => {
        const category = cargo.category?.name || '未分类'; // 处理没有 category 的情况
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(cargo);
        return acc;
      }, {} as Record<string, any[]>);

    return Object.keys(categorized).map(category => ({
      title: category,
      data: categorized[category],
    }));
  };

  const handleItemPress = (item: Cargo) => {
    let animValue = animValues.get(item._id);

    // 如果没有找到该项的动画值，则初始化它
    if (!animValue) {
      animValue = new Animated.Value(1);
      animValues.set(item._id, animValue);
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

    onCargoSelect(item._id);
  };

  return (
    <SectionList
      {...props}
      sections={categorizedCargoList()}
      keyExtractor={(item, index) => item._id.toString() + index}
      renderItem={({item}) => {
        // 获取每个列表项的动画值
        let animValue = animValues.get(item._id) || new Animated.Value(1);

        return (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Animated.View
              style={[
                {
                  transform: [{scale: animValue}],
                },
              ]}>
              <ListItem bottomDivider>
                <Icon
                  name={
                    selectedCargo?.toHexString() === item._id.toHexString()
                      ? 'label-important'
                      : 'label-important-outline'
                  }
                  type="material"
                  color={
                    selectedCargo?.toHexString() === item._id.toHexString()
                      ? colorStyle.primary
                      : colorStyle.textPrimary
                  }
                />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </Animated.View>
          </TouchableOpacity>
        );
      }}
      renderSectionHeader={({section: {title}}) => (
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            paddingLeft: 16,
            backgroundColor: colorStyle.primary,
            color: colorStyle.white,
            paddingVertical: 4,
            textTransform: 'uppercase', // 分组标题改为大写
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}>
          {title}
        </Text>
      )}
      ListEmptyComponent={
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            padding: 16,
            color: colorStyle.textSecondary,
          }}>
          当前暂无货品。
        </Text>
      }
    />
  );
};

export default CargoList;
