import {
  Button,
  Icon,
  Input,
  ListItem,
  SearchBar,
  Tab,
  TabView,
  Text,
} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import {BSON} from 'realm';
import {useCargo} from '../../hooks/useCargo';
import {InboundManageProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InboundManage({navigation}: InboundManageProps) {
  const {cargoList} = useCargo();

  // 状态管理：当前选中的货品和规格
  const [selectedCargo, setSelectedCargo] = useState<BSON.ObjectId | null>(
    null,
  );
  const [selectedModel, setSelectedModel] = useState<BSON.ObjectId | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [inboundDetails, setInboundDetails] = useState<any[]>([]);
  const [quantity, setQuantity] = useState('1');

  // 处理选择货品
  const handleSelectCargo = (cargoId: BSON.ObjectId) => {
    setSelectedCargo(cargoId);
    setIndex(1);
  };

  // 处理选择规格
  const handleSelectModel = (modelId: BSON.ObjectId) => {
    setSelectedModel(modelId);
  };

  // 添加到入库明细
  const handleAddToInbound = () => {
    if (!selectedCargo || !selectedModel) {
      Alert.alert('请选择货品和规格');
      return;
    }

    const cargoName = cargoList.find(item =>
      item._id.equals(selectedCargo),
    )?.name;
    const modelName = cargoList
      .find(item => item._id.equals(selectedCargo))
      ?.models.find(item => item._id.equals(selectedModel))?.name;

    if (!cargoName || !modelName) {
      Alert.alert('货品或规格不存在');
      return;
    }

    if (quantity.match(/^(?:0|(?:-?[1-9]\d*))$/) === null) {
      Alert.alert('请输入正确的数量');
      return;
    }

    setInboundDetails([
      ...inboundDetails,
      {
        _id: new BSON.ObjectId(),
        cargoName: cargoName,
        modelName: modelName,
        quantity: quantity,
      },
    ]);
    setSelectedCargo(null);
    setSelectedModel(null);
    setQuantity('1'); // 重置数量
    setIndex(2);
  };

  // 提交入库单
  const handleSubmit = () => {
    console.log('入库单已提交', inboundDetails);
  };

  // 保存为草稿
  const handleSaveDraft = () => {
    console.log('草稿已保存', inboundDetails);
  };

  // 根据 category 分类货品
  const categorizedCargoList = () => {
    const categorized = cargoList.reduce((acc, cargo) => {
      const category = cargo.category || '未分类'; // 处理没有 category 的情况
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(cargo);
      return acc;
    }, {} as Record<string, any[]>);

    // 将分类数据转换为 SectionList 所需的格式
    return Object.keys(categorized).map(category => ({
      title: category,
      data: categorized[category],
    }));
  };

  // 渲染货品部分
  const renderCargoList = () => (
    <SectionList
      sections={categorizedCargoList()}
      keyExtractor={(item, index) => item._id.toString() + index}
      renderItem={({item}) => (
        <ListItem bottomDivider onPress={() => handleSelectCargo(item._id)}>
          <Icon
            name={
              selectedCargo?.toHexString() === item._id.toHexString()
                ? 'label-important'
                : 'label-important-outline'
            }
            type="material"
            color={
              selectedCargo?.toHexString() === item._id.toHexString()
                ? colorStyle.primary
                : colorStyle.textPrimary
            }
          />
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      )}
      renderSectionHeader={({section: {title}}) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
    />
  );

  // 渲染规格部分
  const renderModelList = () => (
    <>
      {selectedCargo ? (
        <FlatList
          data={cargoList.find(item => item._id.equals(selectedCargo))?.models}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => (
            <ListItem bottomDivider onPress={() => handleSelectModel(item._id)}>
              <ListItem.Content>
                <Icon
                  name={
                    selectedModel?.toHexString() === item._id.toHexString()
                      ? 'label-important'
                      : 'label-important-outline'
                  }
                  type="material"
                  color={
                    selectedModel?.toHexString() === item._id.toHexString()
                      ? colorStyle.primary
                      : colorStyle.textPrimary
                  }
                />
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>
                  当前库存: {item.quantity} {item.cargo.map(c => c.unit)[0]}
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
          ListEmptyComponent={
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                padding: 16,
                color: colorStyle.textSecondary,
              }}>
              该货品暂无规格。
            </Text>
          }
        />
      ) : (
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            padding: 16,
            color: colorStyle.textSecondary,
          }}>
          请先选择货品。
        </Text>
      )}
      {selectedModel && (
        <Input
          label="入库数量"
          value={String(quantity)}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="请输入数量"
          labelStyle={{marginTop: 16}}
        />
      )}
    </>
  );

  // 渲染入库明细部分
  const renderInboundDetails = () => (
    <FlatList
      data={inboundDetails}
      keyExtractor={item => item._id.toString()}
      renderItem={({item}) => (
        <ListItem bottomDivider>
          <Icon name="package-variant-closed" type="material-community" />
          <ListItem.Content>
            <ListItem.Title>{item.cargoName}</ListItem.Title>
            <ListItem.Subtitle>
              {item.modelName} - {item.quantity} 件
            </ListItem.Subtitle>
          </ListItem.Content>
          <Button
            type="clear"
            icon={
              <Icon
                name="delete"
                type="material-community"
                color={colorStyle.danger}
              />
            }
            onPress={() =>
              setInboundDetails(
                inboundDetails.filter(i => !i._id.equals(item._id)),
              )
            }
          />
        </ListItem>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索框 */}
      <SearchBar
        placeholder="筛选货品"
        value={searchQuery}
        onChangeText={setSearchQuery}
        lightTheme
        round
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
          title="入库明细"
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
          {renderCargoList()}
        </TabView.Item>
        <TabView.Item style={styles.tabContainer}>
          {renderModelList()}
        </TabView.Item>
        <TabView.Item style={styles.tabContainer}>
          {renderInboundDetails()}
        </TabView.Item>
      </TabView>

      {/* 操作按钮 */}
      <View style={styles.buttonContainer}>
        <Button
          title="添加入库货品"
          onPress={handleAddToInbound}
          color={'primary'}
          disabled={!selectedCargo || !selectedModel}
        />
        <Button
          title="提交入库单"
          onPress={handleSubmit}
          color={'success'}
          disabled={inboundDetails.length === 0}
        />
        <Button
          title="保存草稿"
          onPress={handleSaveDraft}
          color={'error'}
          disabled={inboundDetails.length === 0}
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    paddingLeft: 16,
    backgroundColor: colorStyle.primary,
    color: colorStyle.white,
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
  },
});
