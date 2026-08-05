<!-- eslint-disable -->
<template>
  <div class="bigbox">
    <!-- backbtn -->
    <div class="back-btn" @click="goBack">
      <span
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
    <!-- headerbg -->
    <div class="headbgbox">
      <div class="headimgbox">
        <img class="headimg" src="@/assets/todoAssets/banner.jpeg" alt="" />
      </div>
      <!-- 标题与进度 -->
      <div class="title-area">
        <h3 class="banneertitle">恋爱清单</h3>
        <div class="competebox">
          <span class="progress"
            >已完成 {{ state.completedCount }} / {{ state.totalCount }}</span
          >
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="todocontent">
      <!-- 头部按钮 -->
      <div class="contenthead">
        <div class="contentLeft">
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="all">
                  <UserOutlined />
                  全部
                </a-menu-item>
                <a-menu-item key="completed">
                  <UserOutlined />
                  已完成
                </a-menu-item>
                <a-menu-item key="notCompleted">
                  <UserOutlined />
                  未完成
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              {{ state.shaixuanText != "全部" ? state.shaixuanText : "全部" }}
              <DownOutlined />
            </a-button>
          </a-dropdown>
        </div>
        <div class="contentRight">
          <a-button type="primary" @click="showAddModal = true"
            >再添一条</a-button
          >
        </div>
      </div>
      <!-- 添加任务弹窗 -->
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <h3>添加新故事</h3>
          <input
            v-model="newTask.title"
            type="text"
            placeholder="请输入想法标题"
            class="input-title"
          />
          <div class="upload-area" @click="triggerFileInput">
            <div v-if="!newTask.imgPreview" class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <span class="upload-text">点这上传图片奥</span>
            </div>
            <img
              v-else
              :src="newTask.imgPreview"
              alt="预览图片"
              class="upload-preview"
            />
          </div>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleNewTaskImage"
          />
          <div class="isProcessingBox">
            <a-radio-group v-model:value="state.isRadioProcessing">
              <a-radio :value="true">已完成</a-radio>
              <a-radio :value="false">未完成</a-radio>
            </a-radio-group>
          </div>
          <div class="modal-buttons">
            <button @click="addTask" :disabled="isSubmitting">
              {{ isSubmitting ? "提交中..." : "提交" }}
            </button>
            <button @click="closeModal">取消</button>
          </div>
        </div>
      </div>
      <!-- 内容列表以及点击旋转效果 -->
      <div class="contentList">
        <div class="loadingbox">
          <a-spin tip="Loading..." :spinning="state.loading" />
        </div>
        <ul class="ListUl" v-if="filteredItems.length > 0">
          <li
            v-for="item in filteredItems"
            :key="item.id"
            class="ListLi"
            :class="{ flipped: flippedIndex === item.id }"
            @click="flipCard(item, item.id)"
          >
            <div class="card-inner">
              <div class="card-front">
                <div class="ListImg-box">
                  <img :src="item.img" alt="" class="Listimg" />
                </div>
                <div class="List-title">
                  <span>{{ item.title }}</span>
                </div>
              </div>
              <div class="card-back">
                <CloseOutlined class="card-back-close" v-if="item.completed" />
                <div
                  class="status"
                  :class="item.completed ? 'completed' : 'not-completed'"
                >
                  {{ item.completed ? "完成" : "未完成" }}
                </div>
                <div
                  class="image-area"
                  @click.stop="!item.completed && openFileDialog(item.id)"
                >
                  <img
                    v-if="item.imgDetail"
                    :src="item.imgDetail"
                    alt="详情图片"
                    class="detail-img"
                  />
                  <div v-else-if="!item.completed" class="add-icon">＋</div>
                </div>
                <span v-if="item.completed" class="createTime">
                  {{ formatToLocalTime(item.created_at) }}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  :ref="(el) => setFileInputRef(el, item.id)"
                  style="display: none"
                  @change="handleFileChange($event, item.id)"
                />
                <div class="bottom-btn" v-if="!item.completed">
                  <div class="bottom-btn-box">
                    <a-button @click.stop="startProcessing(item.id)"
                      >完成</a-button
                    >
                    <a-button @click.stop="cancle(item.id)">取消</a-button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div
          class="notingList"
          v-if="filteredItems.length === 0 && !state.loading"
        >
          此页没有数据
        </div>
      </div>
    </div>
    <!-- 【改造-新增】分页组件 -->
    <div class="pagination-box">
      <a-pagination
        v-model:current="state.current"
        :responsive="true"
        :total="100"
        :page-size="state.pageSize"
        @change="handlePageChange"
        show-less-items
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { message } from "ant-design-vue";
import { DownOutlined, CloseOutlined } from "@ant-design/icons-vue";
import { useRouter } from "vue-router";
import {
  getMustDolist,
  addMustDoItem,
  updateMustDoItem,
  getMustDoCompeleteNum,
} from "@/utils/CloudStore.js";
import { compressImage } from "@/utils/Compressimg.js";
import { uploadImageToGitHub } from "@/utils/GithubImgRaw/index.js";
const router = useRouter();

