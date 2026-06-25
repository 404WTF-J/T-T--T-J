import { createClient } from "@supabase/supabase-js";

export const STORAGE_KEY_MESSAGES = "love_messages";
export const STORAGE_KEY_CONFIG = "love_partner_config";

export const DEFAULT_CONFIG = {
  nickA: "404",
  nickB: "梨花头",
  avatarA: "🌙",
  avatarB: "☀️",
};

/**
 * 读取对方配置（仍使用 localStorage）
 */
export function loadConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    return saved
      ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
      : { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * 时间格式化
 */
export function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const date = new Date(timestamp);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;

  const today = new Date();
  const isYesterday =
    date.getDate() === today.getDate() - 1 &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const timeStr = date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.toDateString() === today.toDateString()) {
    return `今天 ${timeStr}`;
  } else if (isYesterday) {
    return `昨天 ${timeStr}`;
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${timeStr}`;
  }
}

// Supabase 配置
const supabaseUrl = "https://tynywkmemlzmnzhluaos.supabase.co";
const supabaseKey = "sb_publishable_t1_HyQIuyE18ZV0Si2JNIg_aTz8fnYL";

const supabase = createClient(supabaseUrl, supabaseKey);
const TABLE_NAME = "MessageChat";
const LETTER_TABLE = "LetterChat";
const Home_Poems = "HomePoems";

/**
 * 获取所有留言
 */
export async function loadMessages() {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];

    // 转换数据格式
    return data.map((item) => ({
      id: item.id,
      content: item.content,
      sender: item.sender,
      timestamp: new Date(item.created_at).getTime(),
      mood: item.mood || "💕", // 默认表情
    }));
  } catch (error) {
    console.error("加载留言失败:", error);
    return [];
  }
}

/**
 * 发布留言
 */
export async function saveMessages(messageData) {
  try {
    // 验证必要字段
    if (!messageData[0].content || !messageData[0].sender) {
      console.error("留言内容或发送者不能为空");
      return false;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          content: messageData[0].content,
          sender: messageData[0].sender,
          mood: messageData.mood || "💕",
        },
      ])
      .select(); // 返回插入的数据

    if (error) {
      console.error("Supabase 插入错误:", error);
      throw error;
    }

    console.log("留言发布成功:", data);
    return true;
  } catch (error) {
    console.error("保存留言失败:", error);
    return false;
  }
}

/**
 * 删除留言
 */
export async function deleteMessage(id) {
  try {
    if (!id) {
      console.error("缺少消息ID");
      return false;
    }

    const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);

    if (error) throw error;

    console.log("删除成功:", id);
    return true;
  } catch (error) {
    console.error("删除失败:", error);
    return false;
  }
}

/**
 * 实时监听新消息
 */
export function subscribeToNewMessage(callback) {
  const channel = supabase
    .channel("message_channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: TABLE_NAME,
      },
      (payload) => {
        console.log("收到新消息:", payload.new);
        // 转换格式后回调
        const newMessage = {
          id: payload.new.id,
          content: payload.new.content,
          sender: payload.new.sender,
          timestamp: new Date(payload.new.created_at).getTime(),
          mood: payload.new.mood || "💕",
        };
        callback(newMessage);
      }
    )
    .subscribe();

  // 返回取消订阅函数
  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * 保存对方配置（仍使用 localStorage）
 */
export function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
}

// ==========================================
// LetterChat (信件) 相关逻辑
// ==========================================

/**
 * 加载所有信件
 */
export async function loadLetters() {
  try {
    const { data, error } = await supabase
      .from(LETTER_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      letterTitle: item.letterTitle,
      firstregard: item.firstregard,
      content: item.content,
      sender: item.sender,
      endingregard: item.endingregard,
    }));
  } catch (error) {
    console.error("加载信件失败:", error);
    return [];
  }
}

// ==========================================
// HomePoems (首页诗句) 相关逻辑
// ==========================================

//获取所有主页诗句
export async function getHomePoems() {
  try {
    const { data, error } = await supabase
      .from(Home_Poems)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) return [];

    return data.map((item) => ({
      PoemContent: item.PoemContent,
    }));
  } catch (error) {
    console.error("加载诗句列表失败:", error);
    return [];
  }
}

// 导出 supabase 实例供其他用途
export { supabase };
