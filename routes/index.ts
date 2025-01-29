import {BSON} from 'realm';

export type RootStackParamList = {
  Home: undefined;
  AddCargo: undefined;
  EditCargo: {cargoId: string};
};