onMounted(async () => {
  await fetchList();
  await fetchComplelteNum();
});

// 组件内部状态
const state = reactive({
  shaixuanText: "全部",
  isRadioProcessing: false,
  completedCount: 0,
  loading: true,
  totalCount: 0,
  pageSize: 12,
  current: 1,
});

// 单独拉取完成任务总数量
const fetchComplelteNum = async () => {
  const { total, completedCount } = await getMustDoCompeleteNum();
  state.totalCount = total;
  state.completedCount = completedCount;
};

// 统一的拉取数据方法，页码/筛选变化都调这个
const fetchList = async () => {
  state.loading = true;
  try {
    // 【改造】getMustDolist 需要支持传入 page、pageSize、status 参数
    // 并返回 { data, total } 结构（详见下方接口层改造说明）
    const { data, total } = await getMustDolist({
      page: state.current,
      pageSize: state.pageSize,
      status: filterStatus.value, // "all" | "completed" | "notCompleted"
    });
    items.splice(0, items.length, ...data);
    state.total = total;
  } catch (error) {
    console.error("加载清单列表失败:", error);
  } finally {
    state.loading = false;
  }
};

// 筛选条件字段
const filterStatus = ref("all");

// 存放数据变量
const items = reactive([]);

// 处理市区时间
function formatToLocalTime(utcTimeStr) {
  if (!utcTimeStr) return "";
  const date = new Date(utcTimeStr);

  const year = date.getFullYear();
  // 月份是从0开始的，所以要+1，并用 padStart 补零
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // 返回你想要的格式
  return `${year}-${month}-${day} ${hours}:${minutes}`;
  // 如果需要秒: return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 筛选显示对应已/未完成任务逻辑
const filteredItems = computed(() => {
  if (filterStatus.value === "completed") {
    return items.filter((item) => item.completed === true);
  } else if (filterStatus.value === "notCompleted") {
    return items.filter((item) => item.completed === false);
  } else {
    return items;
  }
});

// 筛选切换逻辑
const handleMenuClick = ({ key }) => {
  if (key === "completed") {
    state.shaixuanText = "已完成";
    filterStatus.value = "completed";
  } else if (key === "notCompleted") {
    state.shaixuanText = "未完成";
    filterStatus.value = "notCompleted";
  } else {
    state.shaixuanText = "全部";
    filterStatus.value = "all";
  }
  state.current = 1;
  fetchList();
};

// 添加任务逻辑
const showAddModal = ref(false);

const newTask = reactive({
  title: "",
  imgFile: null,
  imgPreview: null,
});

const closeModal = () => {
  showAddModal.value = false;
  resetNewTask();
};

// 重置文件状态
const resetNewTask = () => {
  newTask.title = "";
  newTask.imgFile = null;
  newTask.imgPreview = null;
  newTask.isProcessing = false;
};

const fileInput = ref(null);

// 文件输入框引用
const triggerFileInput = () => {
  fileInput.value.click(); // 触发隐藏的文件选择框
};

// 添加任务时，支持上传图片
const handleNewTaskImage = (event) => {
  const file = event.target.files[0];
  if (!file) {
    newTask.imgFile = null;
    newTask.imgPreview = null;
    return;
  }
  newTask.imgFile = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    newTask.imgPreview = e.target.result; // 显示图片预览
  };
  reader.readAsDataURL(file);
};

