import {Button, Icon} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {BSON} from 'realm';
import {colorStyle} from '../styles';
import {parseWithOrder} from '../utils';

interface ModelFlatItemProps {
  item: {
    _id: BSON.ObjectId;
    value: string;
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
        const parsed: ModelsParsed = parseWithOrder(item.value);
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
  }, [item.value]);

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
      {/* 规格表格展示 */}
      {modelsParsed.length > 0 && (
        <View style={styles.table}>
          {/* 表头 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderCell, styles.tableHeader]}>
              规格名称
            </Text>
            <Text style={[styles.tableHeaderCell, styles.tableHeader]}>
              规格值
            </Text>
          </View>

          {/* 数据行 */}
          {modelsParsed.map((model, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{model.key}</Text>
              <Text style={styles.tableCell}>{model.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 数量调整 */}
      <View style={styles.quantityContainer}>
        <View style={styles.quantityControls}>
          <Button
            onPress={decrementQuantity}
            containerStyle={{borderRadius: '50%'}}
            icon={
              <Icon name="minus" size={18} color="white" type="antdesign" />
            }
          />

          <TextInput
            style={[styles.quantityInput, error ? styles.inputError : {}]}
            keyboardType="numeric"
            value={quantity}
            onChangeText={handleQuantityChange}
            maxLength={3}
          />

          <Button
            onPress={incrementQuantity}
            containerStyle={{borderRadius: '50%'}}
            icon={<Icon name="plus" size={18} color="white" type="antdesign" />}
          />
        </View>

        <View style={styles.tools}>
          {/* 编辑和删除按钮 */}
          <Button
            color={'success'}
            onPress={() => onEdit(item._id)}
            buttonStyle={{borderRadius: 5, paddingHorizontal: 20}}>
            编辑
          </Button>
          <Button
            color={'error'}
            onPress={() => onDelete(item._id)}
            buttonStyle={{borderRadius: 5, paddingHorizontal: 20}}>
            删除
          </Button>
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  tableCell: {
    fontSize: 16,
    color: '#555',
    flex: 2,
  },
  removeButton: {
    backgroundColor: colorStyle.danger,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default ModelFlatItem;
