const canvas = document.querySelector("#sky-canvas");
const ctx = canvas.getContext("2d");
const list = document.querySelector("#constellation-list");
const infoBox = document.querySelector("#info-box");
const timeRange = document.querySelector("#time-range");
const lightRange = document.querySelector("#light-range");
const magnitudeRange = document.querySelector("#magnitude-range");
const animateSkyInput = document.querySelector("#animate-sky");
const toggleLinesButton = document.querySelector("#toggle-lines");
const resetButton = document.querySelector("#reset-view");
const trailCanvas = document.querySelector("#trail-canvas");
const atmosphereCanvas = document.querySelector("#atmosphere-canvas");
const polarisCanvas = document.querySelector("#polaris-canvas");
const seasonGuideFeedback = document.querySelector("#season-guide-feedback");
const polarisStepText = document.querySelector("#polaris-step-text");
const polarisPrevButton = document.querySelector("#polaris-prev");
const polarisNextButton = document.querySelector("#polaris-next");
const polarisResetButton = document.querySelector("#polaris-reset");
const polarisAutoButton = document.querySelector("#polaris-auto");

const seasonGuideText = {
  spring: "目前選擇春季：回到星圖可從北斗七星開始，沿斗柄尋找大角星與角宿一。",
  summer: "目前選擇夏季：回到星圖可先找夏季大三角，再用織女星、牛郎星、天津四建立方位感。",
  autumn: "目前選擇秋季：回到星圖可先找飛馬座四邊形，再找仙后座與仙女座。",
  winter: "目前選擇冬季：回到星圖可先找獵戶座腰帶，再延伸到天狼星、畢宿五與金牛座。"
};

const polarisSteps = {
  dipper: [
    "第 1 步：先找到像斗杓的北斗七星。",
    "第 2 步：找斗口外側兩顆星：天璇與天樞。",
    "第 3 步：由天璇往天樞方向延長約 5 倍距離。",
    "第 4 步：延長線附近那顆位置穩定的星，就是北極星。"
  ],
  cassiopeia: [
    "第 1 步：先找到像 W 或 M 的仙后座。",
    "第 2 步：將 W 兩側邊向後延伸，找出兩線的交會點。",
    "第 3 步：把交會點與 W 中間星連成一線，沿中間星方向延長約 5 倍。",
    "第 4 步：延長線附近那顆位置穩定的星，就是北極星。"
  ]
};

