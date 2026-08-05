import axios from "axios";

const GITHUB_TOKEN = process.env.VUE_APP_GITHUB_TOKEN;
const OWNER = process.env.VUE_APP_GITHUB_OWNER;
const REPO = process.env.VUE_APP_GITHUB_REPO;
const BRANCH = process.env.VUE_APP_GITHUB_BRANCH || "main";

/**
 * 上传图片到 GitHub
 * @param {File | string} fileOrBase64 - 浏览器 File 对象或 base64 字符串
 * @param {string} targetPath - GitHub 仓库路径，比如 "images/xxx.png"
 * @returns {string} 图片的 GitHub raw 地址
 */

export async function uploadImageToGitHub(fileOrBase64, targetPath) {
  const url = `/github-api/repos/${OWNER}/${REPO}/contents/Togetherdo/${targetPath}`;
  console.log("【上传-1】开始，url:", url);

  if (!GITHUB_TOKEN || !OWNER || !REPO) {
    throw new Error("请先配置 GitHub 相关环境变量");
  }

  let base64Content;
  if (typeof fileOrBase64 === "string") {
    base64Content = fileOrBase64.split(",")[1] || fileOrBase64;
  } else {
    base64Content = await blobToBase64(fileOrBase64);
    base64Content = base64Content.split(",")[1];
  }
  console.log("【上传-2】base64转换完成，长度:", base64Content.length);

  const putData = {
    message: `Update image ${targetPath}`,
    content: base64Content,
    branch: BRANCH,
  };

  try {
    // 【改造-核心】不管是新增还是更新，一律先直接尝试PUT，不做GET探测
    console.log("【上传-3】直接尝试PUT（不带sha）");
    const putRes = await axios.put(url, putData, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      timeout: 30000, // 【改造-新增】加超时保护
    });
    console.log("【上传-4】PUT直接成功", putRes.status);
  } catch (error) {
    // 【改造-核心】只有明确遇到422(文件已存在冲突)时，才补一次GET拿sha再重试PUT
    if (error.response && error.response.status === 422) {
      console.log("【上传-3-fallback】文件已存在，补GET拿sha");
      const getRes = await axios.get(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        params: { ref: BRANCH },
        timeout: 30000, // 【改造-新增】GET也加超时保护，避免再次卡死无限等待
      });
      const sha = getRes.data.sha;
      console.log("【上传-4-fallback】GET成功拿到sha:", sha);

      const putRes2 = await axios.put(
        url,
        { ...putData, sha },
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          timeout: 30000,
        }
      );
      console.log("【上传-5-fallback】带sha的PUT成功", putRes2.status);
    } else {
      console.error(
        "【上传失败】非422错误，直接抛出",
        error.response?.status || error.message
      );
      throw error;
    }
  }
  // const putRes = await axios.put(url, putData, {
  //   headers: {
  //     Authorization: `token ${GITHUB_TOKEN}`,
  //     Accept: "application/vnd.github.v3+json",
  //   },
  // });
  // console.log("剩余额度:", putRes.headers["x-ratelimit-remaining"]);
  // console.log("额度上限:", putRes.headers["x-ratelimit-limit"]);

  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/Togetherdo/${targetPath}`;
}

// export async function uploadImageToGitHub(fileOrBase64, targetPath) {
//   const url = `/github-api/repos/${OWNER}/${REPO}/contents/Togetherdo/${targetPath}`;
//   if (!GITHUB_TOKEN || !OWNER || !REPO) {
//     throw new Error("请先配置 GitHub 相关环境变量");
//   }

//   let base64Content;
//   if (typeof fileOrBase64 === "string") {
//     base64Content = fileOrBase64.split(",")[1] || fileOrBase64;
//   } else {
//     base64Content = await blobToBase64(fileOrBase64);
//     base64Content = base64Content.split(",")[1];
//   }

//   const putData = {
//     message: `Add image ${targetPath}`,
//     content: base64Content,
//     branch: BRANCH,
//   };

//   try {
//     // 【改造】第一次尝试：不带 sha 直接 PUT（节省请求次数的原逻辑保留）
//     await axios.put(url, putData, {
//       headers: {
//         Authorization: `token ${GITHUB_TOKEN}`,
//         Accept: "application/vnd.github.v3+json",
//       },
//     });
//   } catch (error) {
//     // 【改造-新增】核心修复：捕获到 422 时，说明文件已存在，
//     // 自动补一次 GET 拿 sha，再重新 PUT 一次（真正需要用到 GET 的场景才发起，
//     // 平时新文件走一次PUT就够，只有撞车了才多消耗1次GET请求，性价比很高）
//     if (error.response && error.response.status === 422) {
//       const getRes = await axios.get(url, {
//         headers: {
//           Authorization: `token ${GITHUB_TOKEN}`,
//           Accept: "application/vnd.github.v3+json",
//         },
//         params: { ref: BRANCH },
//       });
//       const sha = getRes.data.sha;

//       await axios.put(
//         url,
//         { ...putData, message: `Update image ${targetPath}`, sha },
//         {
//           headers: {
//             Authorization: `token ${GITHUB_TOKEN}`,
//             Accept: "application/vnd.github.v3+json",
//           },
//         }
//       );
//     } else {
//       throw error; // 其他类型错误照常抛出，交给上层 catch 处理
//     }
//   }

//   const putRes = await axios.put(url, putData, {
//     headers: {
//       Authorization: `token ${GITHUB_TOKEN}`,
//       Accept: "application/vnd.github.v3+json",
//     },
//   });
//   console.log("剩余额度:", putRes.headers["x-ratelimit-remaining"]);
//   console.log("额度上限:", putRes.headers["x-ratelimit-limit"]);
//   return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/Togetherdo/${targetPath}`;
// }

// 工具函数：Blob/File 转 base64
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}
