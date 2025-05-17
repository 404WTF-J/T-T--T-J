<template>
  <!-- 计时器 -->
  <div
    class="timer-container"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseLeave"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="timer" :style="timerStyle">
      <div class="timer-face front" id="timer-front">
        <div class="time-unit">
          <div class="time-value">{{ daysStr }}</div>
          <div class="time-label">Days</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ hoursStr }}</div>
          <div class="time-label">Hours</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ minutesStr }}</div>
          <div class="time-label">Minutes</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ secondsStr }}</div>
          <div class="time-label">Seconds</div>
        </div>
      </div>
      <div class="timer-face back"></div>
      <div class="timer-face right"></div>
      <div class="timer-face left"></div>
      <div class="timer-face top"></div>
      <div class="timer-face bottom">相识数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

// 格式化字符串，补零
const pad = (num) => String(num).padStart(2, "0");
const daysStr = computed(() => pad(days.value));
const hoursStr = computed(() => pad(hours.value));
const minutesStr = computed(() => pad(minutes.value));
const secondsStr = computed(() => pad(seconds.value));

// 旋转角度响应式
const rotateX = ref(15);
const rotateY = ref(-15);

const timerStyle = computed(() => {
  return {
    transform: `rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
  };
});

const startDate = new Date(2025, 3, 12, 19, 0, 0); // 2025年4月12日19:00:00

let intervalId = null;

function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000);

  // 自动旋转效果
  rotateX.value = 15 + (seconds.value / 60) * 10;
  rotateY.value = -15 + (minutes.value / 60) * 15;
}

// 绑定拖拽旋转逻辑
let isDragging = false;
let startX = 0;
let startY = 0;

function onMouseDown(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
}

function onMouseMove(e) {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  rotateY.value = -15 + deltaX * 0.2;
  rotateX.value = 15 + deltaY * 0.1;
}

function onMouseUp() {
  isDragging = false;
}

function onMouseLeave() {
  isDragging = false;
}

// 触摸事件
function onTouchStart(e) {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}

function onTouchMove(e) {
  if (!isDragging) return;
  const deltaX = e.touches[0].clientX - startX;
  const deltaY = e.touches[0].clientY - startY;
  rotateY.value = -15 + deltaX * 0.2;
  rotateX.value = 15 + deltaY * 0.1;
}

function onTouchEnd() {
  isDragging = false;
}

onMounted(() => {
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<style scoped>
.timer-container {
  position: fixed;
  top: 70px;
  left: 65px;
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

.timer {
  position: relative;
  width: 300px;
  height: 150px;
  transform-style: preserve-3d;
  transform: rotateX(15deg) rotateY(-15deg);
  transition: transform 0.5s ease;
}

.timer-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* -webkit-animation-backdrop-filter: blur(10px); */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

/* 3D立体面 */
.timer-face.front {
  transform: translateZ(50px);
  background: linear-gradient(
    145deg,
    rgba(100, 115, 255, 0.8),
    rgba(46, 52, 163, 0.8)
  );
}

.timer-face.back {
  transform: translateZ(-50px) rotateY(180deg);
  background: linear-gradient(
    145deg,
    rgba(46, 52, 163, 0.8),
    rgba(100, 115, 255, 0.8)
  );
}

.timer-face.right {
  transform: rotateY(90deg) translateZ(275px);
  width: 100px;
  background: rgba(46, 52, 163, 0.6);
}

.timer-face.left {
  transform: rotateY(-90deg) translateZ(75px);
  width: 100px;
  background: rgba(46, 52, 163, 0.6);
}

.timer-face.top {
  transform: rotateX(90deg) translateZ(75px);
  height: 100px;
  background: rgba(100, 115, 255, 0.5);
}

.timer-face.bottom {
  transform: rotateX(-90deg) translateZ(120px);
  height: 100px;
  background: rgba(100, 115, 255, 0.5);
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.time-value {
  font-size: 3rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.time-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 5px;
}

@media (max-width: 480px) {
  .timer {
    width: 280px;
    height: 140px;
    transform: rotateX(10deg) rotateY(-10deg);
  }

  .time-value {
    font-size: 2.2rem;
  }

  .timer-face.right,
  .timer-face.left {
    width: 80px;
  }

  .timer-face.top,
  .timer-face.bottom {
    height: 80px;
  }

  .ListenBox {
    display: block !important;
    position: absolute;
    text-align: center;
    right: 20px;
    top: 20px;
    opacity: 0.5;
    font-style: italic;
  }

  .musicBox {
    /* position: absolute; */
    text-align: center;
    right: 20px;
    top: 20px;
    opacity: 0.5;
    display: none;
    /* background-color: #0a0a0a; */
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>
