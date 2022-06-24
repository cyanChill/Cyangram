import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";

import global from "../../../global";
import useLazyFetch from "../../../hooks/useLazyFetch";
import LoadImage from "../../ui/loadimage/loadimage";
import FormInput from "../../form_elements/forminput";
import Card from "../../ui/card/card";
import TextBreaker from "../../ui/textbreaker/textbreaker";
import classes from "./conversation.module.css";

const FETCH_AMOUNT = 12;
const REFRESH_TIME_MS = 30000;

const ConversationPage = ({ currUser, conversationUser }) => {
  const { loading, results, forceUpdate } = useLazyFetch(
    `/api/users/${currUser.username}/conversations/${conversationUser._id}`,
    FETCH_AMOUNT,
    REFRESH_TIME_MS
  );
  const [shouldBottom, setShouldBottom] = useState(true);
  const [messages, setMessages] = useState([]);
  const [exclusionIds, setExclusionids] = useState([]);
  const msgContainerEndRef = useRef(null);

  const handleMessageDelete = async (msgId) => {
    const res = await fetch(
      `/api/users/${currUser.username}/conversations/${conversationUser._id}/message`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: msgId }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: data.message,
      });
    } else {
      setExclusionids((prev) => [...prev, msgId]);
      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
    }
  };

  const scrollToBottom = useCallback(() => {
    msgContainerEndRef.current.scrollIntoView();
  }, [msgContainerEndRef]);

  /* Scroll to bottom on initialization (when all data is loaded) */
  useEffect(() => {
    if (!loading && shouldBottom) {
      scrollToBottom();
      setShouldBottom(false);
    }
  }, [loading]);

  useEffect(() => {
    setMessages(
      results
        .filter((msg) => !exclusionIds.some((id) => id === msg._id))
        .sort((a, b) => a.date - b.date)
    );
  }, [results]);

  return (
    <div className={classes.wrapper}>
      <Card shadow className={classes.cardStyles}>
        <ConversationHeader conversationUser={conversationUser} />
        <MessagesContainer
          messages={messages}
          currUser={currUser}
          conversationName={conversationUser.name}
          handleMessageDelete={handleMessageDelete}
          msgContainerEndRef={msgContainerEndRef}
        />
        <MessageInput
          updateMessages={forceUpdate}
          currUser={currUser}
          conversationUserId={conversationUser._id}
          scrollToBottom={scrollToBottom}
        />
      </Card>
    </div>
  );
};

export default ConversationPage;

const ConversationHeader = ({ conversationUser }) => {
  const router = useRouter();
  return (
    <header className={classes.header}>
      <MdOutlineArrowBackIos
        className={classes.backBtn}
        onClick={() => router.back()}
      />
      <div className={classes.img}>
        <LoadImage
          src={conversationUser.profilePic.url}
          alt={`${conversationUser.name}'s Profile Picture`}
          width="500"
          height="500"
          layout="responsive"
          className={classes.rounded}
        />
      </div>
      <p
        className={classes.userName}
        onClick={() => router.push(`/${conversationUser.username}`)}
      >
        <span>{conversationUser.name}</span>
      </p>
    </header>
  );
};

const MessagesContainer = ({
  messages,
  currUser,
  conversationName,
  handleMessageDelete,
  msgContainerEndRef,
}) => {
  return (
    <div className={classes.msgContainer}>
      <p className={classes.messageStart}>
        This is the start of your conversation with {conversationName}.
      </p>
      {messages.map((message) => (
        <div
          key={message._id}
          className={`${classes.message} ${
            message.senderId === currUser.dbId
              ? classes.sentMsg
              : classes.recievedMsg
          }`}
        >
          {message.senderId === currUser.dbId && (
            <div
              className={classes.deleteIcon}
              onClick={() => handleMessageDelete(message._id)}
            >
              <FaTrashAlt />
            </div>
          )}
          <TextBreaker className={classes.msgBubble}>
            {message.messageContent}
          </TextBreaker>
        </div>
      ))}
      <div ref={msgContainerEndRef} />
    </div>
  );
};

const MessageInput = ({
  currUser,
  conversationUserId,
  updateMessages,
  scrollToBottom,
}) => {
  const [messageField, setMessageField] = useState("");

  const handleMessageSubmit = async (e) => {
    e.preventDefault();

    if (!messageField.trim() && messageField.trim().length <= 200) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: "Invalid message length (>0 & <=200).",
      });
      return;
    }

    const res = await fetch(
      `/api/users/${currUser.username}/conversations/${conversationUserId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageContent: messageField.trim() }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      global.alerts.actions.addAlert({
        type: global.alerts.types.error,
        content: data.message,
      });
    } else {
      await updateMessages();
      setMessageField("");
      scrollToBottom();
    }
  };

  return (
    <form onSubmit={handleMessageSubmit} className={classes.messageField}>
      <FormInput
        type="text"
        placeholder="Message..."
        maxLength="200"
        required
        value={messageField}
        onChange={(e) => setMessageField(e.target.value.trimStart())}
        onBlur={() => setMessageField((prev) => prev.trimEnd())}
        noExternalPadding
      />

      {/* Disable the following if the textfield is empty */}
      <span
        variant="clear"
        className={classes.sendBtn}
        disabled={!messageField && messageField.length <= 200}
        onClick={handleMessageSubmit}
      >
        Send
      </span>
    </form>
  );
};
