import {Card, PricingCard} from '@rneui/themed';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import logo from '../assets/YangziLogo.png';
import {useModel} from '../hooks/useModel';
import {useRecord} from '../hooks/useRecord';
import {HomeScreenProps} from '../routes/types';

export default function HomeScreen({navigation}: HomeScreenProps) {
  const {modelList} = useModel();
  const {getRecordsByType} = useRecord();

  const totalStock = modelList.reduce(
    (total, model) => total + model.quantity,
    0,
  );
  const inboundCount = getRecordsByType('inbound').length;
  const outboundCount = getRecordsByType('outbound').length;

  return (
    <ScrollView style={styles.container}>
      {/* 上部分：Logo和统计信息 */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>欢迎使用我的应用</Text>
      </View>

      {/* 左右分栏 */}
      <View style={styles.mainContent}>
        {/* 左边：库存信息 */}
        <View style={styles.leftSection}>
          <PricingCard
            containerStyle={{margin: 0}}
            title="库存总览"
            price={`${totalStock} 件`}
            button={{
              title: '查看详细',
              icon: 'add',
              onPress: () => navigation.navigate('CargoInventory'),
            }}
          />
        </View>

        {/* 右边：入库记录与出库记录 */}
        <View style={styles.rightSection}>
          {/* 入库记录 */}
          <Card containerStyle={{margin: 0, flex: 1, marginBottom: 15}}>
            <Card.Title>
              <TouchableOpacity
                onPress={() => navigation.navigate('InboundRecord')}>
                <Text style={{color: '#6961ce', fontWeight: 'bold'}}>
                  入库记录
                </Text>
              </TouchableOpacity>
            </Card.Title>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
              {inboundCount} 条
            </Text>
          </Card>

          {/* 出库记录 */}
          <Card containerStyle={{margin: 0, flex: 1, marginBottom: 15}}>
            <Card.Title>
              <TouchableOpacity
                onPress={() => navigation.navigate('OutboundRecord')}>
                <Text style={{color: '#ee812a', fontWeight: 'bold'}}>
                  出库记录
                </Text>
              </TouchableOpacity>
            </Card.Title>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
              {outboundCount} 条
            </Text>
          </Card>
        </View>
      </View>

      {/* 下部分：功能按钮 */}
      <View style={styles.buttonsSection}>
        {/* 第一排按钮 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => navigation.navigate('CargoManage')}>
            <Text style={styles.buttonText}>货品管理</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => navigation.navigate('CategoryManage')}>
            <Text style={styles.buttonText}>类别管理</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button3}
            onPress={() => navigation.navigate('UnitManage')}>
            <Text style={styles.buttonText}>单位管理</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button4}
            onPress={() => navigation.navigate('ModelManage')}>
            <Text style={styles.buttonText}>规格管理</Text>
          </TouchableOpacity>
        </View>

        {/* 第二排按钮 */}
        <View style={[styles.buttonRow, {marginBottom: 50}]}>
          <TouchableOpacity
            style={styles.button5}
            onPress={() => navigation.navigate('InboundManage')}>
            <Text style={styles.buttonText}>入库管理</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button7}
            onPress={() => navigation.navigate('OutboundManage')}>
            <Text style={styles.buttonText}>出库管理</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftSection: {
    flex: 2,
    marginRight: 10,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'column',
  },
  recordCard: {
    flex: 1,
  },
  buttonsSection: {
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button1: {
    backgroundColor: '#FF8C00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  button3: {
    backgroundColor: '#32CD32',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  button4: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  button5: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  button6: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  button7: {
    backgroundColor: '#20B2AA',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
