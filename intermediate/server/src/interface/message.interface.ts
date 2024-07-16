export interface IMessage {
  sender: string;
  content: string;
  timestamp: Date | number,
  type: string
}