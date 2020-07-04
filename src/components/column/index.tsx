import React from "react";

import {View, StyleProp, ViewStyle} from "react-native";
interface Props {
  size: 1 | 2 | 3;
  margin?: number | string;
  style?: StyleProp<ViewStyle>;
}

const Column: React.FC<Props> = ({size, margin, style, children}) => {
  return (
    <View
      style={[
        {
          width: size === 1 ? "100%" : size === 2 ? "50%" : "33.333333%",
          margin: margin ?? 5,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default Column;
