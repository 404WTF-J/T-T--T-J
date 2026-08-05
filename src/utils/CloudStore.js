import { createClient } from "@supabase/supabase-js";

export const STORAGE_KEY_MESSAGES = "love_messages";
export const STORAGE_KEY_CONFIG = "love_partner_config";

export const DEFAULT_CONFIG = {
  nickA: "404",
  nickB: "1376",
  avatarA: "☀️",
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
const Must_Dolist = "MustDolist";

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

// ==========================================
// MustDolist (必做清单) 相关逻辑
// ==========================================

// 获取所有必做清单
// 【改造】CloudStore.js 中 getMustDolist 改造示例
export async function getMustDolist({
  page = 1,
  pageSize = 12,
  status = "all",
}) {
  try {
    let query = supabase
      .from(Must_Dolist)
      .select("*", { count: "exact" }) // 【改造】count:"exact" 让 supabase 顺带返回总数
      .order("created_at", { ascending: false });

    // 【改造-新增】根据筛选状态加条件
    if (status === "completed") {
      query = query.eq("completed", true);
    } else if (status === "notCompleted") {
      query = query.eq("completed", false);
    }

    // 【改造-新增】分页核心：range(from, to)
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        img: item.img,
        imgDetail: item.imgDetail,
        completed: item.completed,
        isProcessing: item.isProcessing,
        created_at: item.created_at,
      })),
      total: count || 0, // 【改造-新增】总条数返回给前端分页组件用
    };
  } catch (error) {
    console.error("加载清单列表失败:", error);
    return { data: [], total: 0 };
  }
}

// 向必做清单中添加新项
export async function addMustDoItem(
  title,
  img,
  imgDetail,
  completed,
  isProcessing
) {
  try {
    const { data, error } = await supabase
      .from(Must_Dolist)
      .insert([{ title, img, imgDetail, completed, isProcessing }])
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("添加清单项失败:", error);
    return null;
  }
}

// 【新增】更新已有任务的图片/完成状态，用于用户上传真实图片后持久化保存
export async function updateMustDoItem(id, updates) {
  try {
    const { data, error } = await supabase
      .from(Must_Dolist)
      .update(updates) // updates 是一个对象，比如 { img, imgDetail, completed }
      .eq("id", id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("更新清单项失败:", error);
    return null;
  }
}

// 【查询】获取全部完成数据用于统计，只查 completed 字段，减少传输体积
export async function getMustDoCompeleteNum() {
  try {
    // 【改造】只 select completed 字段，不要 img/imgDetail 这些大字段，
    // 100条数据只传 completed 状态，开销可以忽略不计
    const { data, error } = await supabase
      .from(Must_Dolist)
      .select("completed");

    if (error) throw error;

    const total = data.length;
    const completedCount = data.filter((item) => item.completed).length;

    return { total, completedCount };
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return { total: 0, completedCount: 0 };
  }
}
// 导出 supabase 实例供其他用途
export { supabase };
