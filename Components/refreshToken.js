import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = "https://tuituiworld.store:8443";

export const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('refresh Token이 없습니다.');
    }
    
    const response = await fetch(`${baseUrl}/api/token?grant_type=refresh&refresh_token=${encodeURIComponent(refreshToken)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();

      // 서버 응답 데이터를 콘솔로 출력
      console.log('서버 응답 데이터:', data);

      // 응답 데이터에서 accessToken과 refreshToken을 가져옴
      const { accessToken, refreshToken: newRefreshToken } = data.data;

      // accessToken과 refreshToken이 유효한지 확인
      if (!accessToken || !newRefreshToken) {
        throw new Error('토큰 응답이 유효하지 않습니다.');
      }

      // 새로 발급받은 토큰을 저장
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      
      return accessToken;
    } else {
    }
  } catch (error) {
    console.error('access Token 재발급 오류:', error);
    throw error;
  }
};
