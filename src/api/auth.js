import axios from "axios";

const API_URL = "https://moneyfulpublicpolicy.co.kr";

// 회원가입
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 로그인
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    const token = response.data?.accessToken;
    if (!token) {
      throw new Error("로그인에 실패했습니다. 토큰을 받지 못했습니다.");
    }
    localStorage.setItem("authToken", token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 사용자 프로필 가져오기
export const getUserProfile = async (token) => {
  try {
    if (isTokenExpired(token)) {
      throw new Error("토큰이 만료되었습니다.");
    }
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// 토큰 만료 여부 확인
export const isTokenExpired = (token) => {
  try {
    const base64Payload = token.split(".")[1]; // JWT의 두 번째 부분 (Payload)
    const decodedPayload = JSON.parse(atob(base64Payload)); // Base64 디코딩 후 JSON 파싱
    const now = Date.now() / 1000; // 현재 시간 (초 단위)
    return decodedPayload.exp < now; // 만료 시간이 현재 시간보다 이전인지 확인
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return true; // 디코딩 실패 시 만료된 것으로 간주
  }
};

// 프로필 업데이트
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도하세요.");
    }
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`, // 인증 토큰
        "Content-Type": "application/json", // 요청 타입
      },
    });
    return response.data; // 업데이트된 사용자 데이터 반환
  } catch (error) {
    throw error.response?.data || error.message; // 오류 처리
  }
};

export const getTestResults = async () => {
  try {
    const token = localStorage.getItem("authToken");
    console.log("사용자 토큰:", token); // 토큰 확인
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인 후 다시 시도하세요.");
    }

    const response = await axios.get(`${API_URL}/test-results`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API 응답 데이터:", response.data); // 응답 데이터 확인
    return response.data;
  } catch (error) {
    console.error(
      "테스트 결과 가져오기 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};