const seasons = {
  spring: {
    title: "春季星空",
    intro: "從北斗七星開始，沿著斗柄弧線找到大角星，再延伸到角宿一。時間改變時，整片星空會繞北天極轉動。",
    constellations: [
      {
        id: "ursa-major",
        name: "北斗七星",
        note: "北斗七星是大熊座的一部分。斗口兩顆星可協助尋找北極星，但星座高度會隨時間改變。",
        color: "#f6d36b",
        stars: [
          ["天樞", 38, 34, 1.8, "white"], ["天璇", 44, 31, 2.4, "white"], ["天璣", 52, 34, 2.4, "white"],
          ["天權", 58, 39, 3.3, "white"], ["玉衡", 65, 37, 1.8, "white"], ["開陽", 72, 42, 2.2, "white"], ["搖光", 80, 43, 1.9, "white"]
        ],
        lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]
      },
      {
        id: "bootes",
        name: "牧夫座",
        note: "大角星是春季明亮的橙色星。星色和亮度是辨認亮星的重要線索。",
        color: "#ffb56b",
        stars: [["大角星", 58, 64, 0.0, "orange"], ["牧夫肩", 51, 54, 3.0, "white"], ["牧夫膝", 65, 52, 2.7, "white"], ["牧夫足", 61, 76, 3.5, "white"]],
        lines: [[1,0],[2,0],[0,3]]
      },
      {
        id: "virgo",
        name: "室女座",
        note: "角宿一偏藍白色，是春季大曲線延伸後的重要亮星。低空時會比高空更暗。",
        color: "#a7d8ff",
        stars: [["角宿一", 78, 73, 1.0, "blue"], ["東次將", 69, 67, 2.8, "white"], ["太微右垣", 86, 63, 3.4, "white"], ["左執法", 75, 54, 3.8, "white"]],
        lines: [[1,0],[0,2],[1,3]]
      }
    ]
  },
  summer: {
    title: "夏季星空",
    intro: "先找夏季大三角：織女星、牛郎星與天津四。銀河附近星很多，郊外比市區更容易看見。",
    constellations: [
      {
        id: "lyra",
        name: "天琴座",
        note: "織女星明亮且偏藍白色，是夏季大三角中很好辨認的一角。",
        color: "#b5ddff",
        stars: [["織女星", 42, 28, 0.0, "blue"], ["天琴二", 47, 35, 3.5, "white"], ["天琴三", 39, 38, 4.0, "white"], ["天琴四", 45, 42, 4.2, "white"]],
        lines: [[0,1],[1,3],[3,2],[2,0]]
      },
      {
        id: "aquila",
        name: "天鷹座",
        note: "牛郎星兩側有較暗的伴星。在光害強的地方，伴星會比牛郎星更早消失。",
        color: "#fff3b0",
        stars: [["牛郎星", 60, 61, 0.8, "white"], ["河鼓一", 55, 58, 3.7, "white"], ["河鼓三", 65, 64, 2.7, "white"], ["天鷹尾", 67, 74, 3.4, "white"]],
        lines: [[1,0],[0,2],[2,3]]
      },
      {
        id: "cygnus",
        name: "天鵝座",
        note: "天鵝座像十字形，天津四位在尾端。星座線只是辨認輔助，不是真實連線。",
        color: "#f5f7ff",
        stars: [["天津四", 70, 24, 1.3, "white"], ["胸星", 65, 38, 2.2, "white"], ["喙星", 61, 53, 3.1, "white"], ["左翼", 52, 42, 2.9, "white"], ["右翼", 78, 44, 2.6, "white"]],
        lines: [[0,1],[1,2],[3,1],[1,4]]
      }
    ]
  },
  autumn: {
    title: "秋季星空",
    intro: "秋季可從飛馬座四邊形開始，再延伸到仙后座與仙女座。",
    constellations: [
      {
        id: "pegasus",
        name: "飛馬座",
        note: "飛馬座四邊形像天空中的大方框，是秋季尋星的重要起點。",
        color: "#d7c2ff",
        stars: [["壁宿一", 42, 43, 2.1, "white"], ["室宿一", 60, 40, 2.0, "white"], ["危宿三", 64, 58, 2.8, "white"], ["壁宿二", 45, 62, 2.0, "white"]],
        lines: [[0,1],[1,2],[2,3],[3,0]]
      },
      {
        id: "cassiopeia",
        name: "仙后座",
        note: "仙后座常呈 W 或 M 形。它與北斗七星一樣，會繞北極星附近轉動。",
        color: "#ffc2d1",
        stars: [["王良一", 22, 29, 2.2, "white"], ["王良二", 31, 22, 2.3, "white"], ["王良三", 39, 33, 2.7, "white"], ["王良四", 49, 25, 2.4, "white"], ["王良五", 58, 31, 3.4, "white"]],
        lines: [[0,1],[1,2],[2,3],[3,4]]
      },
      {
        id: "andromeda",
        name: "仙女座",
        note: "仙女座從飛馬座四邊形延伸出去。仙女座星系需要暗夜和適應黑暗的眼睛才容易看見。",
        color: "#a8eadf",
        stars: [["奎宿九", 42, 43, 2.1, "white"], ["奎宿一", 36, 50, 2.1, "white"], ["奎宿二", 29, 56, 2.1, "white"], ["仙女座星系", 24, 49, 4.4, "diffuse"]],
        lines: [[0,1],[1,2],[2,3]]
      }
    ]
  },
  winter: {
    title: "冬季星空",
    intro: "冬季可從獵戶座腰帶開始，連到天狼星、畢宿五與五車二。",
    constellations: [
      {
        id: "orion",
        name: "獵戶座",
        note: "三顆腰帶星排成一直線。參宿四偏紅，參宿七偏藍白，顏色差異是真實觀察線索。",
        color: "#ffd18f",
        stars: [["參宿四", 43, 29, 0.5, "red"], ["參宿五", 58, 30, 1.6, "white"], ["參宿一", 48, 46, 1.7, "blue"], ["參宿二", 53, 48, 1.7, "blue"], ["參宿三", 58, 50, 2.2, "blue"], ["參宿六", 44, 67, 2.1, "white"], ["參宿七", 62, 65, 0.2, "blue"]],
        lines: [[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[5,6]]
      },
      {
        id: "canis-major",
        name: "大犬座",
        note: "天狼星是夜空中最亮的恆星。它若接近地平線，會因大氣擾動而特別閃爍。",
        color: "#bde4ff",
        stars: [["天狼星", 72, 76, -1.4, "blue"], ["軍市一", 78, 66, 1.8, "white"], ["弧矢一", 83, 82, 2.0, "white"], ["大犬尾", 74, 90, 2.4, "white"]],
        lines: [[1,0],[0,2],[0,3]]
      },
      {
        id: "taurus",
        name: "金牛座",
        note: "畢宿五呈橙紅色，昴宿星團是一群肉眼可見的年輕恆星，光害會讓星團細節變少。",
        color: "#ffb09f",
        stars: [["畢宿五", 29, 38, 0.9, "orange"], ["昴宿星團", 18, 24, 1.6, "cluster"], ["金牛角一", 40, 25, 1.7, "white"], ["金牛角二", 45, 45, 3.0, "white"]],
        lines: [[1,0],[0,2],[0,3]]
      }
    ]
  }
};

