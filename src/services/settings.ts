import { ApiRoutes } from './constants';
import {
  UpdateCharacterDto,
  UpdateThemeDto,
  UserSettingsResponseDto,
} from './dto/user-settings.dto';
import { axiosInstance } from './instance';

let settingsCache: UserSettingsResponseDto | null = null;
let settingsRequest: Promise<UserSettingsResponseDto> | null = null;

const resetSettingsCache = () => {
  settingsCache = null;
  settingsRequest = null;
};

export const get = async (): Promise<UserSettingsResponseDto> => {
  if (settingsCache) {
    return settingsCache;
  }

  if (settingsRequest) {
    return settingsRequest;
  }

  settingsRequest = axiosInstance
    .get<UserSettingsResponseDto>(ApiRoutes.USER_SETTINGS)
    .then(({ data }) => {
      settingsCache = data;
      return data;
    })
    .finally(() => {
      settingsRequest = null;
    });

  return settingsRequest;
};

export const updateTheme = async (
  settingsData: UpdateThemeDto
): Promise<UserSettingsResponseDto> => {
  const { data } = await axiosInstance.patch<UserSettingsResponseDto>(
    ApiRoutes.USER_SETTINGS_THEME,
    settingsData
  );

  resetSettingsCache();
  return data;
};

export const updateCharacter = async (
  id: number
): Promise<UserSettingsResponseDto> => {
  const { data } = await axiosInstance.patch<UserSettingsResponseDto>(
    ApiRoutes.USER_SETTINGS_CHARACTER,
    {
      character_id: id,
    }
  );

  resetSettingsCache();
  return data;
};
