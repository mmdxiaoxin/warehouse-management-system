import {Button, SearchBar} from '@rneui/themed';
import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import RecordItem from '../../components/RecordItem';
import {useRecord} from '../../hooks/useRecord';
import {InboundRecordProps} from '../../routes/types';
import {colorStyle} from '../../styles';

export default function InboundRecord({navigation}: InboundRecordProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const {records} = useRecord();
  return (
    <FlatList
      style={styles.container}
      keyExtractor={item => item._id.toString()}
      data={records}
      ListHeaderComponent={
        <View>
          {/* 搜索框 */}
          <SearchBar
            placeholder="筛选记录"
            value={searchQuery}
            onChangeText={setSearchQuery}
            lightTheme
            round
          />
          <Button
            title="开始入库"
            onPress={() => navigation.navigate('InboundManage')}
            buttonStyle={styles.startButton}
          />
        </View>
      }
      renderItem={({item}) => <RecordItem item={item} />}
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
});
