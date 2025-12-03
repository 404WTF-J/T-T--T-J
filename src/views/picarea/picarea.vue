<template>
  <div
    class="pictureArea"
    id="pictureArea"
    data-barba="container"
    data-barba-namespace="gallery"
  >
    <div class="pichenxin" id="pichenxin" @click="router.push('/mainContent')">
      <span
        v-for="(char, index) in '我要离开'"
        :key="index"
        class="skewed-char"
      >
        {{ char }}
      </span>
    </div>
    <div class="pictitle">
      <h2 id="pictitle">{{ pictitle ? pictitle : "起个标题吧" }}</h2>
    </div>
    <div class="photo-grid" id="photoGrid">
      <div class="swiperbox" ref="swiperbox">
        <ul class="swiper-items" ref="swiperItems">
          <li
            v-for="(item, index) in images"
            :key="index"
            class="swiper-list"
            ref="swiperList"
          >
            <!-- 添加第三方库图片懒加载<img :src="item.url" class="swiper-img" ref="swiperImg" /> -->
            <img v-lazy="item.url" class="swiper-img" ref="swiperImg" />
          </li>
        </ul>
      </div>

      <!-- 图片展示区域 -->
      <div
        class="photo-show"
        v-for="(item, index) in images"
        :key="index"
        :data-index="index"
      >
        <div
          class="image-wrapper"
          ref="imageWrappers"
          @click="on_ImgDetail(item.url, item.desc, index, $event)"
        >
          <!-- 添加第三方库图片懒加载<img :src="item.url" :alt="item.title" /> -->
          <img v-lazy="item.url" :alt="item.title" />
        </div>
      </div>
    </div>
  </div>

  <Imgdetail
    class="imgdetailBox"
    :class="{ show: isShow }"
    :style="{
      top: clickedImagePosition ? clickedImagePosition.top + 'px' : '0',
      left: clickedImagePosition ? clickedImagePosition.left + 'px' : '0',
    }"
    v-if="isShow"
    :imgStr="imgStr"
    :descStr="descStr"
  />
</template>

