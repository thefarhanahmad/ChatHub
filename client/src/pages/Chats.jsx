import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSunglasses } from "react-icons/bs";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000/");

const Chats = () => {
  // states managements
  const { register, handleSubmit, reset } = useForm();
  const chatContainerRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState([]);

  // logging to check existing values
  // console.log("user :", user);
  // console.log("chats :", chats);

  // Getting user from local storage and setUser
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  // funtion to send message and emit on socket
  const sendMessage = (e) => {
    // console.log("message data", e);
    const msg = e.message;
    socket.emit("send", { msg: msg, sender: user });

    // make input field empty as value = ""; using reset method
    reset();
  };

  // set scrollbar to bottom automatically when new messages arrived
  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  // funtion to get message from socket
  useEffect(() => {
    const getMessage = async () => {
      socket.on("receive", (msg) => {
        setChats((prechats) => [...prechats, msg]);
      });
    };
    getMessage();
  }, []);

  // reaturning UI
  return (
    <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% w-full h-screen p-2 sm:p-6 overflow-hidden box-border">
      <div className="w-full sm:w-3/4 m-auto flex flex-col sm:h-[95vh] h-[98vh]  rounded-lg overflow-hidden">
        {/* header */}
        <div className="bg-[#075985] w-full h-[10%] flex  justify-center items-center font-sans font-bold text-white text-3xl">
          ChatHub
        </div>

        {/*chats messages */}
        <div
          ref={chatContainerRef}
          className="bg-[#BAE6FD] h-[80%] w-full overflow-y-auto"
        >
          {chats.map((chat, i) => {
            return (
              <div
                key={i}
                className={` mx-4 my-3 ${
                  user === chat.sender ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block bg-[#7DD3FC] max-w-[50%] rounded-sm px-2 ${
                    user === chat.sender ? "text-right" : "text-left"
                  }`}
                >
                  <span className="text-xs font-semibold text-[#0C4A6E] ">
                    {chat.sender === user ? "You" : chat.sender}
                  </span>{" "}
                  <br />
                  <span className="text-md font-semibold">{chat.msg}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* chat input */}
        <div className="bg-[#075985] w-full h-[10%] flex justify-center items-center">
          <form onSubmit={handleSubmit(sendMessage)} className="w-full">
            <div className="flex w-full justify-center items-center gap-2">
              <span className="p-2 rounded-full flex justify-center items-center bg-[#0284C7] text-white">
                <BsEmojiSunglasses />
              </span>
              <input
                type="text"
                id="message"
                placeholder="Write your message..."
                {...register("message")}
                className="border-2 w-[80%] rounded-md p-1 px-3 bg-[#E0F2FE]"
              />
              <button className="p-2 rounded-full flex justify-center items-center bg-[#0284C7] text-white">
                <IoMdSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chats;
