import {Button, Icon} from '@rneui/themed';
import React, {useEffect, useMemo, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Cargo} from '../models/Cargo';
import {colorStyle, fontStyle} from '../styles';

interface CargoItemProps {
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
}

const CargoItem: React.FC<CargoItemProps> = ({item}) => {
  const quantity = item.models.reduce(
    (acc: number, cur: any) => acc + cur.quantity,
    0,
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandHeight] = useState(new Animated.Value(0));

  const cardHeight = useMemo(() => {
    const baseHeight = 120;
    const modelsHeight = item.models.reduce((acc: number, cur: any) => {
      return acc + (cur.quantity > 0 ? 70 : 0);
    }, 0);
    return baseHeight + modelsHeight;
  }, [item.models.length]);

  // 扩展状态变化时触发动画
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
      {/* Header */}
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
        <Text style={styles.cardCategory}>{item.category?.name}</Text>
      </View>

      {/* Body */}
      <Animated.View style={[styles.cardBody, {height: expandHeight}]}>
        <View style={styles.infoRow}>
          <Icon
            name="box"
            size={15}
            color={colorStyle.primary}
            style={styles.icon}
            type="font-awesome-5"
          />
          <Text style={styles.cardText}>
            <Text style={styles.boldText}>剩余库存:</Text> {quantity}{' '}
            {item.unit?.name}
          </Text>
        </View>

        {/* 规格以及数量 */}
        <View style={styles.modelsContainer}>
          {item.models.some(model => model.quantity > 0) ? (
            item.models
              .filter(model => model.quantity > 0)
              .map(model => (
                <View key={model._id.toHexString()} style={styles.modelItem}>
                  <Text
                    style={styles.modelTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    规格: {model.name}
                  </Text>
                  <Text style={styles.modelText}>
                    <Text style={styles.boldText}>数量:</Text> {model.quantity}{' '}
                    {item.unit?.name}
                  </Text>
                </View>
              ))
          ) : (
            <Text style={[styles.cardText, {textAlign: 'center'}]}>
              {`当前货物无库存记录`}
            </Text>
          )}
        </View>

        {/* 时间戳部分 */}
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>创建时间:</Text>{' '}
          {item.ctime ? new Date(item.ctime).toLocaleString() : '错误!'}
        </Text>
        <Text style={styles.cardText}>
          <Text style={styles.boldText}>最近修改:</Text>{' '}
          {item.utime ? new Date(item.utime).toLocaleString() : '无出库记录'}
        </Text>
      </Animated.View>

      {/* 页脚 */}
      <View style={styles.cardFooter}>
        <Text
          style={[styles.cardText, {display: isExpanded ? 'none' : 'flex'}]}>
          {isExpanded ? null : (
            <Icon
              name="box"
              size={15}
              color={colorStyle.primary}
              style={styles.icon}
              type="font-awesome-5"
            />
          )}
          <Text style={styles.boldText}>剩余库存:</Text> {quantity}{' '}
          {item.unit?.name}
        </Text>
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
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
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
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  modelsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  modelItem: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colorStyle.neutral100,
    borderRadius: 8,
    borderColor: colorStyle.neutral300,
    borderWidth: 1,
  },
  modelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colorStyle.primary,
  },
  modelText: {
    fontSize: 14,
    color: '#555',
  },
});

export default CargoItem;
