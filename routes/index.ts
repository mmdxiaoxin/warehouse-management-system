import {NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootTabParamList = {
  Home: undefined;
  Management: undefined;
  Inventory: undefined;
};

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<RootTabParamList>;
  AddCargo: undefined;
  AddModel: {cargoId: string} | undefined;
  EditCargo: {cargoId: string};
};

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
