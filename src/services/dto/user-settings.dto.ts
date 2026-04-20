export interface UserSettingsResponseDto {
  theme: string;
  character_id: number | null;
}

export interface UpdateThemeDto {
  theme: string;
}

export interface UpdateCharacterDto {
  character_id: number | null;
}
