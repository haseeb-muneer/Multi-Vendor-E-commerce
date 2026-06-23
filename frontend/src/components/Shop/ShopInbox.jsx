import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { server } from "../../server";
import { getImageUrl } from "../../utils/imageUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../styles/styles";
import socketIO from "socket.io-client";
import { formatDistanceToNowStrict } from "date-fns";
const ENDPOINT = "http://localhost:4000";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
function ShopInbox() {
  const { seller, isLoading } = useSelector((state) => state.seller);
  // const {user}=useSelector((state)=>state.user);
  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData , setUserData]=useState(null);
    const [activeStatus , setActiveStatus]=useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage) {
      arrivalMessage &&
        currentChat?.members.include(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;
      socketId.emit("addUser", sellerId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

    const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
  
    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`,
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);
  console.log(messages);

  useEffect(() => {
    const fetchConversations = async () => {
      await axios
        .get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          { withCredentials: true },
        )
        .then((res) => {
          setConversations(res.data.conversations);
          console.log(res.data.conversations);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchConversations();
  }, [seller]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      sender: seller?._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member.id !== seller?._id,
    );
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    }); //we are sending the m
    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages((prev) => [...prev, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  //  update last message
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                userData={userData}
                setUserData={setUserData}
                 online={onlineCheck(item)}
                 setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
        />
      )}
    </div>
  );
}

const MessageList = ({ data, index, setOpen, setCurrentChat , me , userData , setUserData , online , setActiveStatus}) => {
  const [active, setActive] = useState(0);
   const [user , setUser]=useState(null);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
  };
   useEffect(() => {
    setActiveStatus(online);
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
    
  }, [me, data]);
  return (
    <div
      className={`w-full p-3 px-3 ${active === index ? "bg-[#00000010]" : "bg-transparent"} cursor-pointer flex items-center`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setOpen(true) ||
        setCurrentChat(data) ||
        setUserData(user)||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={getImageUrl(user?.avatar)}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        {online ? (<div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />):
        (<div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />)}
      </div>

      <div className="pl-3">
        <h1 className="text-[18px] font-[500]">{user?.fullName}</h1>
        <p className="text-[16px] text-[#000c]">{data?.lastMessageId !== user?._id
            ? "You:"
            : user?.fullName.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}</p>
      </div>
    </div>
  );
};
const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message Header */}
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={getImageUrl(userData?.avatar)}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.fullName}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>
      {/* mesaages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
            >
              {item.sender !== sellerId && (
                <img
                  src={getImageUrl(userData?.avatar)}
                  className="w-[40px] h-[40px] rounded-full mr-3"
                  alt=""
                />
              )}
              <div>
                <div className="w-max p-2 rounded bg-[#38c776] text-[#fff] h-min">
                  <p>{item.text}</p>
                </div>
                <p className="text-[12px] pt-1 text-[#000000d3]">
                  {formatDistanceToNowStrict(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* send message */}
      <form
        area-requirde={true}
        className="p-3 relative w-full flex justify-between"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
          <TfiGallery className="cursor-pointer" size={20} />
        </div>
        <div className="w-[97%]">
          <input
            type="text"
            requirde
            placeholder="Enter yout message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default ShopInbox;

