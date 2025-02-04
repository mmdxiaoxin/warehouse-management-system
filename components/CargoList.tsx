import {Icon, ListItem, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Animated,
  SectionList,
  SectionListProps,
  TouchableOpacity,
} from 'react-native';
import {BSON} from 'realm';
import {useCargo} from '../hooks/useCargo';
import {Cargo} from '../models/Cargo';
import {colorStyle} from '../styles';

interface SingleSelectProps {
  selectedCargo: BSON.ObjectId | null;
  selectedCargos?: never;
  onCargoSelect: (cargoId: BSON.ObjectId) => void;
  onCargosSelect?: never;
  multiple?: false;
}

interface MultiSelectProps {
  selectedCargos: BSON.ObjectId[] | null;
  selectedCargo?: never;
  onCargosSelect: (cargoIds: BSON.ObjectId[]) => void;
  onCargoSelect?: never;
  multiple: true;
}

interface BaseProps extends Omit<SectionListProps<Cargo>, 'sections'> {
  searchQuery?: string;
}

type CargoListProps = BaseProps & (SingleSelectProps | MultiSelectProps);

const CargoList: React.FC<CargoListProps> = ({
  searchQuery,
  multiple = false,
  onCargoSelect,
  onCargosSelect,
  selectedCargo,
  selectedCargos,
  ...props
}) => {
  const {cargoList} = useCargo();

  // 使用 Set 来存储选中的货品的 ID
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(
      Array.isArray(selectedCargos)
        ? selectedCargos.map(id => id.toHexString()) // 将 ObjectId 转为 string
        : selectedCargo
        ? [selectedCargo.toHexString()] // 同样转换 selectedCargo
        : [],
    ),
  );

  const [animValues, setAnimValues] = useState<
    Map<BSON.ObjectId, Animated.Value>
  >(new Map());

  // 分类货品列表
  const categorizedCargoList = () => {
    const categorized = cargoList
      .filtered('name CONTAINS $0', searchQuery)
      .reduce((acc, cargo) => {
        const category = cargo.category?.name || '未分类';
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

    // 初始化动画
    if (!animValue) {
      animValue = new Animated.Value(1);
      animValues.set(item._id, animValue);
    }

    // 点击时的动画效果
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const itemId = item._id.toHexString(); // 将 ObjectId 转为 string

    if (multiple) {
      const newSelectedItems = new Set(selectedItems);

      // 如果已选中，取消选择；如果未选中，添加到已选中
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.add(itemId);
      }

      // 更新选中的项并通知父组件
      setSelectedItems(newSelectedItems);
      onCargosSelect?.(
        Array.from(newSelectedItems).map(id => new BSON.ObjectId(id)),
      );
    } else {
      setSelectedItems(new Set([itemId]));
      onCargoSelect?.(new BSON.ObjectId(itemId));
    }
  };

  return (
    <SectionList
      {...props}
      sections={categorizedCargoList()}
      keyExtractor={(item, index) => item._id.toString() + index}
      renderItem={({item}) => {
        const animValue = animValues.get(item._id) || new Animated.Value(1);

        return (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Animated.View
              style={{
                transform: [{scale: animValue}],
              }}>
              <ListItem bottomDivider>
                {multiple ? (
                  <ListItem.CheckBox
                    iconType="material-community"
                    checkedIcon="checkbox-marked"
                    uncheckedIcon="checkbox-blank-outline"
                    checked={selectedItems.has(item._id.toHexString())}
                    onPress={() => handleItemPress(item)}
                  />
                ) : (
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
                )}
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
            textTransform: 'uppercase',
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
