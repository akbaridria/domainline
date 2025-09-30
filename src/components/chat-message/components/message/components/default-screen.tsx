import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, MessageCircle, Shield } from "lucide-react";

const DefaultScreen = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-8 h-full bg-accent/10 rounded-xl">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">
            Your Conversations Are Secured by XMTP
          </h2>
          <p className="text-muted-foreground">
            Select a chat to start messaging with end-to-end encryption
          </p>
        </div>
        <Alert className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            If you want to test with registered XMTP users, you can search for
            these domains and start chatting:
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">anchortex.ai</Badge>
              <Badge variant="secondary">anchorthegreat.ai</Badge>
              <Badge variant="secondary">superanchor.ai</Badge>
            </div>
          </AlertDescription>
        </Alert>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>End-to-end encrypted messages</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Decentralized & private communication</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Your keys, your data ownership</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs pt-4 text-muted-foreground">
            <MessageCircle className="w-3 h-3" />
            <span>Powered by XMTP Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultScreen;