<script setup>
import {
  ref,
  reactive,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Imgdetail from "./component/imgdetail/imgdetail.vue";

const router = useRouter();
const pictitle = ref("Storys");
const isShow = ref(false);
const clickedImagePosition = ref(null);
const imageWrappers = ref([]);
const imgStr = ref("");
const descStr = ref("");
//轮播数据
const swiperbox = ref(null);
const swiperItems = ref(null);
const swiperList = ref(null);
const swiperImg = ref(null);
let currentIndex = ref(0);
let timer = null;
let timer1 = null;

const images = ref([
  {
    url: "https://picsum.photos/seed/img1/800/600",
    title: "图片1",
    desc: "描述1",
  },
  {
    url: "https://picsum.photos/seed/img2/800/600",
    title: "图片2",
    desc: "描述2",
  },
  {
    url: "https://picsum.photos/seed/img3/800/600",
    title: "图片3",
    desc: "描述3",
  },
  {
    url: "https://picsum.photos/seed/img4/800/600",
    title: "图片4",
    desc: "描述4",
  },
  {
    url: "https://picsum.photos/seed/img5/800/600",
    title: "图片5",
    desc: "描述5",
  },
  {
    url: "https://picsum.photos/seed/img6/800/600",
    title: "图片6",
    desc: "描述6",
  },
  {
    url: "https://picsum.photos/seed/img7/800/600",
    title: "图片7",
    desc: "描述7",
  },
  {
    url: "https://raw.githubusercontent.com/404WTF-J/TestLink/9cc8a4f85063c6f00317737986c0b390c4c2e8a1/Luckyfile/asseset/img/R.jpg",
    title: "图片8",
    desc: "描述8",
  },
]);

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

onMounted(async () => {
  // 等待 DOM 更新完成
  await nextTick();

  // 初始化页面动画
  initAnimations();

  // 初始化滚动触发动画
  initScrollAnimations();

  // 初始化鼠标移动视差效果
  initParallaxEffect();

  document.addEventListener("click", handleClickOutside);

  moveFn(currentIndex.value);
});

// 初始化基础动画
const initAnimations = () => {
  // 标题动画
  gsap.from("#pictitle", {
    duration: 1.5,
    y: -50,
    opacity: 0,
    ease: "power3.out",
  });

  // 图片初始动画
  gsap.from(".photo-show", {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out",
  });

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

// 初始化滚动触发动画
const initScrollAnimations = () => {
  // 图片进入视口时的动画
  gsap.utils.toArray(".photo-show").forEach((photo, index) => {
    gsap.from(photo.querySelector(".image-wrapper"), {
      scrollTrigger: {
        trigger: photo,
        start: "top 90%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
      duration: 0.5,
      scale: 0.8,
      opacity: 1,
      rotation: 5,
      ease: "power3.out",
    });

    // 图片悬停效果
    photo.addEventListener("mouseenter", () => {
      gsap.to(photo.querySelector(".image-wrapper"), {
        scale: 1.05,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    photo.addEventListener("mouseleave", () => {
      gsap.to(photo.querySelector(".image-wrapper"), {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  });
};

// 初始化视差效果
const initParallaxEffect = () => {
  // 鼠标移动视差效果
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    gsap.to(".photo-show", {
      duration: 1,
      x: (x - 0.5) * 10,
      y: (y - 0.5) * 10,
      stagger: 0.05,
      ease: "power2.out",
    });
  });

  // 背景视差效果
  gsap.to(".pictureArea", {
    duration: 20,
    backgroundPosition: "100% 100%",
    ease: "none",
    repeat: -1,
    yoyo: true,
  });
};

// 点击图片跳转到详情页
const on_ImgDetail = async (url, desc, index, event) => {
  // console.log(event, "事件llll");
  // console.log(url, desc, "图片详情+描述");
  imgStr.value = url;
  descStr.value = desc;
  isShow.value = true;
  // 获取视口滚动距离
  // 获取视口滚动距离
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const clickedImage = event.currentTarget.getBoundingClientRect();
  clickedImagePosition.value = {
    top: (clickedImage.top + scrollTop).toFixed(2),
    left: (clickedImage.left + scrollLeft).toFixed(2),
    width: clickedImage.width,
    height: clickedImage.height,
  };
  await nextTick(); // 等待 DOM 更新完成
  // 获取图片详情弹窗的位置
  const popup = document.querySelector(".imgdetailBox");
  // console.log(popup, "弹窗");
  if (popup) {
    const popupRect = popup.getBoundingClientRect();
    // console.log(popupRect, "弹窗位置11");
    const viewportHeight = window.innerHeight;
    // 计算弹窗底部距离视口顶部的距离
    const popupBottom = popupRect.top + popupRect.height;
    // 如果弹窗底部超出视口高度，则调整弹窗位置
    if (popupBottom > viewportHeight) {
      // 计算需要偏移的距离
      const offset = popupBottom - viewportHeight + 150;
      // 调整弹窗位置 重新设置top 想上的offset
      clickedImagePosition.value.top -= offset;
    }
  }
  event.stopPropagation();
  // console.log(clickedImagePosition, "图片位置");
};

// 点击其他地方关闭弹窗
const handleClickOutside = (event) => {
  if (isShow.value && !event.target.closest(".imgdetailBox")) {
    isShow.value = false;
  }
};

// 轮播
const moveFn = (currentIndex) => {
  clearInterval(timer);
  console.log(swiperImg.value.length, swiperItems.value, "轮播");
  timer = setInterval(() => {
    currentIndex++;
    if (currentIndex >= swiperImg.value.length) {
      currentIndex = 0;
    }
    swiperItems.value.style.transition = "all 0.5s";
    swiperItems.value.style.transform = `translateX(-${
      currentIndex * (100 / swiperImg.value.length)
    }%)`;
  }, 4000);
};

onBeforeUnmount(() => {
  clearInterval(timer);
  // 移除事件监听器
  document.removeEventListener("mousemove", initParallaxEffect);
  document.removeEventListener("click", handleClickOutside);
  // 清理 ScrollTrigger 实例
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
</script>

<style scoped>
/* 图片区 */
.pictureArea {
  width: 100%;
  height: 100%;
  background: url("https://picsum.photos/seed/picarea/800/600") no-repeat center center;
  /* background: linear-gradient(to right, #84c8f5, #6dd5fa, #dbf9fb); */
  background-size: 150% 150%;
  position: fixed;
  overflow-y: auto;
  overflow-x: hidden;
  perspective: 600px;
  box-sizing: border-box;
}

.pichenxin {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 100px;
  opacity: 0.3;
  transition: all 0.5s;
  cursor: pointer;
  color: #fbfafa;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.pichenxin:hover {
  opacity: 0.7;
  transform: scale(1.1);
}

.pictitle {
  height: 40px;
  margin: 10px auto;
  text-align: center;
  z-index: 5;
}

.pictitle h2 {
  font-size: 2.5rem;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin: 0;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  display: inline-block;
}

.photo-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  height: auto;
  /* position: relative; */
  /* min-height: 100vh; */
  /* background: #6dd5fa; */
}

.photo-show {
  width: 90%;
  max-width: 400px;
  height: 200px;
  margin: 0 auto;
  /* position: relative; */
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.photo-show img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pictitle h2 {
    font-size: 1.8rem;
  }

  .photo-show {
    width: 100%;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .pictitle h2 {
    font-size: 1.5rem;
    padding: 8px 15px;
  }

  .photo-show {
    width: 100%;
    height: 200px;
  }
}

.imgdetailBox {
  position: absolute; /* 改为absolute定位 */
  transform-origin: center center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 999;
  opacity: 0; /* 初始透明 */
  transform: scale(0.8); /* 初始缩小 */
  transition: all 0.3s ease-out;
}

.imgdetailBox.show {
  opacity: 1;
  transform: scale(1);
}
/* 轮播 */
.swiperbox {
  /* width: 340px; */
  position: relative;
  overflow: hidden;
  /* margin: 0 auto; */
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.swiper-items {
  width: calc(100% * 8);
  display: flex;
  overflow: hidden;
  margin-bottom: 0;
}
.swiper-list {
  width: calc(100% / 8);
  height: 200px;
  /* overflow: hidden; */
  list-style: none;
  flex-shrink: 0;
}
.swiper-img {
  width: 100%;
  height: 100%;
  /* transition: transform 0.5s ease; */
}
</style>
