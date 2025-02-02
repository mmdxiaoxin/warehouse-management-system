import {
  Button,
  Icon,
  ListItem,
  SearchBar,
  Tab,
  TabView,
  Text,
} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
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
    if (selectedCargo && selectedModel) {
      setInboundDetails([
        ...inboundDetails,
        {
          cargo: cargoList.find(item => item._id.equals(selectedCargo))?.name,
          model: cargoList
            .find(item => item._id.equals(selectedCargo))
            ?.models.find(item => item._id.equals(selectedModel))?.name,
          quantity: cargoList
            .find(item => item._id.equals(selectedCargo))
            ?.models.find(item => item._id.equals(selectedModel))?.quantity,
        },
      ]);
      setSelectedCargo(null);
      setSelectedModel(null);
      setIndex(2);
    }
  };

  // 提交入库单
  const handleSubmit = () => {
    console.log('入库单已提交', inboundDetails);
  };

  // 保存为草稿
  const handleSaveDraft = () => {
    console.log('草稿已保存', inboundDetails);
  };

  // 渲染货品部分
  const renderCargoList = () => (
    <FlatList
      data={cargoList.filtered(`name CONTAINS[c] "${searchQuery}"`) as any}
      keyExtractor={item => item._id.toString()}
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
                <ListItem.Subtitle>{item.quantity} 件</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          )}
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
    </>
  );

  // 渲染入库明细部分
  const renderInboundDetails = () => (
    <FlatList
      data={inboundDetails}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem bottomDivider>
          <Icon name="package-variant-closed" type="material-community" />
          <ListItem.Content>
            <ListItem.Title>{item.cargo}</ListItem.Title>
            <ListItem.Subtitle>
              {item.model} - {item.quantity} 件
            </ListItem.Subtitle>
          </ListItem.Content>
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
        {/* 添加到入库明细按钮 */}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
