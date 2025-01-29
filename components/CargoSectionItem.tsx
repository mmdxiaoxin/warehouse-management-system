import AntDesignIcon from '@react-native-vector-icons/ant-design';
import {useObject} from '@realm/react'; // 引入 Realm hooks
import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BSON} from 'realm';
import {Cargo} from '../models/Cargo';
import {colorStyle, fontStyle} from '../styles';

interface CargoItemProps {
  item: any;
  handleEditCargo: (cargoId: BSON.ObjectId) => void;
  handleDeleteCargo: (cargoId: BSON.ObjectId) => void;
}

const CargoSectionItem: React.FC<CargoItemProps> = ({
  item,
  handleEditCargo,
  handleDeleteCargo,
}) => {
  const currentItem = useObject<Cargo>(Cargo, item._id);

  const quantity = useMemo(() => {
    if (!currentItem || !currentItem.items) {
      return 0;
    }
    console.log(currentItem);
    return currentItem.items.length;
  }, [currentItem]);

  const [isExpanded, setIsExpanded] = useState(false);

  // 切换展开/收起状态
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const handleDelete = () => {
    handleDeleteCargo(item._id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <TouchableOpacity style={styles.toggleButton} onPress={toggleExpand}>
            <AntDesignIcon
              name={isExpanded ? 'caret-down' : 'caret-up'}
              size={14}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>

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
              onPress={() => handleEditCargo(item._id)}>
              <Text style={styles.buttonText}>编辑货物</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={handleDelete}>
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
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
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

export default CargoSectionItem;
