import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// 根 Tab 参数类型
export type RootTabParamList = {
  Home: undefined;
  Cargo: undefined;
  Inventory: undefined;
};

// 根 Stack 参数类型
export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<RootTabParamList>;
  AddCargo: undefined;
  AddModel: {cargoId: string} | undefined;
  AddCategory: undefined;
  AddUnit: undefined;
  AddBrand: undefined;
  EditCargo: {cargoId: string};
  EditCategory: {categoryId: string};
  EditUnit: {unitId: string};
  EditBrand: {brandId: string};
  EditModel: {cargoId: string; modelId: string};
  CargoManage: undefined;
  CategoryManage: undefined;
  UnitManage: undefined;
  ModelManage: {cargoId: string} | undefined;
  BrandManage: undefined;
  CargoClassify: undefined;
  CargoInventory: undefined;
  OutboundManage: undefined;
  OutboundRecord: undefined;
  InboundManage: undefined;
  InboundRecord: undefined;
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
export type AddCategoryProps = NativeStackScreenProps<
  RootStackParamList,
  'AddCategory'
>;
export type AddUnitProps = NativeStackScreenProps<
  RootStackParamList,
  'AddUnit'
>;
export type AddBrandProps = NativeStackScreenProps<
  RootStackParamList,
  'AddBrand'
>;
export type EditCargoProps = NativeStackScreenProps<
  RootStackParamList,
  'EditCargo'
>;
export type EditCategoryProps = NativeStackScreenProps<
  RootStackParamList,
  'EditCategory'
>;
export type EditUnitProps = NativeStackScreenProps<
  RootStackParamList,
  'EditUnit'
>;
export type EditBrandProps = NativeStackScreenProps<
  RootStackParamList,
  'EditBrand'
>;
export type EditModelProps = NativeStackScreenProps<
  RootStackParamList,
  'EditModel'
>;
export type CargoManageProps = NativeStackScreenProps<
  RootStackParamList,
  'CargoManage'
>;
export type CategoryManageProps = NativeStackScreenProps<
  RootStackParamList,
  'CategoryManage'
>;
export type UnitManageProps = NativeStackScreenProps<
  RootStackParamList,
  'UnitManage'
>;
export type ModelManageProps = NativeStackScreenProps<
  RootStackParamList,
  'ModelManage'
>;
export type BrandManageProps = NativeStackScreenProps<
  RootStackParamList,
  'BrandManage'
>;
export type CargoClassifyProps = NativeStackScreenProps<
  RootStackParamList,
  'CargoClassify'
>;
export type CargoInventoryProps = NativeStackScreenProps<
  RootStackParamList,
  'CargoInventory'
>;
export type OutboundManageProps = NativeStackScreenProps<
  RootStackParamList,
  'OutboundManage'
>;
export type OutboundRecordProps = NativeStackScreenProps<
  RootStackParamList,
  'OutboundRecord'
>;
export type InboundManageProps = NativeStackScreenProps<
  RootStackParamList,
  'InboundManage'
>;
export type InboundRecordProps = NativeStackScreenProps<
  RootStackParamList,
  'InboundRecord'
>;

// 为 Tab 屏幕定义 props 类型，结合 BottomTabScreenProps 和 NativeStackScreenProps
export type HomeScreenProps = BottomTabScreenProps<RootTabParamList, 'Home'> &
  NativeStackScreenProps<RootStackParamList>;
export type CargoScreenProps = BottomTabScreenProps<RootTabParamList, 'Cargo'> &
  NativeStackScreenProps<RootStackParamList>;
export type InventoryScreenProps = BottomTabScreenProps<
  RootTabParamList,
  'Inventory'
> &
  NativeStackScreenProps<RootStackParamList>;
