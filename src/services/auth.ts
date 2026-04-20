import { ApiRoutes } from './constants';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { axiosInstance } from './instance';

export const login = async (loginData: LoginDto): Promise<LoginResponseDto> => {
  const { data } = await axiosInstance.post<LoginResponseDto>(ApiRoutes.LOGIN, {
    ...loginData,
  });
  return data;
};

export const registration = async (
  loginData: LoginDto
): Promise<LoginResponseDto> => {
  const { data } = await axiosInstance.post<LoginResponseDto>(
    ApiRoutes.REGISTRATION,
    {
      ...loginData,
    }
  );
  return data;
};
