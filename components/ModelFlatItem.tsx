import AntDesignIcon from '@react-native-vector-icons/ant-design';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {BSON} from 'realm';

interface ModelFlatItemProps {
  item: {
    _id: BSON.ObjectId;
    models: string;
    quantity: number;
  };
  onQuantityChange: (id: BSON.ObjectId, quantity: number) => void;
}

type ModelsParsed = {
  key: string;
  value: string;
}[];

const ModelFlatItem: React.FC<ModelFlatItemProps> = ({
  item,
  onQuantityChange,
}) => {
  const modelsParsed: ModelsParsed = JSON.parse(item.models);

  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [error, setError] = useState<string>('');

  // 增加数量
  const incrementQuantity = () => {
    const newQuantity = parseInt(quantity) + 1;
    setQuantity(newQuantity.toString());
    setError('');
    onQuantityChange(item._id, newQuantity);
  };

  // 减少数量
  const decrementQuantity = () => {
    const newQuantity = parseInt(quantity) - 1;
    if (newQuantity >= 0) {
      setQuantity(newQuantity.toString());
      setError('');
      onQuantityChange(item._id, newQuantity);
    }
  };

  // 修改数量
  const handleQuantityChange = (text: string) => {
    // 校验用户输入的内容是否为有效的数字
    if (text === '') {
      setQuantity(text); // 如果是空字符串，允许为空
      setError('');
    } else if (/^(?:0|(?:-?[1-9]\d*))$/.test(text)) {
      // 正则校验是否为数字
      const newQuantity = parseInt(text);
      if (newQuantity >= 0) {
        setQuantity(text);
        setError('');
        onQuantityChange(item._id, newQuantity);
      }
    } else {
      setError('请输入有效的整数'); // 如果输入的不是有效的整数，显示错误信息
    }
  };

  return (
    <View style={styles.itemCard}>
      {/* 结构化展示 parsed data */}
      <ScrollView style={styles.detailsContainer}>
        {modelsParsed.map((model, index) => (
          <View key={index} style={styles.modelItem}>
            <Text style={styles.modelKey}>{model.key}:</Text>
            <Text style={styles.modelValue}>{model.value}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 数量调整 */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>数量:</Text>

        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={decrementQuantity} style={styles.button}>
            <AntDesignIcon name="minus" size={20} color="white" />
          </TouchableOpacity>

          <TextInput
            style={[styles.quantityInput, error ? styles.inputError : {}]}
            keyboardType="numeric"
            value={quantity}
            onChangeText={handleQuantityChange}
            maxLength={3}
          />

          <TouchableOpacity onPress={incrementQuantity} style={styles.button}>
            <AntDesignIcon name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  detailsContainer: {
    marginVertical: 10,
  },
  modelItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  modelKey: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  modelValue: {
    fontSize: 16,
    color: '#333',
    flex: 2,
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
  inputError: {
    borderColor: 'red',
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: '#007bff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ModelFlatItem;
