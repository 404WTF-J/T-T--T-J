<template>
  <div class="board">
    <!-- 返回按钮 -->
    <div class="pichenxin" id="pichenxin" @click="router.push('/mainContent')">
      <span
        v-for="(char, index) in '下次再聊'"
        :key="index"
        class="skewed-char"
      >
        {{ char }}
      </span>
    </div>

    <!-- 标题 -->
    <div class="header">
      <div class="title">💌 我们的悄悄话</div>
    </div>

    <!-- ========== 输入视图 ========== -->
    <template v-if="currentView === 'form'">
      <div class="identity-area">
        <select
          class="identity-switch"
          :value="currentSender"
          @change="switchSender"
        >
          <option value="A">
            {{ partnerConfig.avatarA }} {{ partnerConfig.nickA }}
          </option>
          <option value="B">
            {{ partnerConfig.avatarB }} {{ partnerConfig.nickB }}
          </option>
        </select>
        <button class="edit-name-btn" @click="toggleEditName">✎ 改昵称</button>
      </div>

      <div v-if="showEditName" class="edit-name-area">
        <input v-model="editNameA" placeholder="昵称A" />
        <input v-model="editNameB" placeholder="昵称B" />
        <button class="save-name-btn" @click="saveNames">保存</button>
        <button class="save-name-btn" @click="CancelsaveNames">取消</button>
      </div>

      <MessageForm
        :sender-nick="senderNick"
        :sender-avatar="senderAvatar"
        @submit-message="handleSubmit"
      />

      <div class="divider">我们的回忆 <span>♡</span></div>

      <div class="nav-buttons">
        <button class="nav-remind-btn" @click="goToWall">
          📬 翻开回忆角落 ({{ messages.length > 0 ? messages.length : "0" }})
        </button>
      </div>
    </template>

    <!-- ========== 卡片墙视图 ========== -->
    <template v-if="currentView === 'wall'">
      <div class="wall-header">
        <button class="nav-remind-btn back-btn" @click="goBack">
          ← 写新的悄悄话
        </button>
      </div>
      <div class="divider">📬 回忆卡片墙 <span>♡</span></div>

      <CardWall
        :messages="messages"
        :config="partnerConfig"
        @refresh="handleRefresh"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import MessageForm from "./components/MessageForm.vue";
import CardWall from "./components/CardWall.vue";
// import {
//   loadMessages,
//   saveMessages,
//   loadConfig,
//   saveConfig,
//   DEFAULT_CONFIG,
// } from "./lib/Storage";
import {
  loadMessages,
  saveMessages,
  loadConfig,
  saveConfig,
  DEFAULT_CONFIG,
} from "@/utils/CloudStore.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

onMounted(async () => {
  // 等待 DOM 更新完成
  await nextTick();

  // 初始化页面动画
  initAnimations();
  inintmeassage();
});

// 初始化基础动画
const initAnimations = () => {
  //返回上级页面文字动画
  gsap.from(".skewed-char", {
    duration: 1,
    rotation: () => Math.random() * 360 - 180,
    scale: 0,
    opacity: 0,
    delay: 1.5,
    stagger: 0.1,
    ease: "back.out(1.7)",
  });
};

const router = useRouter();

// ========== 状态 ==========
const messages = ref([]);
const partnerConfig = reactive(loadConfig());
const currentSender = ref("A");
const showEditName = ref(false);
const editNameA = ref(partnerConfig.nickA);
const editNameB = ref(partnerConfig.nickB);
const currentView = ref("form"); // 'form' | 'wall'

// ========== 计算属性 ==========
const senderNick = computed(() =>
  currentSender.value === "A" ? partnerConfig.nickA : partnerConfig.nickB
);
const senderAvatar = computed(() =>
  currentSender.value === "A" ? partnerConfig.avatarA : partnerConfig.avatarB
);

// ========== 方法 ==========
async function inintmeassage() {
  messages.value = await loadMessages();
}

