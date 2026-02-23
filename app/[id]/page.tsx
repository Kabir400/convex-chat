import ConversationLayout from "../components/conversation/ConversationLayout";
import ChatPanel from "../components/conversation/ChatPanel";
import { Id } from "../../convex/_generated/dataModel";

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { id } = await params;

  return (
    <ConversationLayout>
      <ChatPanel conversationId={id as Id<"conversations">} />
    </ConversationLayout>
  );
}