const quizItems = [
  {
    q: "北半球面向北方觀察一整晚，星星看起來主要會怎麼移動？",
    answers: ["繞北極星附近旋轉", "全部垂直往上升", "完全停在原處"],
    correct: 0,
    why: "這是地球自轉造成的視運動。北極星附近接近北天極，所以星軌會以它附近為中心。"
  },
  {
    q: "光害變強時，哪一類天體最容易先看不見？",
    answers: ["星等數字大的暗星與星團細節", "天狼星這類亮星", "所有星星同時消失"],
    correct: 0,
    why: "光害會抬高天空背景亮度，暗星和模糊天體會先被背景光淹沒。"
  },
  {
    q: "同一顆星接近地平線時，為什麼常看起來較暗、較閃？",
    answers: ["星光穿過更厚的大氣", "星星本身突然變小", "星座線遮住星星"],
    correct: 0,
    why: "低空星光路徑較長，受到散射、吸收與大氣擾動的影響更明顯。"
  },
  {
    q: "想在冬季快速辨認獵戶座，可以先找什麼特徵？",
    answers: ["三顆排成一直線的腰帶星", "W 形的仙后座", "飛馬座四邊形"],
    correct: 0,
    why: "獵戶座腰帶三顆星排列整齊，是冬季尋星的好起點。"
  },
  {
    q: "星座連線在真實天空中代表什麼？",
    answers: ["人類為辨認星空而想像的圖形", "星星之間真的有發光線條", "星星都在同一個距離上"],
    correct: 0,
    why: "星座線是觀察與記憶工具，不代表宇宙中真的有線相連，也不代表距離相近。"
  },
  {
    q: "夏季大三角由哪三顆亮星組成？",
    answers: ["織女星、牛郎星、天津四", "天狼星、參宿四、畢宿五", "大角星、角宿一、北極星"],
    correct: 0,
    why: "夏季大三角由天琴座織女星、天鷹座牛郎星與天鵝座天津四組成。"
  },
  {
    q: "在市區觀星時，為什麼銀河和仙女座星系較難看見？",
    answers: ["天空背景被光害照亮", "它們只會白天出現", "星座線沒有打開"],
    correct: 0,
    why: "銀河和星系屬於較淡、較分散的天體，光害會抬高天空背景亮度，使它們被背景光淹沒。"
  },
  {
    q: "星等數字與看起來的亮度有什麼關係？",
    answers: ["星等數字越小，看起來越亮", "星等數字越大，看起來越亮", "星等數字只代表星星大小"],
    correct: 0,
    why: "天文中的星等數字越小代表越亮，例如天狼星的星等比許多 2 等星、3 等星更小也更亮。"
  },
  {
    q: "為什麼同一個星座在不同季節夜晚不一定都容易看見？",
    answers: ["地球繞太陽公轉，夜晚面向的星空方向改變", "星座每季會真的搬到別的星系", "星星只在某些月份發光"],
    correct: 0,
    why: "地球公轉讓夜晚面向太空的方向隨季節改變，因此不同季節容易看見的代表星座不同。"
  },
  {
    q: "觀察星星顏色時，下列哪一項比較合理？",
    answers: ["參宿四偏紅、天狼星偏藍白", "所有星星肉眼都一定是純白", "星星顏色只由星座線決定"],
    correct: 0,
    why: "亮星常能看出些微顏色差異，這與恆星表面溫度有關；例如參宿四偏紅，天狼星偏藍白。"
  }
];

let state = {
  season: "spring",
  selectedId: null,
  showLines: true,
  light: 1,
  maxMagnitude: 5,
  time: 0,
  skyAnimating: false,
  quizIndex: 0,
  score: 0,
  answered: false,
  showPolaris: false,
  lastTick: 0,
  polarisMethod: "dipper",
  polarisStep: 0
};

let skyAnimationFrame = 0;
let miniAnimationFrame = 0;
let polarisAutoTimer = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(400, Math.round(rect.width * dpr));
  canvas.height = Math.max(320, Math.round(rect.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawSky();
}

function getVisibleLimit() {
  return Math.min(state.maxMagnitude, 6.15 - state.light * 0.9);
}

function getNorthCelestialPole(rect) {
  return {
    x: rect.width * 0.5,
    y: rect.height * 0.18
  };
}

function rotateAround(point, center, radians) {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(radians) - dy * Math.sin(radians),
    y: center.y + dx * Math.sin(radians) + dy * Math.cos(radians)
  };
}

function starToPoint(star) {
  const rect = canvas.getBoundingClientRect();
  const base = {
    x: star[1] / 100 * rect.width,
    y: star[2] / 100 * rect.height
  };
  const center = getNorthCelestialPole(rect);
  const radians = state.time * Math.PI / 12;
  const rotated = rotateAround(base, center, radians);
  return {
    x: rotated.x,
    y: rotated.y,
    name: star[0],
    mag: star[3],
    type: star[4]
  };
}

function getAtmosphericPenalty(point, rect) {
  const altitude = 1 - point.y / rect.height;
  if (altitude < 0.02) return 2.5;
  return Math.max(0, (0.38 - altitude) * 3.1);
}

function getStarColor(type) {
  return {
    blue: "#d7efff",
    red: "#ffc2a4",
    orange: "#ffd08a",
    cluster: "#f9f1cf",
    diffuse: "#d6f6ff",
    white: "#f4f8ff"
  }[type] || "#f4f8ff";
}

