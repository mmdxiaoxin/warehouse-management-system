import {useRealm} from '@realm/react';
import {Button, SearchBar, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {BSON} from 'realm';
import RecordItem from '../../components/RecordItem';
import {useRecord} from '../../hooks/useRecord';
import {Cargo} from '../../models/Cargo';
import {Record} from '../../models/Record';
import {InboundRecordProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InboundRecord({navigation}: InboundRecordProps) {
  const realm = useRealm();
  const [searchQuery, setSearchQuery] = useState('');
  const {getRecordsByType, deleteRecord} = useRecord();

  const handleSubmit = (recordId: BSON.ObjectId) => {
    Alert.alert('确认提交', `您确定要提交入库表单吗？`, [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确定',
        onPress: async () => {
          try {
            // 开始事务，提交入库记录并更新货品规格数量
            realm.write(() => {
              // 1 修改入库记录状态为已提交
              const record = realm.objectForPrimaryKey(Record, recordId);
              if (!record) {
                throw new Error('记录不存在');
              }
              record.status = true;
              record.utime = new Date();

              // 2 更新货品规格的数量
              record.detail.forEach(detail => {
                const cargo = realm.objectForPrimaryKey(Cargo, detail.cargoId);
                if (!cargo) {
                  throw new Error('货品不存在');
                }

                // 遍历每个货品的规格，并更新数量
                detail.cargoModels.forEach(model => {
                  const foundModel = cargo.models.find(item =>
                    item._id.equals(model.modelId),
                  );
                  if (foundModel) {
                    foundModel.quantity += model.quantity; // 累加数量
                    foundModel.utime = new Date(); // 更新时间
                  }
                });
              });
            });

            ToastAndroid.show('提交成功', ToastAndroid.SHORT);
          } catch (error: any) {
            console.error('提交入库表单失败：', error);
            Alert.alert('提交失败', '提交表单时发生错误: ' + error.message);
          }
        },
      },
    ]);
  };

  const handleDelete = (recordId: BSON.ObjectId) => {
    try {
      Alert.alert('删除确认', '确定要删除该草稿吗？', [
        {text: '取消', style: 'cancel'},
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            try {
              deleteRecord(recordId);
              ToastAndroid.show('删除成功', ToastAndroid.SHORT);
            } catch (error) {
              console.error('删除记录失败:', error);
              Alert.alert('删除记录失败', '数据库错误！');
            }
          },
        },
      ]);
    } catch (error) {
      console.error('删除记录失败:', error);
      Alert.alert('删除记录失败', '数据库错误！');
    }
  };

  return (
    <View style={styles.container}>
      {/* 固定搜索框 */}
      <View style={styles.header}>
        <SearchBar
          placeholder="筛选记录(按入库单号)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          platform="android"
          containerStyle={{borderRadius: 50}}
        />
      </View>

      {/* 记录列表 */}
      <FlatList
        style={styles.list}
        keyExtractor={item => item._id.toString()}
        data={getRecordsByType('inbound').filter(record =>
          record._id
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )}
        renderItem={({item}) => (
          <RecordItem
            item={item}
            onSubmitted={handleSubmit}
            onDeleted={handleDelete}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{color: colorStyle.textMuted}}>当前没有记录</Text>
          </View>
        }
      />

      {/* 固定按钮 */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.footer}>
          <Button
            title="开始入库"
            onPress={() => navigation.navigate('InboundManage')}
            buttonStyle={styles.startButton}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  list: {
    flex: 1,
    marginTop: 10,
    marginBottom: 80,
    paddingHorizontal: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  startButton: {
    backgroundColor: colorStyle.primary,
  },
  empty: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
