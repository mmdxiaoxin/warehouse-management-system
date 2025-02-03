import {Button, SearchBar, Text} from '@rneui/themed';
import React, {useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RecordItem from '../../components/RecordItem';
import {useRecord} from '../../hooks/useRecord';
import {OutboundRecordProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function OutboundRecord({navigation}: OutboundRecordProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const {getRecordsByType} = useRecord();

  return (
    <View style={styles.container}>
      {/* 固定搜索框 */}
      <View style={styles.header}>
        <SearchBar
          placeholder="筛选记录(按出库单号)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          lightTheme
          round
        />
      </View>

      {/* 记录列表 */}
      <FlatList
        style={styles.list}
        keyExtractor={item => item._id.toString()}
        data={getRecordsByType('outbound').filter(record =>
          record._id
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )}
        renderItem={({item}) => <RecordItem item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>没有记录</Text>
          </View>
        }
      />

      {/* 固定按钮 */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.footer}>
          <Button
            title="开始出库"
            onPress={() => navigation.navigate('OutboundManage')}
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
