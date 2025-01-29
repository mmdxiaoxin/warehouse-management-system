import AntDesignIcon from '@react-native-vector-icons/ant-design';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
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
  onQuantityChange: (id: BSON.ObjectId, quantity: number) => void;
  onEdit: (id: BSON.ObjectId) => void; // 新增编辑回调
  onDelete: (id: BSON.ObjectId) => void; // 新增删除回调
}

type ModelsParsed = {
  key: string;
  value: string;
}[];

const ModelFlatItem: React.FC<ModelFlatItemProps> = ({
  item,
  onQuantityChange,
  onEdit,
  onDelete,
}) => {
  const [modelsParsed, setModelsParsed] = useState<ModelsParsed>([]);

  useEffect(() => {
    // 安全解析 JSON
    const parseModels = () => {
      try {
        const parsed: ModelsParsed = JSON.parse(item.models);
        // 确保解析后的数据是一个数组
        if (Array.isArray(parsed)) {
          setModelsParsed(parsed);
        } else {
          setModelsParsed([]); // 如果不是数组，则使用默认空数组
        }
      } catch (error) {
        console.error('解析 models 数据失败', error);
        setModelsParsed([]); // 解析失败时使用空数组
      }
    };

    parseModels();
  }, [item.models]);

  const [quantity, setQuantity] = useState(item.quantity.toString()); // 管理输入的数量
  const [error, setError] = useState<string>(''); // 错误信息

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
    if (text === '') {
      setQuantity(text); // 如果是空字符串，允许为空
      setError('');
    } else if (/^(?:0|(?:-?[1-9]\d*))$/.test(text)) {
      const newQuantity = parseInt(text);
      if (newQuantity >= 0) {
        setQuantity(text);
        setError('');
        onQuantityChange(item._id, newQuantity);
      }
    } else {
      setError('请输入有效的整数');
    }
  };

  return (
    <View style={styles.itemCard}>
      <View style={styles.header}>
        {/* 编辑和删除按钮 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(item._id)}>
          <Text style={styles.buttonText}>编辑</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item._id)}>
          <Text style={styles.buttonText}>删除</Text>
        </TouchableOpacity>
      </View>

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
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50', // 绿色背景
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336', // 红色背景
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginBottom: 15,
  },
  modelItem: {
    flexDirection: 'row',
    marginBottom: 10,
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
    marginTop: 15,
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
