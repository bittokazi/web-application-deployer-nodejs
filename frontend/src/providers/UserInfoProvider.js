import React, { useState } from "react";
import ChatService from "../services/ChatService";

let chatService = new ChatService();

export const UserInfoContext = React.createContext(null);

export default function UserInfoProvider(props) {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(chatService);

  return (
    <UserInfoContext.Provider
      value={{
        user,
        setUser,
        chat
      }}
    >
      {props.children}
    </UserInfoContext.Provider>
  );
}
