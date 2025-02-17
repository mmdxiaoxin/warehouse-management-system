import {useRealm} from '@realm/react';
import {Button, Input, SearchBar, Tab, TabView} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {BSON} from 'realm';
import CargoList from '../../components/CargoList';
import DetailList, {Details} from '../../components/DetailsList';
import ModelList from '../../components/ModelList';
import {useCargo} from '../../hooks/useCargo';
import {useRecord} from '../../hooks/useRecord';
import {Cargo} from '../../models/Cargo';
import {RecordDetail} from '../../models/Record';
import {OutboundManageProps} from '../../routes/types';

export default function OutboundManage({navigation}: OutboundManageProps) {
  const realm = useRealm();
  const {cargoList} = useCargo();
  const {createRecord} = useRecord();

  // 状态管理：当前选中的货品和规格
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState<BSON.ObjectId | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(''); // 搜索框内容
  const [index, setIndex] = useState(0); // Tab 索引
  const [outboundDetails, setOutboundDetails] = useState<Details>({}); // 出库明细
  const [quantity, setQuantity] = useState('1'); // 出库数量

  // 处理选择货品
  const handleSelectCargo = (cargoId: BSON.ObjectId) => {
    setSelectedCargo(cargoId);
    setSelectedModel(null); // 重置规格
    setIndex(1);
  };

  // 处理选择规格
  const handleSelectModel = (modelId: BSON.ObjectId) => {
    setSelectedModel(modelId);
  };

  // 添加到出库明细
  const handleAddToOutbound = () => {
    if (!selectedCargo || !selectedModel) {
      Alert.alert('请选择货品和规格');
      return;
    }

    const cargo = cargoList.find(item => item._id.equals(selectedCargo));
    const cargoName = cargo?.name;
    const unit = cargo?.unit?.name || '件';
    const modelName = cargo?.models.find(model =>
      model._id.equals(selectedModel),
    )?.name;

    if (!cargoName || !modelName) {
      Alert.alert('货品或规格不存在');
      return;
    }

    // 验证数量是否为有效的数字
    if (quantity.match(/^(?:0|(?:-?[1-9]\d*))$/) === null) {
      Alert.alert('请输入正确的数量');
      return;
    }

    setOutboundDetails(prevState => {
      const updatedDetails = {...prevState};

      // 如果该货品已存在
      if (updatedDetails[selectedCargo.toHexString()]) {
        const existingItem = updatedDetails[selectedCargo.toHexString()];

        // 查找相同规格是否存在
        const existingModel = existingItem.models.find(model =>
          model.modelId.equals(selectedModel),
        );

        if (existingModel) {
          // 如果存在，则更新数量（确保将 quantity 转换为数字后进行累加）
          existingModel.quantity = (
            Number(existingModel.quantity) + Number(quantity)
          ).toString();
        } else {
          // 如果规格不存在，则添加新的规格
          existingItem.models.push({
            modelId: selectedModel,
            modelName,
            quantity,
          });
        }
      } else {
        // 如果该货品不存在，则创建新的货品节点
        updatedDetails[selectedCargo.toHexString()] = {
          cargoName,
          unit,
          models: [
            {
              modelId: selectedModel,
              modelName,
              quantity,
            },
          ],
        };
      }

      return updatedDetails;
    });

    // 重置状态
    setSelectedCargo(null);
    setSelectedModel(null);
    setQuantity('1'); // 重置数量
    setIndex(2);
  };

  const handleDeleteDetail = (modelId: BSON.ObjectId) => {
    setOutboundDetails(prevState => {
      const updatedDetails = {...prevState};

      // 遍历所有货品，查找规格并删除
      Object.keys(updatedDetails).forEach(cargoId => {
        const item = updatedDetails[cargoId];
        item.models = item.models.filter(
          model => !model.modelId.equals(modelId),
        );

        // 如果规格数量为 0，则删除该货品
        if (item.models.length === 0) {
          delete updatedDetails[cargoId];
        }
      });

      return updatedDetails;
    });
  };

  const handleUpdateDetail = (modelId: BSON.ObjectId, quantity: string) => {
    setOutboundDetails(prevState => {
      const updatedDetails = {...prevState};

      // 遍历所有货品，查找规格并更新数量
      Object.keys(updatedDetails).forEach(cargoId => {
        const item = updatedDetails[cargoId];
        item.models.forEach(model => {
          if (model.modelId.equals(modelId)) {
            model.quantity = quantity;
          }
        });
      });

      return updatedDetails;
    });
  };

  const handleSubmit = (status: boolean) => {
    Alert.alert(
      '确认提交',
      `您确定要${status ? '提交出库表单' : '保存为草稿'}吗？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: async () => {
            try {
              // 1. 准备提交的记录详情
              const type = 'outbound';
              const detail: RecordDetail[] = Object.keys(outboundDetails).map(
                cargoId => {
                  const {cargoName, models, unit} = outboundDetails[cargoId];
                  return {
                    cargoId: new BSON.ObjectId(cargoId),
                    cargoName,
                    cargoModels: models.map(model => ({
                      modelId: model.modelId,
                      modelName: model.modelName,
                      quantity: Number(model.quantity),
                    })),
                    unit,
                  };
                },
              ) as RecordDetail[];

              if (status) {
                // 2. 开始事务，提交出库记录并更新规格数量
                const newId = realm.write(() => {
                  // 2.1 创建出库记录
                  const newRecord = realm.create('Record', {
                    _id: new BSON.ObjectId(),
                    type,
                    status,
                    detail,
                    ctime: new Date(),
                    utime: new Date(),
                  });

                  // 2.2 更新货品规格的数量
                  detail.forEach(({cargoId, cargoModels}) => {
                    const cargo = realm.objectForPrimaryKey(Cargo, cargoId);
                    if (!cargo) {
                      throw new Error('货品不存在');
                    }

                    // 遍历每个货品的规格，并更新数量
                    cargoModels.forEach(({modelId, quantity}) => {
                      const foundModel = cargo.models.find(model =>
                        model._id.equals(modelId),
                      );
                      if (foundModel) {
                        // 检查库存是否足够
                        if (foundModel.quantity < quantity) {
                          throw new Error(
                            `《${foundModel.name}》库存不足, 当前库存余量: ${foundModel.quantity}, 出库数量: ${quantity}`,
                          );
                        }

                        // 减去出库数量
                        foundModel.quantity -= quantity;
                        foundModel.utime = new Date(); // 更新时间
                      }
                    });
                  });

                  return newRecord._id;
                });

                if (!newId) {
                  throw new Error('数据库操作失败');
                }
              } else {
                // 3. 保存为草稿
                const newId = createRecord({type, status, detail});
                if (!newId) {
                  throw new Error('数据库操作失败');
                }
              }

              setOutboundDetails({}); // 清空出库明细
              ToastAndroid.show('提交成功', ToastAndroid.SHORT);
              navigation.goBack();
            } catch (error: any) {
              console.error('提交出库表单失败：', error);
              Alert.alert('提交失败', '提交表单时发生错误: ' + error.message);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索框 */}
      <SearchBar
        placeholder="筛选货品"
        value={searchQuery}
        onChangeText={setSearchQuery}
        platform="android"
        containerStyle={{borderRadius: 15}}
      />

      <Tab value={index} onChange={e => setIndex(e)}>
        <Tab.Item
          title="选择货品"
          titleStyle={{fontSize: 12}}
          icon={{name: 'archive', type: 'material'}}
        />
        <Tab.Item
          title="选择规格"
          titleStyle={{fontSize: 12}}
          icon={{name: 'layers', type: 'material'}}
        />
        <Tab.Item
          title="出库明细"
          titleStyle={{fontSize: 12}}
          icon={{name: 'clipboard-list', type: 'font-awesome-5'}}
        />
      </Tab>

      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        containerStyle={styles.mainContent}>
        <TabView.Item style={styles.tabContainer}>
          <CargoList
            searchQuery={searchQuery}
            selectedCargo={selectedCargo}
            onCargoSelect={handleSelectCargo}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabContainer}>
          <>
            <ModelList
              type="outbound"
              selectedCargo={selectedCargo}
              selectedModel={selectedModel}
              onModelSelect={handleSelectModel}
            />
            {selectedModel && (
              <Input
                label="出库数量"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="请输入数量"
                labelStyle={{marginTop: 16}}
              />
            )}
          </>
        </TabView.Item>
        <TabView.Item style={styles.tabContainer}>
          <DetailList
            details={outboundDetails}
            onDeleted={handleDeleteDetail}
            onUpdated={handleUpdateDetail}
          />
        </TabView.Item>
      </TabView>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          title="添加出库货品"
          onPress={handleAddToOutbound}
          color={'primary'}
          disabled={!selectedCargo || !selectedModel}
        />
        <Button
          title="提交出库单"
          onPress={() => handleSubmit(true)}
          color={'success'}
          disabled={Object.keys(outboundDetails).length === 0}
        />
        <Button
          title="保存草稿"
          onPress={() => handleSubmit(false)}
          color={'error'}
          disabled={Object.keys(outboundDetails).length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  mainContent: {
    flex: 7,
  },
  tabContainer: {
    width: '100%',
    padding: 16,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: 'column',
    padding: 16,
    gap: 10,
    marginBottom: 40,
  },
});
