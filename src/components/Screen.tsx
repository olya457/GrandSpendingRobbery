import React from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {colors, navHeight} from '../theme';

export const topInset = Platform.OS === 'android' ? 30 : 70;
export const bottomInset = Platform.OS === 'android' ? 30 : 40;

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  withNavigation?: boolean;
  backgroundImage?: ImageSourcePropType;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  scroll = true,
  withNavigation = true,
  backgroundImage,
  contentStyle,
}: ScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const adaptiveTopInset =
    Platform.OS === 'android' ? topInset : compact ? 44 : topInset;
  const adaptiveBottomInset =
    Platform.OS === 'android' ? bottomInset : compact ? 18 : bottomInset;
  const topPadding = adaptiveTopInset + (compact ? 14 : 22);
  const bottomPadding = withNavigation
    ? navHeight + adaptiveBottomInset + (compact ? 14 : 24)
    : adaptiveBottomInset + 12;
  const sharedContentStyle = [
    styles.content,
    {
      paddingTop: topPadding,
      paddingBottom: bottomPadding,
      paddingHorizontal: compact ? 18 : 24,
    },
    contentStyle,
  ];
  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={sharedContentStyle}>
      {children}
    </ScrollView>
  ) : (
    <View style={[sharedContentStyle, styles.fixed]}>{children}</View>
  );

  const body = (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.shade}>{content}</View>
    </>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.root}>
        {body}
      </ImageBackground>
    );
  }

  return <View style={styles.root}>{body}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  shade: {
    flex: 1,
    backgroundColor: 'rgba(31, 22, 56, 0.36)',
  },
  content: {
    flexGrow: 1,
  },
  fixed: {
    flex: 1,
  },
});
