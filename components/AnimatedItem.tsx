import React, {useState} from 'react';
import {Animated, TouchableOpacity} from 'react-native';

// 定义 AnimatedItem 组件的 props 类型
interface AnimatedItemProps {
  itemKey: string;
  onPress: () => void;
  children: React.ReactNode;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  itemKey,
  onPress,
  children,
}) => {
  const [animValue, setAnimValue] = useState(new Animated.Value(1));

  const handlePress = () => {
    // 执行点击动画
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95, // 点击时稍微缩小
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1, // 还原回原来大小
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // 调用传入的 onPress 函数
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View
        style={{
          transform: [
            {
              scale: animValue,
            },
          ],
        }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedItem;
