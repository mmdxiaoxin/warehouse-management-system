import AntDesignIcon from '@react-native-vector-icons/ant-design';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BSON} from 'realm';
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
  const quantity = item.items.reduce(
    (acc: number, cur: any) => acc + cur.quantity,
    0,
  );
  const [isExpanded, setIsExpanded] = useState(false);

  // 切换展开/收起状态
  const toggleExpand = () => setIsExpanded(prev => !prev);

  const handleDelete = () => {
    handleDeleteCargo(item._id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <TouchableOpacity
            style={[styles.toggleButton, {marginTop: 5}]}
            onPress={toggleExpand}>
            <AntDesignIcon
              name={isExpanded ? 'caret-down' : 'caret-right'}
              size={20}
              color={colorStyle.primary}
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
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
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
    marginBottom: 15,
  },
  cardText: {
    ...fontStyle.bodySmall,
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonEdit: {
    backgroundColor: colorStyle.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    width: '48%',
    alignItems: 'center',
  },
  buttonDelete: {
    backgroundColor: colorStyle.danger,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    ...fontStyle.buttonText,
    fontSize: 14,
    color: '#fff',
  },
  toggleButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CargoSectionItem;
