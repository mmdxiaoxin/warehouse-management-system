import {Button, Icon, ListItem} from '@rneui/themed';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {BSON} from 'realm';
import {Record, RecordDetail, RecordDetailModel} from '../../models/Record';
import {InboundRecordProps} from '../../routes/types';
import {colorStyle} from '../../styles';

// 假设我们有一些示例记录数据
const sampleRecords: Record[] = [
  {
    _id: new BSON.ObjectId(),
    type: 'inbound',
    status: true,
    detail: [
      {
        cargoId: new BSON.ObjectId(),
        cargoName: '货品 A',
        cargoModels: [
          {modelId: new BSON.ObjectId(), modelName: '规格 A1', quantity: 10},
          {modelId: new BSON.ObjectId(), modelName: '规格 A2', quantity: 20},
        ],
        unit: '件',
      },
    ],
    ctime: new Date(),
    utime: new Date(),
  },
  // 更多示例数据...
];

export default function InboundRecord({navigation}: InboundRecordProps) {
  return (
    <FlatList
      style={styles.container}
      keyExtractor={item => item._id.toString()}
      data={sampleRecords}
      ListHeaderComponent={
        <Button
          title="开始入库"
          onPress={() => navigation.navigate('InboundManage')}
          buttonStyle={styles.startButton}
        />
      }
      renderItem={({item}) => (
        <View style={styles.recordContainer}>
          <ListItem.Accordion
            content={
              <View style={styles.recordHeader}>
                <Text
                  style={styles.recordTitle}>{`记录类型: ${item.type}`}</Text>
                <Text style={styles.recordStatus}>
                  {item.status ? '状态: 已完成' : '状态: 待完成'}
                </Text>
              </View>
            }
            isExpanded={false}
            containerStyle={styles.accordion}>
            {item.detail.map((detail: RecordDetail) => (
              <View
                key={detail.cargoId.toString()}
                style={styles.detailContainer}>
                <Text style={styles.cargoName}>{detail.cargoName}</Text>
                {detail.cargoModels.map((model: RecordDetailModel) => (
                  <ListItem key={model.modelId.toString()} bottomDivider>
                    <ListItem.Content>
                      <Text style={styles.modelName}>{model.modelName}</Text>
                      <Text style={styles.modelQuantity}>
                        数量: {model.quantity} {detail.unit}
                      </Text>
                    </ListItem.Content>
                    <Icon
                      name="info"
                      type="material"
                      color={colorStyle.primary}
                    />
                  </ListItem>
                ))}
              </View>
            ))}
          </ListItem.Accordion>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  startButton: {
    backgroundColor: colorStyle.primary,
    marginBottom: 16,
  },
  recordContainer: {
    marginBottom: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorStyle.textPrimary,
  },
  recordStatus: {
    fontSize: 14,
    color: colorStyle.textSecondary,
  },
  accordion: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
  },
  detailContainer: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
  cargoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorStyle.textPrimary,
  },
  modelName: {
    fontSize: 14,
    color: colorStyle.textPrimary,
  },
  modelQuantity: {
    fontSize: 14,
    color: colorStyle.textSecondary,
  },
});
