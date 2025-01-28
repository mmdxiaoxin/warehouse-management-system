import AntDesignIcon from '@react-native-vector-icons/ant-design';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 定义主页的 Tab 导航器
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: 'home' | 'number';

          if (route.name === '主页') {
            iconName = 'home';
          } else {
            iconName = 'number';
          }

          return <AntDesignIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="主页" component={HomeScreen} />
      <Tab.Screen name="仓库" component={HomeScreen} />
    </Tab.Navigator>
  );
};

// 主导航器
const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default App;
