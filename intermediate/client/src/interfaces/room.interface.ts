import { IMessage } from "./message.interface";

export interface IRoom {
  id: string,
  name: string,
  joined: boolean,
  messages: IMessage[]
}