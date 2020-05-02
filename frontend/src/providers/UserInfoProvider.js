import React, { useState } from "react";
import ChatService from "../services/ChatService";

let chatService = new ChatService();

export const UserInfoContext = React.createContext(null);

export default function UserInfoProvider(props) {
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(chatService);
  const [fcmsubscribe, setFcmsubscribe] = useState(null);

  return (
    <UserInfoContext.Provider
      value={{
        user,
        setUser,
        chat,
        fcmsubscribe,
        setFcmsubscribe,
      }}
    >
      {props.children}
    </UserInfoContext.Provider>
  );
}
