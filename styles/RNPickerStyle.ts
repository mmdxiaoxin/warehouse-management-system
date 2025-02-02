import {StyleSheet} from 'react-native';
import {colorStyle} from '.';

export const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    borderRadius: 5,
    color: colorStyle.textPrimary,
    paddingHorizontal: 12,
    paddingRight: 30, // to ensure the text is not overrun by the icon
  },
});
