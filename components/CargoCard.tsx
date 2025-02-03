import {Button, Icon} from '@rneui/themed';
import React, {useState, useMemo, useEffect} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle, fontStyle} from '../styles';

interface CargoCardProps {
  item: Pick<
    Cargo,
    | '_id'
    | 'name'
    | 'category'
    | 'description'
    | 'ctime'
    | 'utime'
    | 'unit'
    | 'models'
    | 'price'
  >;
  handleEdit: (cargoId: BSON.ObjectId) => void;
  handleDelete: (cargoId: BSON.ObjectId) => void;
}

const CargoCard: React.FC<CargoCardProps> = ({
  item,
  handleEdit,
  handleDelete,
}) => {
  const modelsCount = item.models.length;
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandHeight] = useState(new Animated.Value(0));

  const cardHeight = useMemo(() => {
    const baseHeight = 100;
    const descriptionHeight = item.description ? 25 : 0;
    const unitHeight = item.unit ? 25 : 0;
    const priceHeight = item.price ? 25 : 0;
    return baseHeight + descriptionHeight + unitHeight + priceHeight;
  }, [item.description, item.unit, item.price]);

  // 扩展状态发生变化时触发动画
  const toggleExpand = () => {
    Animated.timing(expandHeight, {
      toValue: isExpanded ? 0 : cardHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (isExpanded) {
      Animated.timing(expandHeight, {
        toValue: cardHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [cardHeight, isExpanded]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Button
            type="clear"
            icon={{
              name: isExpanded ? 'caret-down' : 'caret-right',
              size: 18,
              type: 'font-awesome-5',
              color: colorStyle.primary,
            }}
            onPress={toggleExpand}
          />
        </View>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>

      <Animated.View style={[styles.cardBody, {height: expandHeight}]}>
        <View style={styles.infoRow}>
          <Icon
            name="boxes"
            size={15}
            color={colorStyle.primary}
            style={styles.icon}
            type="font-awesome-5"
          />
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>规格数目:</Text> {modelsCount} 种
          </Text>
        </View>

        {item.price && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>价格:</Text> {item.price} 元
          </Text>
        )}
        {item.unit && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>单位:</Text> {item.unit}
          </Text>
        )}
        {item.description && (
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>备注:</Text> {item.description}
          </Text>
        )}
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>创建时间:</Text>{' '}
          {item.ctime ? new Date(item.ctime).toLocaleString() : '错误!'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>最近修改:</Text>{' '}
          {item.utime ? new Date(item.utime).toLocaleString() : '无出库记录'}
        </Text>
      </Animated.View>

      {/* 只在未展开时显示剩余库存 */}
      <View style={styles.cardFooter}>
        <Text
          style={[styles.cardText, {display: isExpanded ? 'none' : 'flex'}]}>
          <Text style={styles.boldText}>规格数目:</Text> {modelsCount} 种
        </Text>

        {/* 保持按钮位置固定 */}
        <View style={styles.toolBar}>
          <Button
            icon={{
              name: 'edit',
              size: 18,
              color: '#fff',
              type: 'antdesign',
            }}
            buttonStyle={{
              backgroundColor: colorStyle.primary,
              borderRadius: 5,
            }}
            onPress={() => handleEdit(item._id)}>
            编辑
          </Button>
          <Button
            icon={{name: 'delete', size: 18, color: '#fff', type: 'antdesign'}}
            buttonStyle={{
              backgroundColor: colorStyle.danger,
              borderRadius: 5,
            }}
            onPress={() => handleDelete(item._id)}>
            删除
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.15, // 降低透明度，形成柔和的阴影效果
    shadowRadius: 10, // 增加模糊半径，使阴影自然
    elevation: 5, // 适配 Android 设备的阴影
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    ...fontStyle.subheading,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },
  cardCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: colorStyle.neutral500,
  },
  cardBody: {
    overflow: 'hidden',
  },
  cardText: {
    ...fontStyle.bodySmall,
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  boldText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
});

export default CargoCard;
