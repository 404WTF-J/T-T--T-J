<template>
  <div class="Spmusic">
    <div class="musicbigBox" id="musicbigBox">
      <div class="backbtn" id="backBtn" @click="backBtn">下次在听</div>
      <div class="coverimgbox">
        <img
          src="https://raw.githubusercontent.com/404WTF-J/TestLink/9cc8a4f85063c6f00317737986c0b390c4c2e8a1/Luckyfile/asseset/img/R.jpg"
        />
      </div>

      <div class="musiclsctBox">
        <audio
          ref="audioRef"
          :src="audioSrc"
          type="audio/mpeg"
          loop
          controls
          @timeupdate="onTimeUpdate"
          class="audio"
        ></audio>
        <div class="poemBox2" ref="poemBoxRef">
          <ul
            class="poemList2"
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
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { geci } from "@/assets/lsc/data.js";

const router = useRouter();

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

onTimeUpdate();
setTimeout(() => {
  audioRef.value.play();
}, 1000);

// 用于收集li元素的引用
function setLiRefs(el) {
  if (el) liRefs.value.push(el);
}
// 返回按钮
const backBtn = () => {
  //暂停音乐
  audioRef.value.pause();
  // 跳转路由
  router.push("/mainContent");
};

onMounted(() => {
  // 生命周期钩子
  // 组件挂载后清空liRefs，防止重复
  liRefs.value = [];
});
</script>

<style>
/* 单独歌曲页面 */
.musicbigBox {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(200deg, #7a8a99, #000);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.backbtn {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  opacity: 0.3;
  transition: 0.5s;
}

.backbtn:hover {
  opacity: 1;
}

/* 滚动歌词样式 */
.poemBox2 {
  width: 340px;
  height: 400px;
  /* border: 1px solid #b73838; */
  margin: 40px auto;
  overflow: hidden;
  position: relative;
}
.poemList2 {
  overflow: hidden;
  transition: all 1s ease-in-out;
  font-size: 14px;
}
.poemList2 li {
  /* font-size: large 会导致重新reflow布局  */
  transform: scale(1.2);
  color: #8d8a8a;
  height: 38px;
  line-height: 38px;
  transition: 1s;
}
.poemList2 li.active {
  color: #fff;
  transform: scale(1.4);
}

/* 播放器 */
.musicplayer {
  width: 340px;
  height: 440px;
  text-align: center;
  /* border: 1px solid #b73838; */
  margin: 0 auto;
  overflow: hidden;
}

.coverimgbox {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 30px auto;
}

.coverimgbox img {
  width: 100%;
  height: 100%;
}

.musiclsctBox {
  width: 340px;
  height: 440px;
  text-align: center;
  /* border: 1px solid #b73838; */
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}
</style>
