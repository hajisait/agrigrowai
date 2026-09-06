import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ChatThread = Tables<"chat_threads">;
export type SavedChatMessage = Tables<"chat_messages">;

export async function listChatThreads() {
  const { data, error } = await supabase
    .from("chat_threads")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function createChatThread(userId: string, title = "New farming chat") {
  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ user_id: userId, title })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateChatThread(id: string, patch: { title?: string }) {
  const { data, error } = await supabase
    .from("chat_threads")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteChatThread(id: string) {
  const { error } = await supabase.from("chat_threads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listChatMessages(threadId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function saveChatMessage(input: {
  threadId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      thread_id: input.threadId,
      user_id: input.userId,
      role: input.role,
      content: input.content,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}