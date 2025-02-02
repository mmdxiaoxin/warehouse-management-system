import {Button, Icon, ListItem, SearchBar} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
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
  const [inboundDetails, setInboundDetails] = useState<any[]>([]);

  // 处理选择货品
  const handleSelectCargo = (cargoId: BSON.ObjectId) => {
    setSelectedCargo(cargoId);
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
    <View style={styles.leftContainer}>
      <Text style={styles.sectionTitle}>选择货品</Text>
      <FlatList
        data={cargoList}
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
    </View>
  );

  // 渲染规格部分
  const renderModelList = () => (
    <View style={styles.rightContainer}>
      <Text style={styles.sectionTitle}>选择规格</Text>
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
        <Text>请先选择货品。</Text>
      )}
    </View>
  );

  // 渲染入库明细部分
  const renderInboundDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.sectionTitle}>入库明细</Text>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索框 */}
      <SearchBar
        placeholder="搜索货品"
        value={searchQuery}
        onChangeText={setSearchQuery}
        lightTheme
        round
      />

      {/* 主内容区域 */}
      <FlatList
        data={[1]} // 创建一个空数据数组，作为占位符
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => (
          <View style={{flex: 1}}>
            <View style={styles.mainContent}>
              {renderCargoList()}
              {renderModelList()}
            </View>
            <Button
              title="添加入库货品"
              onPress={handleAddToInbound}
              color={'primary'}
            />
            {renderInboundDetails()}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.buttonContainer}>
            <Button
              title="提交入库单"
              onPress={handleSubmit}
              color={'success'}
            />
            <Button
              title="保存草稿"
              onPress={handleSaveDraft}
              color={'error'}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flex: 2,
  },
  detailsContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
