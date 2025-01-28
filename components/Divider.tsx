import React from 'react';
import {View, StyleSheet} from 'react-native';

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#ccc', // 设置分隔线的颜色
    marginVertical: 10, // 设置分隔线上下的间距
  },
});

export default Divider;
