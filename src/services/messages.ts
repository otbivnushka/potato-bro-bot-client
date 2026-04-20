import { ApiRoutes } from './constants';
import { MessageResponseDto } from './dto/messages-response.dto';
import { axiosInstance } from './instance';

const messagesCache = new Map<number, MessageResponseDto[]>();
const messagesRequests = new Map<number, Promise<MessageResponseDto[]>>();

const cloneMessages = (messages: MessageResponseDto[]) =>
  messages.map((message) => ({ ...message }));

export const getById = async (
  chatId: number
): Promise<MessageResponseDto[]> => {
  const cachedMessages = messagesCache.get(chatId);
  if (cachedMessages) {
    return cloneMessages(cachedMessages);
  }

  const pendingRequest = messagesRequests.get(chatId);
  if (pendingRequest) {
    return pendingRequest;
  }

  const request = axiosInstance
    .get<MessageResponseDto[]>(ApiRoutes.MESSAGES + `/${chatId}`)
    .then(({ data }) => {
      messagesCache.set(chatId, data);
      return cloneMessages(data);
    })
    .finally(() => {
      messagesRequests.delete(chatId);
    });

  messagesRequests.set(chatId, request);

  return request;
};
