import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from '@rneui/themed';
import HomeScreen from '../screens/HomeScreen';
import CargoScreen from '../screens/cargo';
import AddCargo from '../screens/cargo/AddCargo';
import AddCategory from '../screens/cargo/AddCategory';
import AddModel from '../screens/cargo/AddModel';
import AddUnit from '../screens/cargo/AddUnit';
import EditCargo from '../screens/cargo/EditCargo';
import EditModel from '../screens/cargo/EditModel';
import CargoManage from '../screens/cargo/manage/CargoManage';
import CategoryManage from '../screens/cargo/manage/CategoryManage';
import ModelManage from '../screens/cargo/manage/ModelManage';
import UnitManage from '../screens/cargo/manage/UnitManage';
import InventoryScreen from '../screens/inventory';
import CargoInventory from '../screens/inventory/CargoInventory';
import InboundManagement from '../screens/inventory/InboundManagement';
import OutboundManagement from '../screens/inventory/OutboundManagement';
import {RootStackParamList, RootTabParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// 定义主页的 Tab 导航器
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home';
          let type = 'antdesign';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Cargo') {
            iconName = 'package';
            type = 'material-community';
          } else if (route.name === 'Inventory') {
            iconName = 'warehouse';
            type = 'material';
          }

          return <Icon name={iconName} size={size} color={color} type={type} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: '首页', headerShown: false}}
      />
      <Tab.Screen
        name="Cargo"
        component={CargoScreen}
        options={{
          title: '货品',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: '库存',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

// 主导航器
export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddCargo"
        component={AddCargo}
        options={{title: '新增货品'}}
      />
      <Stack.Screen
        name="EditCargo"
        component={EditCargo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddModel"
        component={AddModel}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{title: '新增种类'}}
      />
      <Stack.Screen
        name="AddUnit"
        component={AddUnit}
        options={{title: '新增单位'}}
      />
      <Stack.Screen
        name="EditModel"
        component={EditModel}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CargoManage"
        component={CargoManage}
        options={{title: '货品管理'}}
      />
      <Stack.Screen
        name="CategoryManage"
        component={CategoryManage}
        options={{title: '种类管理'}}
      />
      <Stack.Screen
        name="UnitManage"
        component={UnitManage}
        options={{title: '单位管理'}}
      />
      <Stack.Screen
        name="ModelManage"
        component={ModelManage}
        options={{title: '型号管理'}}
      />
      <Stack.Screen
        name="CargoInventory"
        component={CargoInventory}
        options={{title: '货品库存'}}
      />
      <Stack.Screen
        name="OutboundManagement"
        component={OutboundManagement}
        options={{title: '出库管理'}}
      />
      <Stack.Screen
        name="InboundManagement"
        component={InboundManagement}
        options={{title: '入库管理'}}
      />
    </Stack.Navigator>
  );
}
