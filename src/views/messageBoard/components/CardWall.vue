<template>
  <div class="card-wall">
    <!-- 空状态 -->
    <div v-if="pagedMessages.length === 0" class="empty-state">
      <div class="empty-icon">💤</div>
      <div class="empty-text">还没有回忆卡片，先写一句悄悄话吧 ✍️</div>
    </div>

    <!-- 卡片网格 -->
    <div v-else class="card-grid">
      <div
        v-for="msg in pagedMessages"
        :key="msg.id"
        class="card-wrapper"
        :class="{ flipped: flippedCards.has(msg.id) }"
        @click="toggleFlip(msg.id)"
      >
        <div class="card-inner">
          <!-- 正面：谁 + 时间 -->
          <div class="card-front" :class="getCardClass(msg.sender)">
            <div class="card-avatar">{{ getAvatar(msg.sender) }}</div>
            <div class="card-nick">{{ getNick(msg.sender) }}</div>
            <div class="card-time">{{ formatTime(msg.timestamp) }}</div>
            <div class="card-hint">👆 点击翻开</div>
          </div>

          <!-- 背面：内容 -->
          <div class="card-back">
            <div class="close-card" @click.stop="deleteCard(msg.id)">
              <a-space>
                <CloseOutlined />
              </a-space>
            </div>
            <div class="card-content">{{ msg.content }}</div>
            <div class="card-back-nick">— {{ getNick(msg.sender) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ← 上一页
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一页 →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, createVNode, defineEmits } from "vue";
import { formatTime, deleteMessage } from "../lib/Storage";
import {
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { Modal, message } from "ant-design-vue";
const props = defineProps({
  messages: Array,
  config: Object,
});
const emit = defineEmits(["refresh"]);

const pageSize = 6; // 每页最多 6 张卡片
const currentPage = ref(1);
const flippedCards = ref(new Set());
const totalPages = computed(
  () => Math.ceil(props.messages.length / pageSize) || 1
);

const pagedMessages = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return props.messages.slice(start, end);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    flippedCards.value = new Set(); // 翻页时重置翻转状态
  }
}

function toggleFlip(cardId) {
  const newSet = new Set(flippedCards.value);
  if (newSet.has(cardId)) {
    newSet.delete(cardId);
  } else {
    newSet.add(cardId);
  }
  flippedCards.value = newSet;
}

function deleteCard(msgId) {
  Modal.confirm({
    title: "确认删除",
    icon: createVNode(ExclamationCircleOutlined),
    content: "确定要删除这张卡片吗？",
    okText: "确定",
    cancelText: "取消",
    onOk() {
      deleteMessage(msgId);
      message.success("删除成功");
      flippedCards.value.delete(msgId);
      emit("refresh");
    },
    onCancel() {
      message.info("已取消删除");
    },
  });
}

function getNick(sender) {
  return sender === "A" ? props.config.nickA : props.config.nickB;
}

function getAvatar(sender) {
  return sender === "A" ? props.config.avatarA : props.config.avatarB;
}

function getCardClass(sender) {
  return sender === "A" ? "warm" : "cool";
}
</script>

<style scoped>
.card-wall {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.card-wall::-webkit-scrollbar {
  width: 4px;
}

.card-wall::-webkit-scrollbar-thumb {
  background: #d0b0c0;
  border-radius: 4px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #b090a0;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.empty-text {
  font-size: 0.95rem;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 4px 0;
}

/* 翻转卡片 */
.card-wrapper {
  perspective: 1000px;
  height: 160px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card-wrapper.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 正面 */
.card-front.warm {
  background: linear-gradient(135deg, #fff5f8, #ffe8f0);
  border: 1.5px solid #f0d0e0;
}

.card-front.cool {
  background: linear-gradient(135deg, #f5f8ff, #e8f0ff);
  border: 1.5px solid #d0e0f0;
}

.card-avatar {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.card-nick {
  font-weight: 600;
  font-size: 1rem;
  color: #4a2040;
  margin-bottom: 4px;
}

.card-time {
  font-size: 0.75rem;
  color: #a08090;
}

.card-hint {
  font-size: 0.65rem;
  color: #c0a0b0;
  margin-top: 8px;
  opacity: 0.7;
}

.close-card {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 8px;
  right: 10px;
  border-radius: 50%;
  background-color: #f0f0f0;
  cursor: pointer;
  /* display: none; */
}

/* 背面 */
.card-back {
  background: white;
  border: 1.5px solid #e8e0e8;
  transform: rotateY(180deg);
  padding: 16px 12px;
  justify-content: center;
  align-items: center;
}

.card-content {
  font-size: 0.9rem;
  color: #4a2040;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 100%;
  overflow-y: auto;
}

.card-content::-webkit-scrollbar {
  width: 3px;
}

.card-content::-webkit-scrollbar-thumb {
  background: #d0b0c0;
  border-radius: 3px;
}

.card-back-nick {
  font-size: 0.75rem;
  color: #b090a0;
  margin-top: 8px;
  font-style: italic;
}

/* 分页器 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  flex-shrink: 0;
}

.page-btn {
  background: white;
  border: 1px solid #e0c0d0;
  color: #e75480;
  padding: 6px 18px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #fff0f5;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.8rem;
  color: #a08090;
}
</style>
