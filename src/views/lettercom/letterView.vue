<template>
  <div class="mail-page-container">
    <!-- 顶部返回 -->
    <div class="back-btn" @click="goBack">
      <span v-if="isOpened"
        ><svg
          t="1775638553773"
          class="icon"
          viewBox="0 0 1000 1000"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8777"
          width="20"
          height="20"
        >
          <path
            d="M439.312 227.986l-257.492 257.492c-20.11 20.11-20.11 52.709 0 72.819l257.492 257.492c20.11 20.11 52.709 20.11 72.819 0s20.11-52.709 0-72.819l-169.585-169.585h493.664c28.453 0 51.499-23.046 51.499-51.499s-23.046-51.499-51.499-51.499h-493.664l169.585-169.585c10.043-10.042 15.089-23.226 15.089-36.41s-5.021-26.367-15.089-36.41c-20.11-20.11-52.709-20.11-72.819 0z"
            p-id="8778"
          ></path>
        </svg>
      </span>
    </div>

    <!-- 信封核心容器 -->
    <div class="envelope-scene">
      <div
        class="envelope-wrapper"
        :class="{ 'is-open': isOpened }"
        @click="handleOpen"
      >
        <!-- 1. 信纸内容 -->
        <div class="letter-paper">
          <div class="letter-content">
            <h2 class="letter-title">致 亲爱的</h2>
            <div class="letter-body">
              <p>见字如面。</p>
              <p>
                在这个喧嚣的世界里，我把所有未曾说出口的温柔，都折叠进了这封信里。
              </p>
              <p>
                当你打开它的时候，希望窗外的风也是甜的。无论此刻你身在何处，请记得，有一个人，在静静地守候着你的情绪。
              </p>
              <p class="highlight">“愿你的梦里有星星，醒来有暖阳。”</p>
              <div class="signature">
                <p>—— 永远陪伴你的</p>
                <p class="date">404</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. 信封主体 (口袋) -->
        <div class="envelope-body"></div>

        <!-- 3. 信封盖 (翻盖) -->
        <div class="envelope-flap">
          <!-- 封口装饰：爱心/火漆印 -->
          <div class="seal">
            <el-icon><HeartFilled /></el-icon>
          </div>

          <!-- 信封盖上的文字：To XXX -->
          <div class="receiver-text">
            <span>To lht</span>
          </div>

          <!-- 盖子内部装饰（阴影） -->
          <div class="flap-shadow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const isOpened = ref(false);

const goBack = () => {
  router.back();
};

// 点击处理
const handleOpen = () => {
  // 如果已经打开，则不执行任何操作（或者可以执行关闭逻辑）
  if (!isOpened.value) {
    isOpened.value = true;
  }
};
</script>

<style scoped>
/* --- 字体引入：如果项目中没有手写字体，可以使用系统自带的楷体 --- */
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap");

/* --- 页面布局 --- */
.mail-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* 暖色调复古背景：淡淡的米黄色纹理感 */
  background-color: #fdfbf7;
  background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: hidden;
  perspective: 1200px; /* 增强3D感 */
  font-family: "Noto Serif SC", "KaiTi", "STKaiti", serif;
}

.back-btn {
  position: absolute;
  top: 12px;
  left: 10px;
  cursor: pointer;
  color: #8b5a5a;
  font-size: 18px;
  padding: 10px;
  border-radius: 50%;
  transition: background 0.3s;
  z-index: 20;
}

.back-btn:hover {
  background: rgba(139, 90, 90, 0.1);
}

/* --- 场景容器 --- */
.envelope-scene {
  position: relative;
  width: 380px;
  height: 460px;
  cursor: pointer; /* 提示可点击 */
}

/* --- 信封核心样式 --- */
.envelope-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

/* 点击时的轻微下沉反馈 */
.envelope-wrapper:active {
  transform: scale(0.98);
}

