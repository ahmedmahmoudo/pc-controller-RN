import React from "react";

import {View, StyleProp, ViewStyle} from "react-native";

interface Props {
  style?: StyleProp<ViewStyle>;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
}

const Row: React.FC<Props> = ({
  style,
  direction,
  justifyContent,
  alignItems,
  children,
}) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: direction,
          justifyContent: justifyContent,
          alignItems: alignItems,
          padding: 5,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default Row;
