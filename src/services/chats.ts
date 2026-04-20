import { ApiRoutes } from './constants';
import { UpdateChatDto } from './dto/chats-request.dto';
import { ChatsResponseDto } from './dto/chats-response.dto';
import { axiosInstance } from './instance';

let chatsCache: ChatsResponseDto[] | null = null;
let chatsRequest: Promise<ChatsResponseDto[]> | null = null;

const resetChatsCache = () => {
  chatsCache = null;
  chatsRequest = null;
};

export const getAll = async (): Promise<ChatsResponseDto[]> => {
  if (chatsCache) {
    return chatsCache;
  }

  if (chatsRequest) {
    return chatsRequest;
  }

  chatsRequest = axiosInstance
    .get<ChatsResponseDto[]>(ApiRoutes.CHATS, {})
    .then(({ data }) => {
      chatsCache = data;
      return data;
    })
    .finally(() => {
      chatsRequest = null;
    });

  return chatsRequest;
};

export const create = async (): Promise<ChatsResponseDto> => {
  const { data } = await axiosInstance.post<ChatsResponseDto>(ApiRoutes.CHATS);

  resetChatsCache();
  return data;
};

export const update = async (
  chatId: number,
  chatData: UpdateChatDto
): Promise<ChatsResponseDto> => {
  const { data } = await axiosInstance.patch<ChatsResponseDto>(
    `${ApiRoutes.CHATS}/${chatId}`,
    chatData
  );

  resetChatsCache();
  return data;
};

export const remove = async (chatId: number): Promise<void> => {
  await axiosInstance.delete(`${ApiRoutes.CHATS}/${chatId}`);
  resetChatsCache();
};
