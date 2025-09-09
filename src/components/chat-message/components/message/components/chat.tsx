import type { Message } from "@/components/chat-message/types";
import { Button } from "@/components/ui/button";
import { DEFAULT_COLORS_BORING_AVATAR } from "@/config";
import Avatar from "boring-avatars";
import { TimerIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { formatDistanceToNow } from "date-fns";

interface ChatProps {
  message: Message;
}

interface ChatWrapperProps {
  isCurrentUser: boolean;
  message: Message;
  children: React.ReactNode;
}

const ChatWrapper = ({
  isCurrentUser,
  message,
  children,
}: ChatWrapperProps) => {
  return (
    <div
      className={`flex gap-3 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isCurrentUser && (
        <Avatar
          name={message.sender}
          colors={DEFAULT_COLORS_BORING_AVATAR}
          size={24}
          variant="beam"
        />
      )}
      {children}

      {isCurrentUser && (
        <Avatar
          name={message.sender}
          colors={DEFAULT_COLORS_BORING_AVATAR}
          size={24}
          variant="beam"
        />
      )}
    </div>
  );
};

const OfferChat: React.FC<ChatProps> = ({ message }) => {
  const { address } = useAccount();
  const parts = message.content.split("::");
  const orderId = parts[1];
  const domainName = parts[2];
  const currency = parts[3];
  const amount = parts[4];
  const offererAddress = parts[5];
  const expirationUnixSeconds = parseInt(parts[6], 10) * 1000; // Convert to milliseconds
  const timeDifference = formatDistanceToNow(expirationUnixSeconds, {
    addSuffix: true,
  });
  const isExpired = Date.now() > expirationUnixSeconds;
  const ownedByCurrentUser =
    offererAddress.toLowerCase() === address?.toLowerCase();

  const handleAcceptOffer = useCallback(() => {
    console.log(orderId, "orderId");
  }, [orderId]);

  return (
    <ChatWrapper message={message} isCurrentUser={ownedByCurrentUser}>
      <div
        className={`space-y-2 p-4 border-2 rounded-lg border-dashed ${
          ownedByCurrentUser
            ? "bg-primary text-primary-foreground border-accent"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <div className="text-sm">
          {ownedByCurrentUser
            ? "🚀 You sent an offer for"
            : "🎉 You received an offer for"}
        </div>
        <div className="space-y-1">
          <div className="font-semibold text-lg">{domainName}</div>
          <div>
            <span className="font-semibold text-4xl">{amount}</span>{" "}
            <span className="text-xs">{currency}</span>
          </div>
          <div className="pb-2">
            <div className="flex items-center gap-0.5 text-xs">
              <TimerIcon size={12} />
              {!isExpired && <div>Offer expires {timeDifference}</div>}
              {isExpired && <div>Offer expired</div>}
            </div>
          </div>
        </div>
        {!ownedByCurrentUser && (
          <Button
            disabled={isExpired}
            className="w-full"
            onClick={handleAcceptOffer}
          >
            {isExpired ? "Expired" : "Accept Offer"}
          </Button>
        )}
      </div>
    </ChatWrapper>
  );
};

const Chat: React.FC<ChatProps> = ({ message }) => {
  const { address } = useAccount();
  const isCurrentUser = useMemo(() => {
    return message.sender === address;
  }, [message, address]);

  const isOfferChat = useMemo(() => {
    if (typeof message.content !== "string") return false;
    const parts = message.content.split("::");
    if (parts.length !== 7) return false;
    if (parts[0] !== "send_offer") return false;
    return true;
  }, [message]);

  if (isOfferChat) return <OfferChat message={message} />;

  return (
    <ChatWrapper isCurrentUser={isCurrentUser} message={message}>
      <div
        className={`max-w-[70%] rounded-lg px-3 py-2 ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
