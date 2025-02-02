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
import {HomeScreenProps} from '../routes/types';

export default function HomeScreen({navigation}: HomeScreenProps) {
  return (
    <ScrollView style={styles.container}>
      {/* 应用程序的Logo */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>欢迎使用我的应用</Text>
      </View>

      {/* 应用介绍 */}
      <View style={styles.introSection}>
        <Text style={styles.subtitle}>一站式解决您所有需求</Text>
        <Text style={styles.description}>探索多种功能，轻松管理您的库存。</Text>
      </View>

      {/* 特色功能 */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>主要功能</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✔ 货品管理</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>✔ 库存管理</Text>
        </View>
      </View>

      {/* 开始按钮 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cargo')}>
        <Text style={styles.buttonText}>开始使用</Text>
      </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  introSection: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
