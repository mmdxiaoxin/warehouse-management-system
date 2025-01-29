import AntDesignIcon from '@react-native-vector-icons/ant-design';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BSON} from 'realm';

interface ModelFlatItemProps {
  item: {
    _id: BSON.ObjectId;
    models: string;
    quantity: number;
  };
  onQuantityChange: (id: BSON.ObjectId, quantity: number) => void; // 传递 quantity 变化的回调
}

const ModelFlatItem: React.FC<ModelFlatItemProps> = ({
  item,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(item.quantity.toString()); // 管理输入的数量

  // 增加数量
  const incrementQuantity = () => {
    const newQuantity = parseInt(quantity) + 1;
    setQuantity(newQuantity.toString());
    onQuantityChange(item._id, newQuantity); // 回调通知父组件更新数量
  };

  // 减少数量
  const decrementQuantity = () => {
    if (parseInt(quantity) > 1) {
      const newQuantity = parseInt(quantity) - 1;
      setQuantity(newQuantity.toString());
      onQuantityChange(item._id, newQuantity); // 回调通知父组件更新数量
    }
  };

  // 修改数量
  const handleQuantityChange = (text: string) => {
    const newQuantity = parseInt(text);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(text);
      onQuantityChange(item._id, newQuantity); // 回调通知父组件更新数量
    }
  };

  return (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.models}</Text>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>数量:</Text>

        {/* 增减按钮 */}
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={decrementQuantity} style={styles.button}>
            <AntDesignIcon name="minus" size={20} color="white" />
          </TouchableOpacity>

          {/* 输入框 */}
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={quantity}
            onChangeText={handleQuantityChange}
            maxLength={3} // 限制输入的最大长度
          />

          <TouchableOpacity onPress={incrementQuantity} style={styles.button}>
            <AntDesignIcon name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontSize: 16,
    color: '#333',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    width: 50,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 10,
    padding: 0,
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: '#007bff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ModelFlatItem;
