<template>
  <div class="maincontentbox">
    <div class="hearts">
      <div
        v-for="heart in hearts"
        :key="heart.id"
        :style="heart.style"
        class="heart"
      >
        ❤
      </div>
    </div>
    <div class="mainContent">
      <timer></timer>
      <div class="poembox">
        <div class="poem3" v-if="currentPoem">
          <h3>{{ currentPoem.title }}</h3>
          <div class="poem-content">
            <p v-for="(line, index) in currentPoem.lines" :key="index">
              {{ line }}
            </p>
          </div>
        </div>

        <div class="picareabtn" id="picareabtn" @click="gopicareaPage">
          <span>more</span>
        </div>
      </div>
      <div class="musicbox">
        <div class="ListenBox" id="listenBtn" @click="gosinerPage">
          特别的人
          <span class="music-note">♪</span>
        </div>
        <div class="musicBox">
          <audio
            ref="audioRef"
            :src="audioSrc"
            loop
            controls
            @timeupdate="onTimeUpdate"
            class="audio"
          ></audio>
          <div class="poemBox" ref="poemBoxRef">
            <ul
              class="poemList"
              ref="poemListRef"
              :style="{ transform: `translateY(${-offset}px)` }"
            >
              <li
                :ref="(el) => setLiRefs(el, index)"
                v-for="(line, index) in lyrics"
                :key="index"
                :class="{ active: index === currentIndex }"
              >
                {{ line.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";
import timer from "@/components/timerCom/timerCom.vue";
import { geci } from "@/assets/lsc/data.js";
import router from "@/router";
const hearts = ref([]);

// 创建爱心动画函数
function createHearts() {
  for (let i = 0; i < 2; i++) {
    const heart = {
      id: Date.now() + i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 2}s`,
      },
    };
    hearts.value.push(heart);
    //5秒s后清除爱心
    setTimeout(() => {
      hearts.value = hearts.value.filter((h) => h.id !== heart.id);
    }, 5000);
  }
}

//控制poem的显示
const poems = [
  {
    title: "嗨喽 TT 又见面啦",
    lines: [
      "如星伴月夜长明，",
      "似水年华同舟行。",
      "岁月静好常相伴，",
      "心灯一盏照温情。",
    ],
  },
  {
    title: "嗨，TT！",
    lines: [
      "遇见你大概是生活给我开的",
      "最靠谱的一次盲盒",
      "打开后发现正是我想要的",
      "现在我要将你收入囊中 嘿嘿",
    ],
  },
  {
    title: "叮！你的忠粉来啦",
    lines: [
      "和你的聊天记录",
      "是我唯一不会左滑删除的对话框",
      "因为每次打开都像",
      "拆开一包快乐薯片 (ฅ´ω`ฅ)",
    ],
  },
];

const currentPoem = ref(null);

function getRandomIndex(excludeIndex) {
  let idx;
  do {
    idx = Math.floor(Math.random() * poems.length);
  } while (idx === excludeIndex && poems.length > 1);
  return idx;
}

//歌词的展示
const rawLyrics = geci;
const audioRef = ref(null);
const audioSrc =
  "https://raw.githubusercontent.com/404WTF-J/TestLink/9cc8a4f85063c6f00317737986c0b390c4c2e8a1/Luckyfile/asseset/video/Special%20someone.mp3";
const poemBoxRef = ref(null);
const poemListRef = ref(null);
const liRefs = ref([]); // 存储每个li元素的引用
// console.log(rawLyrics, "rawLyrics138");

// 解析歌词文本，返回数组 [{times: 秒数, text: 歌词}]
function parseLyrics(rawLyrics) {
  const lines = rawLyrics.split("\n");
  const result = [];
  for (const line of lines) {
    const parts = line.split("]");
    if (parts.length < 2) continue;
    const timeStr = parts[0].substring(1);
    const text = parts[1].trim();
    const times = parseTime(timeStr);
    result.push({ times, text });
  }
  return result;
}

// 时间字符串转秒数，支持 mm:ss.xx 格式
function parseTime(timeStr) {
  const [min, sec] = timeStr.split(":");
  return parseInt(min) * 60 + parseFloat(sec);
}

const lyrics = reactive(parseLyrics(rawLyrics));
const currentIndex = ref(0);
const offset = ref(0);

