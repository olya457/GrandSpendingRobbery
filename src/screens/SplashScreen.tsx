import React, {useEffect} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {assets} from '../assets';

type SplashScreenProps = {
  onDone: () => void;
};

const loadingHtml = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        overflow: hidden;
      }
      .track {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 8px;
        transform: translateY(-50%);
        border-radius: 999px;
        background: rgba(255, 255, 255, .22);
        overflow: hidden;
      }
      .bar {
        height: 100%;
        width: 45%;
        border-radius: 999px;
        background: linear-gradient(90deg, #76ff00, #ffd40a);
        animation: load 1.1s ease-in-out infinite;
      }
      @keyframes load {
        0% { transform: translateX(-110%); }
        100% { transform: translateX(245%); }
      }
    </style>
  </head>
  <body>
    <div class="track"><div class="bar"></div></div>
  </body>
</html>
`;

export function SplashScreen({onDone}: SplashScreenProps): React.JSX.Element {
  useEffect(() => {
    const timer = setTimeout(onDone, 5000);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <ImageBackground
      source={assets.loaderBackground}
      resizeMode="cover"
      style={styles.root}>
      <View style={styles.webShell}>
        <WebView
          originWhitelist={['*']}
          source={{html: loadingHtml}}
          scrollEnabled={false}
          style={styles.webView}
          containerStyle={styles.webContainer}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0618',
  },
  webShell: {
    position: 'absolute',
    left: 54,
    right: 54,
    bottom: 40,
    height: 18,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webContainer: {
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