// 弹窗添加任务
const isSubmitting = ref(false); // 【新增】防止重复提交
const addTask = async () => {
  if (isSubmitting.value) {
    console.log("正在提交中，忽略重复点击"); // 帮你确认是否真的重复点击了
    return;
  }
  isSubmitting.value = true;

  if (!newTask.title.trim()) {
    message.warning("任务标题不能为空");
    isSubmitting.value = false;
    return;
  }
  if (items.filter((item) => item.title === newTask.title).length >= 1) {
    message.error("已经有此任务了奥");
    isSubmitting.value = false;
    return;
  }

  try {
    console.log("【1】开始执行 addTask"); // 打点1
    let compressBase = null;
    let uploadUrl = null;
    let targetPath = null;

    if (newTask.imgFile) {
      const compressedFile = await compressImage(newTask.imgFile);
      console.log("【2】压缩完成", compressedFile);

      const safeFileName = encodeURIComponent(
        newTask.title.trim().replace(/\s+/g, "_")
      );
      if (compressedFile.type == "image/jpeg") {
        targetPath = `Image/${safeFileName}.jpeg`;
      } else if (compressedFile.type == "image/png") {
        targetPath = `Image/${safeFileName}.png`;
      } else if (compressedFile.type == "image/webp") {
        targetPath = `Image/${safeFileName}.webp`;
      } else {
        message.error("图片格式不对");
        isSubmitting.value = false;
        return;
      }

      console.log("【3】准备上传到github, targetPath:", targetPath);
      uploadUrl = await uploadImageToGitHub(compressedFile, targetPath);
      console.log("【4】上传github完成, uploadUrl:", uploadUrl); // 关键打点
    } else if (newTask.imgPreview) {
      compressBase = newTask.imgPreview;
    } else {
      compressBase = require("@/assets/todoAssets/OIP.webp");
    }

    console.log("【5】准备调用 addMustDoItem");
    const addedTask = await addMustDoItem(
      newTask.title.trim(),
      uploadUrl,
      uploadUrl,
      state.isRadioProcessing,
      false
    );
    console.log("【6】addMustDoItem 返回结果:", addedTask); // 关键打点

    if (addedTask) {
      items.push({
        id: addTask.id,
        title: newTask.title.trim(),
        img: uploadUrl || compressBase,
        completed: state.isRadioProcessing,
        imgDetail: uploadUrl,
        isProcessing: false,
      });
      console.log("【7】items.push 完成，准备关闭弹窗");
      closeModal();
      fetchComplelteNum();
    } else {
      console.log("【7】addedTask 是假值，未执行 push 和关闭弹窗");
    }
  } catch (error) {
    console.error("【错误】addTask 失败详情:", error);
    console.error("error.response:", error.response);
    console.error("error.message:", error.message);

    if (error.response) {
      const status = error.response.status;
      if (status === 401) message.error("GitHub Token 无效或已过期");
      else if (status === 403) message.error("GitHub Token 权限不足或触发限流");
      else if (status === 404) message.error("请求路径不存在，检查仓库名/路径");
      else if (status === 500) message.error("GitHub 服务端异常，稍后重试");
      else message.error(`请求失败，状态码: ${status}`);
    } else {
      message.error(`请求异常: ${error.message || "未知错误"}`);
    }
  } finally {
    isSubmitting.value = false; // 【新增】不管成功失败，都解除提交锁
  }
};

// 翻转卡片相关逻辑
const flippedIndex = ref(null); // 现在存的是 id，不是下标
const fileInputs = reactive({}); // 改成对象，用 id 做 key，避免 v-for ref 数组错位

const setFileInputRef = (el, id) => {
  if (el) fileInputs[id] = el;
};

// 根据 id 找到原始 items 中的真实数据（引用类型，直接改它就是改 items 里的）
const findItemById = (id) => items.find((item) => item.id === id);

// 卡片翻转逻辑
const flipCard = (itemdate, id) => {
  // console.log(itemdate, "拿到点击的单个数据");
  const item = findItemById(id);
  if (item.isProcessing) return;
  flippedIndex.value = flippedIndex.value === id ? null : id;
};

// 打开文件选择框
const openFileDialog = (id) => {
  fileInputs[id].click();
};