function onTimeUpdate() {
  if (!audioRef.value) return;
  const currentTime = audioRef.value.currentTime;

  // 找到当前歌词索引
  let i = 0;
  for (; i < lyrics.length; i++) {
    if (currentTime < lyrics[i].times) {
      i = i - 1;
      break;
    }
  }
  if (i < 0) i = 0;
  if (i >= lyrics.length) i = lyrics.length - 1;
  currentIndex.value = i;

  // 计算滚动偏移
  nextTick(() => {
    if (!poemBoxRef.value || !poemListRef.value) return;
    const poemBoxHeight = poemBoxRef.value.clientHeight;
    const liHeight = liRefs.value[0]?.clientHeight || 0;
    const maxOffset = poemListRef.value.scrollHeight - poemBoxHeight;
    // console.log(
    //   liHeight,
    //   "liHeight",
    //   poemBoxHeight,
    //   "poemBoxHeight",
    //   maxOffset,
    //   "maxOffset",
    //   "879"
    // );
    let newOffset = liHeight * i - poemBoxHeight / 2 + liHeight / 2;
    if (newOffset < 0) newOffset = 0;
    if (newOffset > maxOffset) newOffset = maxOffset;

    offset.value = newOffset;
  });
}

// 用于收集li元素的引用
function setLiRefs(el) {
  if (el) liRefs.value.push(el);
}

//跳转到歌曲页
const gosinerPage = () => {
  audioRef.value.pause();
  router.push("/Spmusic");
};

// 跳转到pic页
const gopicareaPage = () => {
  audioRef.value.pause();
  router.push("/Picarea");
};

onMounted(() => {
  // 生命周期钩子
  setInterval(createHearts, 300);
  // 读取上次显示的索引
  const lastIndex = sessionStorage.getItem("lastPoemIndex");
  const lastIdxNum = lastIndex !== null ? parseInt(lastIndex) : -1;

  // 随机选一个不等于上次的索引
  const newIndex = getRandomIndex(lastIdxNum);

  // 设置当前诗歌
  currentPoem.value = poems[newIndex];

  // 记录当前索引到 sessionStorage
  sessionStorage.setItem("lastPoemIndex", newIndex);

  // 组件挂载后清空liRefs，防止重复
  liRefs.value = [];
});
onUnmounted(() => {
  // 生命周期钩子
  clearInterval(createHearts);
});
</script>

<style>
.maincontentbox {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to right, #dbe6f6, #c5796d);
}

.mainContent {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hearts {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.heart {
  position: absolute;
  color: #f28585;
  animation: heartFall 2s linear infinite;
  opacity: 0.7;
}

@keyframes heartFall {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(100vh);
  }
}

.poembox {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poem1,
.poem2,
.poem3 {
  color: #fff;
  font-size: 1.2em;
  text-align: center;
  line-height: 1.8;
  max-width: 600px;
  padding: 0 20px;
}

.poem1,
.poem2,
.poem3 p {
  animation: fadeIn 1s ease-in-out forwards;
  opacity: 0;
}
.poem1,
.poem2,
.poem3 p:nth-child(1) {
  animation-delay: 0.3s;
}
.poem1,
.poem2,
.poem3 p:nth-child(2) {
  animation-delay: 0.6s;
}
.poem1,
.poem2,
.poem3 p:nth-child(3) {
  animation-delay: 0.9s;
}
.poem1,
.poem2,
.poem3 p:nth-child(4) {
  animation-delay: 1.2s;
}
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 收听按钮 */
.ListenBox {
  position: absolute;
  text-align: center;
  right: 15px;
  top: 20px;
  opacity: 0.5;
  font-style: italic;
  display: none;
  border-radius: 15px;
  border: 1px solid #766a6a;
  font-size: 14px;
  padding: 2px;
  color: #3d2d1b;
  background-color: rgb(247, 230, 209);
}

.musicBox {
  position: absolute;
  text-align: center;
  right: 20px;
  top: 20px;
  opacity: 0.5;
  /* background-color: #0a0a0a; */
}

.picareabtn {
  width: 90px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  background-color: #fff;
  color: #bba7b1;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 40px;
  text-align: center;
}

@media (min-width: 768px) {
  .ListenBox {
    display: none;
  }
  .musicBox {
    display: block;
  }
}

@media (max-width: 768px) {
  .ListenBox {
    display: block;
  }
  .musicBox {
    display: none;
  }
}

.musicBox {
  position: absolute;
  text-align: center;
  right: 20px;
  top: 20px;
  opacity: 0.5;
  /* background-color: #0a0a0a; */
}

/* 滚动歌词样式 */
.poemBox {
  width: 340px;
  height: 330px;
  /* border: 1px solid #b73838; */
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
.poemList {
  overflow: hidden;
  transition: all 1s ease-in-out;
  font-size: 16px;
}
.poemList li {
  /* font-size: large 会导致重新reflow布局  */
  transform: scale(1.2);
  color: #8d8a8a;
  height: 37px;
  line-height: 37px;
  transition: 1s;
}
.poemList li.active {
  color: #fff;
  transform: scale(1.4);
}
</style>
