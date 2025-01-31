import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// 根 Tab 参数类型
export type RootTabParamList = {
  Home: undefined;
  Management: undefined | {cargoId: string};
  Inventory: undefined;
};

// 根 Stack 参数类型
export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<RootTabParamList>;
  AddCargo: undefined;
  AddModel: {cargoId: string} | undefined;
  EditCargo: {cargoId: string};
};

// 为 AddCargo, AddModel, EditCargo 提供正确的类型
export type AddCargoProps = NativeStackScreenProps<
  RootStackParamList,
  'AddCargo'
>;
export type AddModelProps = NativeStackScreenProps<
  RootStackParamList,
  'AddModel'
>;
export type EditCargoProps = NativeStackScreenProps<
  RootStackParamList,
  'EditCargo'
>;

// 为 Tab 屏幕定义 props 类型，结合 BottomTabScreenProps 和 NativeStackScreenProps
export type HomeScreenProps = BottomTabScreenProps<RootTabParamList, 'Home'> &
  NativeStackScreenProps<RootStackParamList>;
export type ManagementScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'Management'
> &
  NativeStackScreenProps<RootStackParamList>;
export type InventoryScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'Inventory'
> &
  NativeStackScreenProps<RootStackParamList>;
