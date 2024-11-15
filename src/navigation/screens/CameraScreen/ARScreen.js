import React, { useEffect } from 'react';
import {
  ViroARScene,
  ViroText,
  ViroBox,
  ViroMaterials,
  ViroAnimations,
  ViroARSceneNavigator,
} from '@reactvision/react-viro';
import { StyleSheet, PermissionsAndroid, Platform } from 'react-native';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "카메라 권한 필요",
          message: "AR 기능을 사용하기 위해 카메라 권한이 필요합니다.",
          buttonNegative: "취소",
          buttonPositive: "확인"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

// AR 씬 컴포넌트
const HelloWorldSceneAR = () => {
  const [text, setText] = React.useState('AR 초기화 중...');

  useEffect(() => {
    requestCameraPermission();
  }, []);

  function onInitialized(state) {
    if (state === 'TRACKING_NORMAL') {
      setText('AR이 준비되었습니다!');
    } else if (state === 'TRACKING_NONE') {
      setText('주변을 천천히 스캔해주세요...');
    }
  }

  // 머티리얼 정의
  ViroMaterials.createMaterials({
    grid: {
      diffuseColor: 'rgba(200, 100, 100, 0.7)',
    },
  });

  // 애니메이션 정의
  ViroAnimations.registerAnimations({
    rotate: {
      duration: 2500,
      properties: {
        rotateY: '+=90',
      },
    },
  });

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
      
      <ViroBox
        position={[0, -0.5, -1]}
        scale={[0.3, 0.3, 0.3]}
        materials={['grid']}
        animation={{name: 'rotate', loop: true, run: true}}
        onClick={() => {
          setText('박스를 클릭하셨네요!');
        }}
      />
    </ViroARScene>
  );
};

// 메인 AR 스크린 컴포넌트
const ARScreen = () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

export default ARScreen;