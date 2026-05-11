<template>
  <div class="form-card">
    <textarea
      ref="textareaRef"
      class="message-input"
      v-model="content"
      :placeholder="`👋${props.senderNick}，今天想说什么悄悄话...`"
      :disabled="isSubmitting"
      maxlength="500"
      @keydown="handleKeydown"
    ></textarea>

    <div class="char-counter" :class="{ 'counter-warn': isOverLimit }">
      {{ charCount }}/500
    </div>

    <div>
      <button
        class="submit-btn"
        :class="{ feedback: showFeedback }"
        @click="submit"
      >
        {{ isSubmitting ? "放入中..." : "轻轻放入瓶中 ✨" }}
      </button>
    </div>
    <div v-if="showFeedback" class="feedback-text">已放入瓶中 💌</div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import { message } from "ant-design-vue";

const props = defineProps({
  senderNick: String,
  senderAvatar: String,
});

const emit = defineEmits(["submit-message"]);

const content = ref("");
const isSubmitting = ref(false);
const showFeedback = ref(false);
const textareaRef = ref(null);

const charCount = computed(() => content.value.length);
const isOverLimit = computed(() => charCount.value > 500);

function submit() {
  const trimmed = content.value.trim();
  if (!trimmed || isOverLimit.value) {
    message.warning("你小子什么都没说你瞎点什么/🤨");
    return;
  }

  isSubmitting.value = true;
  emit("submit-message", trimmed);
  content.value = "";
  showFeedback.value = true;

  setTimeout(() => {
    showFeedback.value = false;
    isSubmitting.value = false;
    textareaRef.value?.focus();
  }, 600);
}

function handleKeydown(e) {
  if (e.ctrlKey && e.key === "Enter") {
    submit();
  }
}
</script>

<style scoped>
.form-card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 14px;
  flex-shrink: 0;
}

.message-input {
  width: 100%;
  height: 150px;
  border: none;
  resize: none;
  padding: 12px;
  font-size: 1rem;
  color: #4a2040;
  background: #fdf2f6;
  border-radius: 12px;
  outline: none;
  min-height: 70px;
  font-family: inherit;
  transition: background 0.2s, box-shadow 0.2s;
  line-height: 1.5;
}

.message-input:focus {
  background: #ffeef4;
  box-shadow: 0 0 0 3px rgba(231, 84, 128, 0.1);
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: #a08090;
  margin-top: 4px;
}

.counter-warn {
  color: #e75480;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
  padding: 12px;
  background: #e75480;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
}

.submit-btn:hover:not(:disabled) {
  background: #d43d6a;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(231, 84, 128, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn.feedback {
  background: #43a047;
}

.feedback-text {
  text-align: center;
  margin-top: 8px;
  color: #43a047;
  font-size: 0.85rem;
}
</style>
