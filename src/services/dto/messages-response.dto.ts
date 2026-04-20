export interface MessageResponseDto {
  message_id: number;
  chat_id: number;
  role: 'user' | 'bot';
  content: string;
  createdAt: Date;
}