function drawSky() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);

  const glow = state.light * 0.055;
  const gradient = ctx.createLinearGradient(0, 0, 0, rect.height);
  gradient.addColorStop(0, `rgb(${7 + state.light * 11}, ${16 + state.light * 12}, ${31 + state.light * 12})`);
  gradient.addColorStop(0.62, `rgb(${21 + state.light * 10}, ${45 + state.light * 11}, ${69 + state.light * 8})`);
  gradient.addColorStop(1, `rgb(${39 + state.light * 14}, ${79 + state.light * 13}, ${91 + state.light * 9})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  drawMilkyWay(rect, glow);
  drawBackgroundStars(rect);
  drawNorthAxis(rect);
  drawConstellations(rect);
  if (state.showPolaris) drawPolaris(rect);
}

function drawMilkyWay(rect, glow) {
  const seasonAllowsMilkyWay = state.season === "summer" || state.season === "autumn";
  if (!seasonAllowsMilkyWay || state.light > 2) return;
  ctx.save();
  ctx.translate(rect.width * 0.57, rect.height * 0.48);
  ctx.rotate(-0.45);
  const band = ctx.createLinearGradient(-rect.width * 0.18, 0, rect.width * 0.18, 0);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, `rgba(220,238,255,${0.12 - glow})`);
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(-rect.width, -rect.height * 0.12, rect.width * 2, rect.height * 0.24);
  ctx.restore();
}

function drawBackgroundStars(rect) {
  const count = Math.round(100 - state.light * 17);
  const center = getNorthCelestialPole(rect);
  ctx.save();
  for (let i = 0; i < count; i++) {
    const base = {
      x: ((i * 67) % 997) / 997 * rect.width,
      y: ((i * 131) % 691) / 691 * rect.height * 0.86 + 12
    };
    const point = rotateAround(base, center, state.time * Math.PI / 12);
    if (point.x < -12 || point.x > rect.width + 12 || point.y < -12 || point.y > rect.height + 12) continue;
    const altitude = 1 - point.y / rect.height;
    const alpha = Math.max(0.08, 0.55 - state.light * 0.09 - Math.max(0, 0.28 - altitude) * 0.7);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 0.65 + (i % 3) * 0.32, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawNorthAxis(rect) {
  const center = getNorthCelestialPole(rect);
  ctx.save();
  ctx.strokeStyle = "rgba(246, 211, 107, .16)";
  ctx.lineWidth = 1;
  [90, 150, 220, 300].forEach(radius => {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0.12, Math.PI * 1.55);
    ctx.stroke();
  });
  ctx.restore();
}

function drawConstellations(rect) {
  const season = seasons[state.season];
  const visibleLimit = getVisibleLimit();
  season.constellations.forEach((constellation) => {
    const selected = state.selectedId === constellation.id;
    const points = constellation.stars.map(starToPoint);

    if (state.showLines) {
      ctx.save();
      ctx.strokeStyle = selected ? constellation.color : "rgba(205, 225, 235, .35)";
      ctx.lineWidth = selected ? 2.6 : 1.2;
      constellation.lines.forEach(([a, b]) => {
        if (isStarVisible(constellation.stars[a], points[a], rect, visibleLimit) && isStarVisible(constellation.stars[b], points[b], rect, visibleLimit)) {
          ctx.beginPath();
          ctx.moveTo(points[a].x, points[a].y);
          ctx.lineTo(points[b].x, points[b].y);
          ctx.stroke();
        }
      });
      ctx.restore();
    }

    points.forEach((point, index) => {
      const star = constellation.stars[index];
      if (!isStarVisible(star, point, rect, visibleLimit)) return;
      drawStar(point, star, constellation.color, selected, rect);
    });
  });
}

function isStarVisible(star, point, rect, visibleLimit) {
  if (point.x < -20 || point.x > rect.width + 20 || point.y < -20 || point.y > rect.height + 16) return false;
  const apparentMag = star[3] + getAtmosphericPenalty(point, rect);
  return apparentMag <= visibleLimit;
}

function drawStar(point, star, constellationColor, selected, rect) {
  const penalty = getAtmosphericPenalty(point, rect);
  const apparentMag = star[3] + penalty;
  const radius = Math.max(1.5, 6.2 - apparentMag);
  const altitude = 1 - point.y / rect.height;
  const twinkle = altitude < 0.38 ? 0.74 + Math.sin(Date.now() / 170 + point.x) * 0.18 : 1;
  const alpha = Math.max(0.35, 1 - state.light * 0.08 - penalty * 0.16) * twinkle;
  const color = getStarColor(star[4]);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = star[4] === "diffuse" ? "#bdeeff" : constellationColor;
  ctx.shadowBlur = selected ? 22 : 10;

  if (star[4] === "cluster" || star[4] === "diffuse") {
    ctx.fillStyle = star[4] === "cluster" ? "rgba(255,244,196,.9)" : "rgba(196,232,255,.46)";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, radius * 2.3, radius * 1.3, -0.35, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (selected || star[3] < 1.1) {
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.font = "700 13px 'Microsoft JhengHei', sans-serif";
    ctx.fillText(star[0], point.x + radius + 5, point.y - radius - 2);
  }
  ctx.restore();
}

function drawPolaris(rect) {
  const center = getNorthCelestialPole(rect);
  ctx.save();
  ctx.strokeStyle = "#f6d36b";
  ctx.fillStyle = "#f6d36b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center.x - 12, center.y);
  ctx.lineTo(center.x + 12, center.y);
  ctx.moveTo(center.x, center.y - 12);
  ctx.lineTo(center.x, center.y + 12);
  ctx.stroke();
  ctx.font = "800 14px 'Microsoft JhengHei', sans-serif";
  ctx.fillText("北極星附近", center.x + 16, center.y + 5);
  ctx.restore();
}

function renderConstellationList() {
  const season = seasons[state.season];
  list.innerHTML = "";
  season.constellations.forEach((constellation) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "constellation-button";
    button.textContent = constellation.name;
    button.dataset.id = constellation.id;
    if (state.selectedId === constellation.id) button.classList.add("is-active");
    button.addEventListener("click", () => selectConstellation(constellation.id));
    list.appendChild(button);
  });
}

function selectConstellation(id) {
  const constellation = seasons[state.season].constellations.find(item => item.id === id);
  state.selectedId = id;
  infoBox.innerHTML = `<h2>${constellation.name}</h2><p>${constellation.note}</p>`;
  renderConstellationList();
  drawSky();
}

function setSeason(seasonId) {
  state.season = seasonId;
  state.selectedId = seasons[seasonId].constellations[0].id;
  state.showPolaris = false;
  document.querySelectorAll(".season-btn").forEach(button => {
    button.classList.toggle("is-active", button.dataset.season === seasonId);
  });
  const season = seasons[seasonId];
  infoBox.innerHTML = `<h2>${season.title}</h2><p>${season.intro}</p>`;
  renderConstellationList();
  updateSeasonGuide(seasonId);
  drawSky();
}

function hitTest(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  let nearest = null;
  seasons[state.season].constellations.forEach((constellation) => {
    constellation.stars.forEach((star) => {
      const point = starToPoint(star);
      if (!isStarVisible(star, point, rect, getVisibleLimit())) return;
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < 20 && (!nearest || distance < nearest.distance)) {
        nearest = { distance, constellation, star, point };
      }
    });
  });
  if (nearest) {
    state.selectedId = nearest.constellation.id;
    const penalty = getAtmosphericPenalty(nearest.point, rect);
    const lowSkyNote = penalty > 0.4 ? "這顆星目前較接近地平線，模型會讓它稍微變暗並增加閃爍。" : "這顆星目前高度較高，受到地平線消光的影響較小。";
    infoBox.innerHTML = `<h2>${nearest.star[0]}</h2><p>屬於${nearest.constellation.name}，星等約 ${nearest.star[3]}。${lowSkyNote}</p>`;
    renderConstellationList();
    drawSky();
  }
}

function renderQuiz() {
  const item = quizItems[state.quizIndex];
  const progress = `${state.quizIndex + 1} / ${quizItems.length}`;
  document.querySelector("#quiz-card").innerHTML = `
    <p class="score">第 ${progress} 題，得分 ${state.score}</p>
    <h2>${item.q}</h2>
    <div class="answers">
      ${item.answers.map((answer, index) => `<button class="answer" type="button" data-answer="${index}">${answer}</button>`).join("")}
    </div>
    <p id="quiz-feedback" class="lead"></p>
    <div class="quiz-actions">
      <button class="text-button" type="button" id="next-question">${state.quizIndex === quizItems.length - 1 ? "重新開始" : "下一題"}</button>
      <span class="score">答題後會顯示原因</span>
    </div>
  `;
  state.answered = false;
  document.querySelectorAll(".answer").forEach(button => {
    button.addEventListener("click", () => checkAnswer(Number(button.dataset.answer)));
  });
  document.querySelector("#next-question").addEventListener("click", nextQuestion);
}

function checkAnswer(answerIndex) {
  if (state.answered) return;
  const item = quizItems[state.quizIndex];
  state.answered = true;
  if (answerIndex === item.correct) state.score += 1;
  document.querySelectorAll(".answer").forEach((button) => {
    const index = Number(button.dataset.answer);
    button.classList.toggle("correct", index === item.correct);
    button.classList.toggle("wrong", index === answerIndex && index !== item.correct);
  });
  const card = document.querySelector("#quiz-card");
  card.classList.remove("pulse-correct", "pulse-wrong");
  void card.offsetWidth;
  card.classList.add(answerIndex === item.correct ? "pulse-correct" : "pulse-wrong");
  document.querySelector("#quiz-feedback").textContent = item.why;
  document.querySelector(".quiz-card .score").textContent = `第 ${state.quizIndex + 1} / ${quizItems.length} 題，得分 ${state.score}`;
}

function nextQuestion() {
  if (state.quizIndex === quizItems.length - 1) {
    state.quizIndex = 0;
    state.score = 0;
  } else {
    state.quizIndex += 1;
  }
  renderQuiz();
}

function drawMiniAnimations(time = 0) {
  drawTrailCanvas(time);
  drawAtmosphereCanvas(time);
  drawPolarisCanvas();
  miniAnimationFrame = requestAnimationFrame(drawMiniAnimations);
}

function setupMiniCanvas(canvasElement) {
  const rect = canvasElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvasElement.width = Math.max(320, Math.round(rect.width * dpr));
  canvasElement.height = Math.max(160, Math.round(rect.height * dpr));
  const miniCtx = canvasElement.getContext("2d");
  miniCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx: miniCtx, rect };
}

function drawTrailCanvas(time) {
  if (!trailCanvas) return;
  const { ctx: c, rect } = setupMiniCanvas(trailCanvas);
  c.clearRect(0, 0, rect.width, rect.height);
  c.fillStyle = "#101725";
  c.fillRect(0, 0, rect.width, rect.height);
  const center = { x: rect.width * 0.5, y: rect.height * 0.5 };
  c.strokeStyle = "rgba(246, 211, 107, .48)";
  c.fillStyle = "#f6d36b";
  c.beginPath();
  c.arc(center.x, center.y, 4, 0, Math.PI * 2);
  c.fill();
  [34, 58, 82].forEach((radius, i) => {
    c.strokeStyle = `rgba(190, 220, 255, ${0.34 + i * 0.12})`;
    c.beginPath();
    c.arc(center.x, center.y, radius, -1.2, 3.8);
    c.stroke();
    const angle = time / 900 + i * 1.6;
    c.fillStyle = "#f4f8ff";
    c.beginPath();
    c.arc(center.x + Math.cos(angle) * radius, center.y + Math.sin(angle) * radius, 3.5, 0, Math.PI * 2);
    c.fill();
  });
}

function drawAtmosphereCanvas(time) {
  if (!atmosphereCanvas) return;
  const { ctx: c, rect } = setupMiniCanvas(atmosphereCanvas);
  c.clearRect(0, 0, rect.width, rect.height);
  const sky = c.createLinearGradient(0, 0, 0, rect.height);
  sky.addColorStop(0, "#0b1528");
  sky.addColorStop(1, "#345d68");
  c.fillStyle = sky;
  c.fillRect(0, 0, rect.width, rect.height);
  c.fillStyle = "rgba(232, 241, 245, .22)";
  c.fillRect(0, rect.height * 0.68, rect.width, rect.height * 0.32);
  c.strokeStyle = "rgba(246, 211, 107, .75)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(rect.width * 0.12, rect.height * 0.18);
  c.quadraticCurveTo(rect.width * 0.42, rect.height * 0.52 + Math.sin(time / 260) * 5, rect.width * 0.78, rect.height * 0.76);
  c.stroke();
  c.fillStyle = "#f6d36b";
  c.beginPath();
  c.arc(rect.width * 0.12, rect.height * 0.18, 5, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "rgba(255,255,255,.92)";
  c.font = "700 13px 'Microsoft JhengHei', sans-serif";
  c.fillText("低空路徑穿過較厚大氣", rect.width * 0.33, rect.height * 0.36);
}

function drawPolarisCanvas() {
  if (!polarisCanvas) return;
  const { ctx: c, rect } = setupMiniCanvas(polarisCanvas);
  c.clearRect(0, 0, rect.width, rect.height);
  const gradient = c.createLinearGradient(0, 0, 0, rect.height);
  gradient.addColorStop(0, "#091425");
  gradient.addColorStop(1, "#1e4253");
  c.fillStyle = gradient;
  c.fillRect(0, 0, rect.width, rect.height);
  drawSmallSkyDots(c, rect);

  if (state.polarisMethod === "dipper") {
    drawDipperMethod(c, rect);
  } else {
    drawCassiopeiaMethod(c, rect);
  }
}

function drawSmallSkyDots(c, rect) {
  c.save();
  c.fillStyle = "rgba(255,255,255,.42)";
  for (let i = 0; i < 34; i++) {
    const x = ((i * 83) % 997) / 997 * rect.width;
    const y = ((i * 151) % 661) / 661 * rect.height;
    c.beginPath();
    c.arc(x, y, 0.8 + (i % 2) * 0.5, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

function drawNamedStar(c, x, y, label, color = "#f4f8ff", radius = 4) {
  c.save();
  c.fillStyle = color;
  c.shadowColor = color;
  c.shadowBlur = 14;
  c.beginPath();
  c.arc(x, y, radius, 0, Math.PI * 2);
  c.fill();
  c.shadowBlur = 0;
  c.fillStyle = "rgba(255,255,255,.94)";
  c.font = "700 13px 'Microsoft JhengHei', sans-serif";
  c.fillText(label, x + radius + 6, y - radius - 2);
  c.restore();
}

function drawLine(c, a, b, color = "rgba(220,235,246,.55)", width = 2) {
  c.save();
  c.strokeStyle = color;
  c.lineWidth = width;
  c.beginPath();
  c.moveTo(a.x, a.y);
  c.lineTo(b.x, b.y);
  c.stroke();
  c.restore();
}

function drawDipperMethod(c, rect) {
  const stars = [
    { x: rect.width * .35, y: rect.height * .40, name: "天樞" },
    { x: rect.width * .37, y: rect.height * .46, name: "天璇" },
    { x: rect.width * .49, y: rect.height * .47, name: "天璣" },
    { x: rect.width * .52, y: rect.height * .38, name: "天權" },
    { x: rect.width * .63, y: rect.height * .34, name: "玉衡" },
    { x: rect.width * .72, y: rect.height * .39, name: "開陽" },
    { x: rect.width * .82, y: rect.height * .37, name: "搖光" }
  ];
  const dubhe = stars[0];
  const merak = stars[1];
  const polaris = {
    x: dubhe.x + (dubhe.x - merak.x) * 5,
    y: dubhe.y + (dubhe.y - merak.y) * 5,
    name: "北極星"
  };
  stars.slice(0, -1).forEach((star, index) => drawLine(c, star, stars[index + 1]));
  stars.forEach((star, index) => {
    drawNamedStar(c, star.x, star.y, state.polarisStep > 0 && index < 2 ? star.name : "", "#f4f8ff", index < 2 ? 5 : 4);
  });
  if (state.polarisStep >= 1) {
    drawLine(c, merak, dubhe, "#f6d36b", 3);
  }
  if (state.polarisStep >= 2) {
    c.save();
    c.strokeStyle = "#f6d36b";
    c.lineWidth = 3;
    c.setLineDash([8, 6]);
    c.beginPath();
    c.moveTo(merak.x, merak.y);
    c.lineTo(polaris.x, polaris.y);
    c.stroke();
    c.setLineDash([]);
    drawDistanceMarks(c, dubhe, polaris, 5);
    c.restore();
    c.fillStyle = "#f6d36b";
    c.font = "800 14px 'Microsoft JhengHei', sans-serif";
    c.fillText("天璇 → 天樞，再延長約 5 倍", rect.width * .08, rect.height * .24);
  }
  if (state.polarisStep >= 3) {
    drawNamedStar(c, polaris.x, polaris.y, polaris.name, "#f6d36b", 5);
  }
}

function drawCassiopeiaMethod(c, rect) {
  const stars = [
    { x: rect.width * .18, y: rect.height * .43, name: "仙后一" },
    { x: rect.width * .30, y: rect.height * .30, name: "仙后二" },
    { x: rect.width * .43, y: rect.height * .50, name: "中間星" },
    { x: rect.width * .57, y: rect.height * .31, name: "仙后四" },
    { x: rect.width * .71, y: rect.height * .44, name: "仙后五" }
  ];
  const leftIntersectionLine = [stars[0], stars[1]];
  const rightIntersectionLine = [stars[4], stars[3]];
  const intersection = lineIntersection(leftIntersectionLine[0], leftIntersectionLine[1], rightIntersectionLine[0], rightIntersectionLine[1]);
  const middle = stars[2];
  const polaris = { x: rect.width * .49, y: rect.height * .84, name: "北極星" };
  stars.slice(0, -1).forEach((star, index) => drawLine(c, star, stars[index + 1]));
  stars.forEach((star, index) => drawNamedStar(c, star.x, star.y, state.polarisStep === 0 && index === 2 ? "仙后座 W" : "", "#f4f8ff", index === 2 ? 5 : 4));
  if (state.polarisStep >= 1) {
    c.save();
    c.strokeStyle = "#f6d36b";
    c.lineWidth = 2.5;
    c.setLineDash([7, 5]);
    c.beginPath();
    c.moveTo(stars[0].x, stars[0].y);
    c.lineTo(intersection.x, intersection.y);
    c.lineTo(stars[4].x, stars[4].y);
    c.stroke();
    c.setLineDash([]);
    c.fillStyle = "#f6d36b";
    c.beginPath();
    c.arc(intersection.x, intersection.y, 5, 0, Math.PI * 2);
    c.fill();
    c.font = "800 13px 'Microsoft JhengHei', sans-serif";
    c.fillText("兩側延長交會點", intersection.x + 10, intersection.y + 4);
    c.restore();
  }
  if (state.polarisStep >= 2) {
    c.save();
    c.strokeStyle = "#f6d36b";
    c.lineWidth = 3;
    c.setLineDash([8, 6]);
    c.beginPath();
    c.moveTo(intersection.x, intersection.y);
    c.lineTo(middle.x, middle.y);
    c.lineTo(polaris.x, polaris.y);
    c.stroke();
    c.setLineDash([]);
    drawNamedStar(c, middle.x, middle.y, "中間星", "#f6d36b", 6);
    c.fillStyle = "#f6d36b";
    c.font = "800 14px 'Microsoft JhengHei', sans-serif";
    c.fillText("交會點 → 中間星，再延長", rect.width * .44, rect.height * .66);
    c.restore();
  }
  if (state.polarisStep >= 3) {
    drawNamedStar(c, polaris.x, polaris.y, polaris.name, "#f6d36b", 5);
  }
}

function drawDistanceMarks(c, start, end, count) {
  c.save();
  c.fillStyle = "rgba(246, 211, 107, .9)";
  for (let i = 1; i <= count; i++) {
    const t = i / count;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    c.beginPath();
    c.arc(x, y, 2.2, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

function lineIntersection(a, b, c, d) {
  const denominator = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
  if (Math.abs(denominator) < 0.0001) return { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
  const x = ((a.x * b.y - a.y * b.x) * (c.x - d.x) - (a.x - b.x) * (c.x * d.y - c.y * d.x)) / denominator;
  const y = ((a.x * b.y - a.y * b.x) * (c.y - d.y) - (a.y - b.y) * (c.x * d.y - c.y * d.x)) / denominator;
  return { x, y };
}

function updatePolarisStep() {
  const steps = polarisSteps[state.polarisMethod];
  state.polarisStep = Math.max(0, Math.min(state.polarisStep, steps.length - 1));
  polarisStepText.textContent = steps[state.polarisStep];
  polarisPrevButton.disabled = state.polarisStep === 0;
  polarisNextButton.disabled = state.polarisStep === steps.length - 1;
  polarisAutoButton.textContent = polarisAutoTimer ? "停止演示" : "自動演示";
  document.querySelectorAll(".method-btn").forEach(button => {
    button.classList.toggle("is-active", button.dataset.method === state.polarisMethod);
  });
  drawPolarisCanvas();
}

function stopPolarisAutoDemo() {
  if (polarisAutoTimer) {
    window.clearInterval(polarisAutoTimer);
    polarisAutoTimer = 0;
    updatePolarisStep();
  }
}

function startPolarisAutoDemo() {
  stopPolarisAutoDemo();
  state.polarisStep = 0;
  updatePolarisStep();
  polarisAutoTimer = window.setInterval(() => {
    const maxStep = polarisSteps[state.polarisMethod].length - 1;
    if (state.polarisStep >= maxStep) {
      stopPolarisAutoDemo();
      return;
    }
    state.polarisStep += 1;
    updatePolarisStep();
  }, 1200);
  updatePolarisStep();
}

function updateSeasonGuide(seasonId) {
  document.querySelectorAll(".season-guide-card").forEach(button => {
    button.classList.toggle("is-active", button.dataset.seasonJump === seasonId);
  });
  if (seasonGuideFeedback) {
    seasonGuideFeedback.textContent = seasonGuideText[seasonId];
  }
}

function tickSky(timestamp) {
  if (!state.lastTick) state.lastTick = timestamp;
  const elapsed = timestamp - state.lastTick;
  state.lastTick = timestamp;
  if (state.skyAnimating) {
    state.time += elapsed / 3200;
    if (state.time > 3) state.time = -3;
    timeRange.value = String(Number(state.time.toFixed(2)));
  }
  drawSky();
  skyAnimationFrame = requestAnimationFrame(tickSky);
}

document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.toggle("is-active", tab === button));
    document.querySelectorAll(".workspace").forEach(section => section.classList.add("is-hidden"));
    document.querySelector(`#${button.dataset.target}`).classList.remove("is-hidden");
    resizeCanvas();
  });
});