async function addMessage(content) {
  // 1. 防御性检查：确保 messages.value 是数组
  if (!Array.isArray(messages.value)) {
    messages.value = [];
  }

  const newMsg = {
    sender: currentSender.value,
    content,
    timestamp: Date.now(),
  };
  messages.value.unshift(newMsg);

  const success = await saveMessages(messages.value);
  if (success) {
    await loadMessages();
  } else {
    console.error("消息保存失败");
  }
}

async function handleRefresh(deletedId = null) {
  // 1. 如果传入了要删除的 ID，先在本地数组中移除它（乐观更新）
  if (deletedId) {
    messages.value = messages.value.filter((msg) => msg.id !== deletedId);
  }

  // 2. 再去云端拉取最新数据，确保最终一致性
  const latestMessages = await loadMessages();

  // 3. 更新列表
  if (Array.isArray(latestMessages)) {
    messages.value = latestMessages;
  }
}

function handleSubmit(content) {
  addMessage(content);
  goToWall();
}

function switchSender(event) {
  currentSender.value = event.target.value;
}

function toggleEditName() {
  if (!showEditName.value) {
    editNameA.value = partnerConfig.nickA;
    editNameB.value = partnerConfig.nickB;
  }
  showEditName.value = !showEditName.value;
}

function saveNames() {
  partnerConfig.nickA = editNameA.value.trim() || DEFAULT_CONFIG.nickA;
  partnerConfig.nickB = editNameB.value.trim() || DEFAULT_CONFIG.nickB;
  saveConfig({
    nickA: partnerConfig.nickA,
    nickB: partnerConfig.nickB,
    avatarA: partnerConfig.avatarA,
    avatarB: partnerConfig.avatarB,
  });
  showEditName.value = false;
}

function CancelsaveNames() {
  showEditName.value = false;
}

function goToWall() {
  currentView.value = "wall";
}

function goBack() {
  currentView.value = "form";
}
</script>

<style scoped>
.board {
  width: 100%;
  /* max-width: 480px; */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(120, 60, 80, 0.08),
    0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: "Segoe UI", "Helvetica Neue", system-ui, sans-serif;
  position: relative;
}

.pichenxin {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  opacity: 0.3;
  transition: all 0.5s;
  cursor: pointer;
  color: #959393;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.pichenxin:hover {
  opacity: 0.7;
  transform: scale(1.1);
}

.header {
  text-align: center;
  margin: 20px 0px 40px 0px;
  flex-shrink: 0;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #4a2040;
  letter-spacing: 2px;
}

/* 身份切换 */
.identity-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.identity-switch {
  padding: 6px 14px;
  border-radius: 30px;
  border: 1px solid #e0c0d0;
  background: white;
  font-size: 0.95rem;
  color: #4a2040;
  cursor: pointer;
  outline: none;
  transition: 0.2s;
}

.identity-switch:focus {
  border-color: #e75480;
  box-shadow: 0 0 0 3px rgba(231, 84, 128, 0.15);
}

.edit-name-btn {
  background: none;
  border: none;
  color: #c090a0;
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px;
  opacity: 0.7;
}

.edit-name-area {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.edit-name-area input {
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #e0c0d0;
  font-size: 0.9rem;
  width: 100px;
}

.save-name-btn {
  padding: 6px 12px;
  border-radius: 30px;
  background: #e75480;
  color: white;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
}

/* 分割线 */
.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #b090a0;
  font-size: 0.9rem;
  margin-top: 20px;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #d0b0c0, transparent);
}

.divider span {
  margin: 0 6px;
}

/* 导航按钮 */
.nav-buttons {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  position: absolute;
  bottom: 40px;
  right: 20px;
}

.nav-remind-btn {
  background: none;
  border: 1px solid #e0c0d0;
  color: #a07080;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
}

.nav-remind-btn:hover {
  background: #fff0f5;
  border-color: #e75480;
  color: #e75480;
}

.wall-header {
  text-align: left;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.back-btn {
  border: none;
  background: #fff0f5;
}
</style>
