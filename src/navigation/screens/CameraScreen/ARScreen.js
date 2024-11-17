import React, { useEffect, useState } from 'react';
import {
  ViroARScene,
  Viro3DObject,
  ViroMaterials,
  ViroAnimations,
  ViroARSceneNavigator,
  ViroAmbientLight,
  ViroDirectionalLight,
} from '@reactvision/react-viro';
import { StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// 마커 재질 정의
ViroMaterials.createMaterials({
  capsuleMaterial: {
    lightingModel: 'PBR',
    roughness: 0.4,
    metalness: 0.1,
    diffuseColor: '#FFFFFF',
    diffuseTexture: require('./gift_box/11563_gift_box_diffuse.jpg'),
  },
  activeCapsuleMaterial: {
    lightingModel: 'Blinn',
    diffuseColor: '#FFC864',
    transparency: 0.7,
  },
});

// 애니메이션 정의 (필요한 경우)
ViroAnimations.registerAnimations({
  rotate: {
    duration: 2500,
    properties: {
      rotateY: '+=90'
    },
  }
});

// AR 씬 컴포넌트
const HelloWorldSceneAR = () => {
  const [text, setText] = React.useState('Start AR');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [capsuleLocations, setCapsuleLocations] = useState([]);

  useEffect(() => {
    requestPermissions();
    fetchCapsuleLocations();
  }, []);

  // 권한 요청 및 위치 가져오기
  const requestPermissions = async () => {
    try {
      // 카메라 권한
      await requestCameraPermission();
      
      // 위치 권한
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('위치 권한이 거부되었습니다');
        return;
      }

      // 현재 위치 가져오기
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      // 위치 실시간 업데이트 구독
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,    // 5초마다
          distanceInterval: 5,   // 5미터 이상 움직였을 때
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    } catch (error) {
      console.error('위치 권한 요청 실패:', error);
    }
  };

  // GPS 좌표를 AR 상대 좌표로 변환하는 함수 개선
  const calculateARPosition = (targetLat, targetLong) => {
    if (!currentLocation) return [0, 0, 0];
    
    // 하버사인 공식을 사용한 실제 거리 계산
    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = currentLocation.latitude * Math.PI/180;
    const φ2 = targetLat * Math.PI/180;
    const Δφ = (targetLat - currentLocation.latitude) * Math.PI/180;
    const Δλ = (targetLong - currentLocation.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // 방위각 계산
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
             Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const bearing = Math.atan2(y, x);

    // AR 공간으로 변환 (거리를 스케일링)
    const scale = 0.1; // AR 공간 스케일 팩터
    const arX = Math.sin(bearing) * distance * scale;
    const arZ = -Math.cos(bearing) * distance * scale;

    return [arX, 0, arZ];
  };

  function onInitialized(state) {
    if (state === 'TRACKING_NORMAL') {
      setText('AR is ready');
    } else if (state === 'TRACKING_NONE') {
      setText('Scan Slowly Please');
    }
  }

  // 거리 기반 필터링 함수 추가
  const filterByDistance = (capsules, maxDistance = 1000) => { // 1km 이내
    if (!currentLocation) return [];
    
    return capsules.filter(capsule => {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        capsule.latitude,
        capsule.longitude
      );
      return distance <= maxDistance;
    });
  };

  // 타임캡슐 데이터 가져오기
  const fetchCapsuleLocations = async () => {
    try {
      const profileId = await AsyncStorage.getItem('profileId');
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!profileId || !accessToken) {
        console.error('프로필 ID 또는 액세스 토큰이 없습니다.');
        return;
      }

      const response = await fetch(
        `https://tuituiworld.store/api/profiles/${profileId}/capsules?pageNo=0&pageSize=20&sortBy=writeAt`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();
      
      // 응답 데이터 구조 확인 및 에러 처리
      if (!result || !result.data || !result.data.contents) {
        console.error('잘못된 응답 데이터 형식:', result);
        return;
      }

      // 응답 데이터 로깅
      console.log('API 응답:', result);

      const locations = result.data.contents.map(capsule => ({
        id: capsule.capsuleId,
        latitude: capsule.latitude,
        longitude: capsule.longitude,
        title: capsule.content?.substring(0, 10) + '...',
        remindDate: capsule.remindDate,
        distance: 0
      }));

      if (currentLocation) {
        const locationsWithDistance = locations.map(loc => ({
          ...loc,
          distance: calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            loc.latitude,
            loc.longitude
          )
        })).sort((a, b) => a.distance - b.distance);

        setCapsuleLocations(locationsWithDistance);
      } else {
        setCapsuleLocations(locations);
      }

    } catch (error) {
      console.error('타임캡슐 위치 데이터 로드 실패:', error);
      // 상세한 에러 정보 출력
      if (error.response) {
        console.error('에러 응답:', error.response);
      }
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#FFFFFF" intensity={300}/>
      <ViroDirectionalLight
        color="#FFFFFF"
        direction={[0, -1, -2]}
        intensity={300}
        castsShadow={true}
      />
      
      {currentLocation && filterByDistance(capsuleLocations).map(capsule => (
        <Viro3DObject
          key={capsule.id}
          source={require('./gift_box/11563_gift_box_V3obj.obj')}
          resources={[
            require('./gift_box/11563_gift_box_V3mtl.mtl'),
            require('./gift_box/11563_gift_box_diffuse.jpg'),
            require('./gift_box/11563_gift_box_bow_diffuse.jpg'),
            require('./gift_box/Map__1_Normal Bump.jpg')
          ]}
          position={calculateARPosition(capsule.latitude, capsule.longitude)}
          rotation={[-90, 0, 0]}
          scale={[0.02, 0.02, 0.02]}
          type="OBJ"
          materials={['capsuleMaterial']}
          animation={{
            name: 'rotate',
            loop: true,
            run: true,
            delay: 1000
          }}
          onClick={() => {
            console.log('캡슐 클릭:', capsule.id);
          }}
        />
      ))}
    </ViroARScene>
  );
};

// 두 지점 간의 거리 계산 함수
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 미터 단위 거리
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
  markerTextStyle: {
    fontFamily: 'Arial',
    fontSize: 15,
    color: '#FFFFFF',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

export default ARScreen;