document.querySelectorAll(".season-btn").forEach(button => {
  button.addEventListener("click", () => setSeason(button.dataset.season));
});

document.querySelectorAll(".season-guide-card").forEach(button => {
  button.addEventListener("click", () => {
    const seasonId = button.dataset.seasonJump;
    setSeason(seasonId);
    document.querySelector('[data-target="explore"]').click();
  });
});

timeRange.addEventListener("input", () => {
  state.time = Number(timeRange.value);
  drawSky();
});

lightRange.addEventListener("input", () => {
  state.light = Number(lightRange.value);
  drawSky();
});

magnitudeRange.addEventListener("input", () => {
  state.maxMagnitude = Number(magnitudeRange.value);
  drawSky();
});

animateSkyInput.addEventListener("change", () => {
  state.skyAnimating = animateSkyInput.checked;
  state.lastTick = 0;
});

toggleLinesButton.addEventListener("click", () => {
  state.showLines = !state.showLines;
  toggleLinesButton.setAttribute("aria-pressed", String(state.showLines));
  drawSky();
});

resetButton.addEventListener("click", () => {
  state.light = 1;
  state.maxMagnitude = 5;
  state.time = 0;
  state.showLines = true;
  state.showPolaris = false;
  state.skyAnimating = false;
  lightRange.value = "1";
  magnitudeRange.value = "5";
  timeRange.value = "0";
  animateSkyInput.checked = false;
  toggleLinesButton.setAttribute("aria-pressed", "true");
  setSeason("spring");
});

