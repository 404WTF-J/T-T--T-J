// storage.js

export const STORAGE_KEY_MESSAGES = "love_messages";
export const STORAGE_KEY_CONFIG = "love_partner_config";

export const DEFAULT_CONFIG = {
  nickA: "小月亮",
  nickB: "大太阳",
  avatarA: "🌙",
  avatarB: "☀️",
};

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

/**
 * 读取留言列表
 */
export function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_MESSAGES)) || [];
  } catch {
    return [];
  }
}

/**
 * 删除留言
 */
export function deleteMessage(messagesId) {
  try {
    const messages = loadMessages();
    const newMessages = messages.filter((message) => message.id !== messagesId);
    saveMessages(newMessages);
  } catch {
    console.error("删除留言失败");
  }
}

/**
 * 保存留言列表
 */
export function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
}

/**
 * 读取对方配置
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
 * 保存对方配置
 */
export function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
}
