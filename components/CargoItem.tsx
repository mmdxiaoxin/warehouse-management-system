import AntDesignIcon from '@react-native-vector-icons/ant-design';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {cargoItemRepository} from '../models/CargoItemRepository';
import {colorStyle, fontStyle} from '../styles';

// 定义 props 类型
interface CargoItemProps {
  item: any;
  handleEditCargo: (cargoId: string) => void;
  handleDeleteCargo: (cargoId: string) => void;
}

const CargoItem: React.FC<CargoItemProps> = ({
  item,
  handleEditCargo,
  handleDeleteCargo,
}) => {
  const [quantity, setQuantity] = React.useState(0);
  const [isExpanded, setIsExpanded] = React.useState(false);

  useEffect(() => {
    // 获取货物的库存数量
    const fetchQuantity = async () => {
      const result = await cargoItemRepository.getCargoItemCountByCargoId(
        item.cargoId,
      );
      setQuantity(result);
    };
    fetchQuantity();
  }, []);

  // 切换展开/收起状态
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          {/* 展开/收起按钮*/}
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
            <AntDesignIcon
              name={isExpanded ? 'caret-down' : 'caret-down'} // 根据展开状态显示不同的图标
              size={14}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>

      {/* 展开时显示更多信息 */}
      {isExpanded && (
        <>
          <View style={styles.cardBody}>
            <Text style={styles.cardText}>
              剩余库存: {`${quantity} ${item.unit}`}
            </Text>
            <Text style={styles.cardText}>货物描述: {item.description}</Text>
            <Text style={styles.cardText}>
              创建时间:{' '}
              {item.ctime ? new Date(item.ctime).toLocaleString() : '错误!'}
            </Text>
            <Text style={styles.cardText}>
              最近出库:{' '}
              {item.utime
                ? new Date(item.utime).toLocaleString()
                : '无出库记录'}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.buttonEdit}
              onPress={() => handleEditCargo(item.cargoId)}>
              <Text style={styles.buttonText}>编辑货物</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={() => handleDeleteCargo(item.cargoId)}>
              <Text style={styles.buttonText}>删除货物</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Android
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    ...fontStyle.subheading,
  },
  cardCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
  },
  cardBody: {
    marginBottom: 10,
  },
  cardText: {
    ...fontStyle.bodySmall,
    marginBottom: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonEdit: {
    backgroundColor: colorStyle.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: colorStyle.danger,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    ...fontStyle.buttonText,
    fontSize: 14,
  },
  toggleButton: {
    marginStart: 10,
  },
});

export default CargoItem;