canvas.addEventListener("click", (event) => hitTest(event.clientX, event.clientY));

function showPolarisOnSky() {
  state.showPolaris = true;
  document.querySelector('[data-target="explore"]').click();
  drawSky();
}

document.querySelector("#show-polaris").addEventListener("click", showPolarisOnSky);
document.querySelector("#show-polaris-from-methods").addEventListener("click", showPolarisOnSky);

document.querySelectorAll(".method-btn").forEach(button => {
  button.addEventListener("click", () => {
    stopPolarisAutoDemo();
    state.polarisMethod = button.dataset.method;
    state.polarisStep = 0;
    updatePolarisStep();
  });
});

polarisPrevButton.addEventListener("click", () => {
  stopPolarisAutoDemo();
  state.polarisStep -= 1;
  updatePolarisStep();
});

polarisNextButton.addEventListener("click", () => {
  stopPolarisAutoDemo();
  state.polarisStep += 1;
  updatePolarisStep();
});

polarisResetButton.addEventListener("click", () => {
  stopPolarisAutoDemo();
  state.polarisStep = 0;
  updatePolarisStep();
});

polarisAutoButton.addEventListener("click", () => {
  if (polarisAutoTimer) {
    stopPolarisAutoDemo();
  } else {
    startPolarisAutoDemo();
  }
});

document.querySelector("#play-motion").addEventListener("click", () => {
  document.querySelector('[data-target="explore"]').click();
  animateSkyInput.checked = true;
  state.skyAnimating = true;
  state.lastTick = 0;
});

window.addEventListener("resize", () => {
  resizeCanvas();
  drawTrailCanvas(performance.now());
  drawAtmosphereCanvas(performance.now());
  drawPolarisCanvas();
});

setSeason("spring");
updatePolarisStep();
renderQuiz();
resizeCanvas();
skyAnimationFrame = requestAnimationFrame(tickSky);
miniAnimationFrame = requestAnimationFrame(drawMiniAnimations);