/* 信封底部 */
.envelope-body {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 暖杏色信封纸质感 */
  background: linear-gradient(135deg, #f7d6c6 0%, #f2b8a4 100%);
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(139, 90, 90, 0.2);
  z-index: 2;
  overflow: hidden;
}

/* 模拟信封口袋的折痕 */
.envelope-flap::before {
  content: "";
  position: absolute;
  left: 0;
  width: 0;
  height: 0;
  border-left: 190px solid transparent;
  border-right: 190px solid transparent;
  border-top: 210px solid rgba(255, 255, 255, 0.15); /* 亮色折痕 */
}

/* 信封盖 */
.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f7d6c6 0%, #f2b8a4 100%);
  border-radius: 12px;
  z-index: 5;
  transform-origin: top center;
  /* 慢速、优雅的翻转动画 */
  transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
  backface-visibility: hidden; /* 防止背面闪烁 */
}

/* 盖子内部阴影（翻转后看到的内侧） */
.flap-shadow {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-left: 190px solid transparent;
  border-right: 190px solid transparent;
  border-top: 210px solid rgba(220, 160, 140, 0.6); /* 内部颜色稍深 */
  opacity: 0;
  transition: opacity 0.5s;
}

/* 封口爱心/火漆印 */
.seal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 50px;
  height: 50px;
  background-color: #d85d80; /* 复古红 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(216, 93, 128, 0.4);
  z-index: 6;
  transition: transform 0.5s;
}

.seal:hover {
  transform: translate(-50%, -40%) scale(1.1);
}

/* 信封上的文字 "To XXX" */
.receiver-text {
  position: absolute;
  top: 24%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-5deg); /* 微微倾斜 */
  z-index: 5;
  pointer-events: none; /* 防止文字阻挡点击 */
}

.receiver-text span {
  font-family: "Noto Serif SC", "Brush Script MT", cursive;
  font-size: 28px;
  color: #8b5a5a; /* 深褐色墨水感 */
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.4);
  opacity: 0.9;
}

/* --- 打开状态样式 --- */
.envelope-wrapper.is-open .envelope-flap {
  transform: rotateX(120deg); /* 向上翻开 */
  z-index: 1; /* 翻到后面去 */
}

.envelope-wrapper.is-open .flap-shadow {
  opacity: 1; /* 显示内侧阴影 */
}

.envelope-wrapper.is-open .seal {
  opacity: 0; /* 封口消失或淡出 */
  transform: translate(-50%, -40%) scale(2);
}

/* 信纸 */
.letter-paper {
  position: absolute;
  top: 160px;
  left: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 60px);
  background-color: #fffdf8; /* 米白色信纸 */
  border-radius: 4px;
  padding: 30px 40px;
  box-sizing: border-box;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  z-index: 3;
  overflow-y: auto;
  /* 初始状态 */
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-out 0.4s; /* 延迟播放，配合盖子 */
}

/* 信纸滑出动画 */
.envelope-wrapper.is-open .letter-paper {
  opacity: 1;
  transform: translateY(-130px); /* 向上滑出 */
  z-index: 4;
}

/* --- 信纸排版 --- */
.letter-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.letter-title {
  text-align: center;
  font-size: 26px;
  margin-bottom: 25px;
  color: #d85d80;
  border-bottom: 1px solid #f0e6e6;
  padding-bottom: 15px;
  font-weight: 700;
}

.letter-body p {
  margin-bottom: 18px;
  font-size: 17px;
  color: #555;
  text-align: justify; /* 两端对齐 */
  line-height: 1.8;
}

.highlight {
  text-align: center;
  font-style: italic;
  color: #d85d80;
  font-size: 19px;
  margin: 30px 0;
  font-weight: bold;
}

.signature {
  margin-top: auto; /* 推到底部 */
  text-align: right;
  padding-right: 10px;
}

.signature p {
  margin-bottom: 5px;
  text-indent: 0;
}

.date {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}
</style>