// 用户上传图片后，显示图片预览
const uploadingIds = reactive(new Set()); //记录当前上传项目id的集合
const handleFileChange = async (event, id) => {
  const callId = Date.now(); // 【临时调试】每次调用生成唯一标识
  console.log(`【handleFileChange调用#${callId}】开始, id:`, id); // 打点

  const file = event.target.files[0];
  if (!file) return;

  // 【改造-核心修复】如果这个id已经在上传中了，直接忽略这次触发，防止重复调用
  if (uploadingIds.has(id)) {
    console.log("已有上传任务在进行中，忽略重复触发");
    event.target.value = ""; // 清空，避免残留状态影响下次选择
    return;
  }
  uploadingIds.add(id); // 【改造-新增】加锁

  const item = findItemById(id);
  const originalIsProcessing = item.isProcessing; // 记录原始状态，后面用

  try {
    item.isProcessing = true; // 立刻显示加载状态，避免用户上传后卡住
    message.loading({
      content: "图片上传中...",
      duration: 0,
      key: "uploadPic",
    });

    const compressedFile = await compressImage(file);

    // 【改造-新增】用和创建任务时同样的规则，拼出目标路径，
    // 确保覆盖的是同一个文件而不是新建一个
    const safeFileName = encodeURIComponent(
      item.title.trim().replace(/\s+/g, "_")
    );
    let targetPath;
    if (compressedFile.type === "image/jpeg") {
      targetPath = `Image/${safeFileName}.jpeg`;
    } else if (compressedFile.type === "image/png") {
      targetPath = `Image/${safeFileName}.png`;
    } else if (compressedFile.type === "image/webp") {
      targetPath = `Image/${safeFileName}.webp`;
    } else {
      message.error("图片格式不对");
      item.isProcessing = originalIsProcessing;
      return;
    }

    // 【改造-核心】真正上传到GitHub，isUpdate:true 触发"先GET拿sha再覆盖"逻辑
    // (如果原来是模板图、GitHub上没有这个文件，内部会自动识别404并走新增，不会报错)
    const uploadUrl = await uploadImageToGitHub(compressedFile, targetPath);

    // 【改造】用真实上传后的URL替换本地预览，不再用 FileReader 的 base64
    item.imgDetail = uploadUrl;
    item.img = uploadUrl; // 【改造-新增】卡片正面展示图也一并替换成用户真实上传的照片
    item.completed = false; // 保持"待确认完成"状态，等用户点"完成"按钮再真正标记完成

    message.success({ content: "图片上传成功", key: "uploadPic" });
  } catch (error) {
    console.error("压缩图片失败:", error);
    message.error({ content: "图片上传失败，请重试", key: "uploadPic" });
  } finally {
    item.isProcessing = originalIsProcessing;
    uploadingIds.delete(id);
    event.target.value = "";
  }
  console.log(`【handleFileChange调用#${callId}】结束, id:`, id); // 打点
};

// 使任务完成判断
const startProcessing = async (id) => {
  const item = findItemById(id);

  if (item.isProcessing) {
    message.warning("请等待图片上传完成");
    return;
  }

  if (!item.imgDetail) {
    message.error("传图片了吗就点🤨");
    return;
  }

  // 【改造-新增】校验：确保 imgDetail 是真实上传后的 GitHub URL，
  // 而不是本地 base64（防止用户没等上传完成就点了完成按钮，或者上传失败但没提示到）
  if (item.imgDetail.startsWith("data:")) {
    message.error("图片还在处理中，请稍等片刻再点完成");
    return;
  }

  item.isProcessing = true;
  try {
    // 【改造-核心】调用 Supabase 更新接口，持久化保存
    const updated = await updateMustDoItem(item.id, {
      img: item.img,
      imgDetail: item.imgDetail,
      created_at: new Date().toISOString(),
      completed: true,
    });

    if (updated) {
      item.completed = true;
      message.success("完成啦🎉");
      fetchList();
    } else {
      message.error("保存失败，请重试");
    }
  } catch (error) {
    console.error("更新任务状态失败:", error);
    message.error("保存失败，请重试");
  } finally {
    item.isProcessing = false;
  }
};

const cancle = (id) => {
  const item = findItemById(id);
  item.isProcessing = false;
  flippedIndex.value = null;
};

// 返回按钮
const goBack = () => {
  router.back();
};

// 分页按钮触发
const handlePageChange = (page) => {
  state.current = page;
  fetchList();
  fetchComplelteNum();
};
</script>

<style scoped>
.bigbox {
  width: 100%;
  height: 100vh;
  background: radial-gradient(
      72% 58% at 16% 82%,
      #d8c2b1 0%,
      #f5c6c1 22%,
      #ebf6f700 72%
    ),
    radial-gradient(56% 72% at 78% 26%, #bce2e8 0%, #cfe2d8 22%, #bce2e800 72%),
    radial-gradient(
      78% 62% at 69.6% 86.5%,
      #a2d7dd 0%,
      #a2d7dd 22%,
      #a2d7dd00 72%
    ),
    radial-gradient(50% 44% at 24% 16%, #d6bbc6 0%, #cfe2d8 22%, #d6bbc600 72%),
    radial-gradient(130% 120% at 30% 20%, #ebf6f7, #ebf6f7);
}
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 999;
}
.headbgbox {
  width: 100%;
  height: 30%;
  position: relative;
}
.headimgbox {
  width: 100%;
  height: 100%;
}
.headimg {
  width: 100%;
  height: 100%;
}
.title-area {
  position: absolute;
  top: 60px;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.banneertitle {
  color: beige;
}
.competebox {
  text-align: center;
  width: 160px;
  height: 26px;
  line-height: 26px;
  /* 渐变色 */
  background: linear-gradient(
    to right,
    rgba(228, 228, 228, 0.1),
    rgba(246, 242, 242, 0.5),
    rgba(223, 220, 220, 0.1)
  );
}

.progress {
  font-weight: 500;
  font-size: 1.1rem;
}
.todocontent {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.contenthead {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.contentLeft {
  margin-left: 20px;
}
.contentRight {
  margin-right: 20px;
}

/* 添加任务css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-title {
  padding: 8px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.preview-box img {
  width: 100%;
  max-height: 150px;
  object-fit: contain;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-buttons button {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #1890ff;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #f0f0f0;
}

.loadingbox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  border-radius: 4px;
  padding: 30px 50px;
}

.contentList {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  margin-top: 20px;
}

/* 内容列表旋转效果css处理 */
.ListUl {
  width: 100%;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px); /* 卡片宽度100px，自动排列 */
  justify-content: space-around;
  gap: 12px;
  position: relative;
}
.ListLi {
  width: 100px;
  height: 130px;
  background-color: rgb(213, 206, 190);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.ListImg-box {
  width: 80%;
  height: 73%;
  margin: 10px;
}
.Listimg {
  width: 100%;
  height: 100%;
  border-radius: 3px;
}
.List-title {
  margin-bottom: 5px;
}

@media screen and (max-width: 768px) {
  .headbgbox {
    width: 100%;
    height: 30%;
    position: relative;
  }
}

@media screen and (min-width: 1024px) {
  .headbgbox {
    width: 100%;
    height: 45%;
    position: relative;
  }
}

@media (min-height: 667px) {
  .contentList {
    max-height: 375px;
    height: 375px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    margin-top: 20px;
  }
}

@media (min-height: 669px) and (max-height: 844px) {
  .contentList {
    max-height: 485px;
    height: 465px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    margin-top: 20px;
  }
}

@media (min-height: 868px) and (max-height: 1208px) {
  .contentList {
    max-height: 575px;
    height: 575px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;
    margin-top: 20px;
  }
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.ListLi.flipped .card-inner {
  transform: rotateY(180deg) scale(1.3);
  z-index: 10;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  backface-visibility: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-back-close {
  position: absolute;
  top: 1px;
  left: 0px;
  font-size: 14px;
  cursor: pointer;
  color: #999;
}
.card-front {
  background: linear-gradient(45deg, #e6dcda, #cfe5e0);
}

.card-back {
  background-color: #fff;
  transform: rotateY(180deg);
  /* padding: 10px; */
  box-sizing: border-box;
  position: relative;
}

.status {
  position: absolute;
  top: 3px;
  right: 3px;
  padding: 0px 2px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  color: #fff;
  user-select: none;
}

.status.completed {
  background-color: #52c41a; /* 绿色 */
}

.status.not-completed {
  background-color: #f5222d; /* 红色 */
}

.image-area {
  width: 90%;
  height: 75%;
  border: 1px dashed #ccc;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.add-icon {
  font-size: 36px;
  color: rgba(0, 0, 0, 0.3);
  user-select: none;
}

.createTime {
  font-size: 0.65rem;
  font-weight: 200;
  position: absolute;
  bottom: 0;
}

.detail-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 6px;
  object-fit: contain;
}

.bottom-btn {
  margin-top: 10px;
  width: 100%;
  text-align: center;
}

.bottom-btn button {
  width: 50px;
  height: 30px;
  background-color: #1890ff;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7rem;
}

.bottom-btn-box {
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
}

.bottom-btn button:hover {
  background-color: #40a9ff;
}

/* 【改造-新增】分页组件容器样式 */
.pagination-box {
  position: absolute;
  bottom: 3px;
  left: 46%;
  transform: translateX(-43%);
}

/* 添加弹窗样式 */
.upload-area {
  width: 100%;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: background-color 0.3s;
}

.upload-area:hover {
  background-color: #f0f0f0;
}

.upload-placeholder {
  text-align: center;
  color: #aaa;
}

.upload-icon {
  font-size: 36px;
  display: block;
}

.upload-text {
  font-size: 14px;
}

.upload-preview {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  object-fit: contain;
}
</style>
