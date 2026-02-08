const HAND_RANKS = {
  // Pairs
  AA: 8, KK: 8, QQ: 8, JJ: 7, TT: 7, "99": 7, "88": 6, "77": 6, "66": 5, "55": 5, "44": 4, "33": 4, "22": 4,
  // Suited
  AKs: 8, AQs: 7, AJs: 7, ATs: 7, A9s: 5, A8s: 5, A7s: 5, A6s: 5, A5s: 5, A4s: 5, A3s: 5, A2s: 5,
  KQs: 7, KJs: 6, KTs: 5, K9s: 5, K8s: 3, K7s: 3, K6s: 3, K5s: 3, K4s: 3, K3s: 3, K2s: 3,
  QJs: 6, QTs: 5, Q9s: 4, Q8s: 3, Q7s: 3, Q6s: 3, Q5s: 2, Q4s: 2, Q3s: 2, Q2s: 2,
  JTs: 6, J9s: 4, J8s: 3, J7s: 3, J6s: 2, J5s: 1, J4s: 1, J3s: 1, J2s: 1,
  T9s: 5, T8s: 4, T7s: 2, T6s: 1, T5s: 1, T4s: 1, T3s: 1, T2s: 0,
  "98s": 4, "97s": 3, "96s": 2, "95s": 1, "94s": 0, "93s": 0, "92s": 0,
  "87s": 3, "86s": 2, "85s": 1, "84s": 0, "83s": 0, "82s": 0,
  "76s": 3, "75s": 2, "74s": 1, "73s": 0, "72s": 0,
  "65s": 3, "64s": 2, "63s": 1, "62s": 0,
  "54s": 2, "53s": 1, "52s": 0,
  "43s": 1, "42s": 0, "32s": 0,
  // Offsuit
  AKo: 8, AQo: 7, AJo: 6, ATo: 5, A9o: 4, A8o: 3, A7o: 3, A6o: 2, A5o: 1, A4o: 1, A3o: 1, A2o: 1,
  KQo: 6, KJo: 5, KTo: 4, K9o: 3, K8o: 1, K7o: 1, K6o: 1, K5o: 1, K4o: 0, K3o: 0, K2o: 0,
  QJo: 4, QTo: 3, Q9o: 3, Q8o: 1, Q7o: 1, Q6o: 0, Q5o: 0, Q4o: 0, Q3o: 0, Q2o: 0,
  JTo: 4, J9o: 3, J8o: 1, J7o: 0, J6o: 0, J5o: 0, J4o: 0, J3o: 0, J2o: 0,
  T9o: 3, T8o: 1, T7o: 0, T6o: 0, T5o: 0, T4o: 0, T3o: 0, T2o: 0,
  "98o": 2, "97o": 1, "96o": 0, "95o": 0, "94o": 0, "93o": 0, "92o": 0,
  "87o": 1, "86o": 0, "85o": 0, "84o": 0, "83o": 0, "82o": 0,
  "76o": 0, "75o": 0, "74o": 0, "73o": 0, "72o": 0,
  "65o": 0, "64o": 0, "63o": 0, "62o": 0,
  "54o": 0, "53o": 0, "52o": 0, "43o": 0, "42o": 0, "32o": 0
};

// 6人は「MP」を出さず、一般的に分かりやすい「HJ」を採用
const POSITIONS_6 = ["UTG", "HJ", "CO", "BTN", "SB", "BB"];
const POSITIONS_9 = ["UTG", "UTG+1", "UTG+2", "LJ", "HJ", "CO", "BTN", "SB", "BB"];
const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = ["♠", "♥", "♦", "♣"];
const SUIT_CLASSES = ["spade", "heart", "diamond", "club"];

const storage = {
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("localStorage save failed", error);
    }
  },
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn("localStorage load failed", error);
      return fallback;
    }
  }
};

const state = {
  mode: storage.load("yoko-range-trainer:mode", "tournament"),
  quiz: "open",
  open: {
    correct: 0,
    total: 0,
    streak: 0,
    tableSize: 6,
    locked: false,
    fixPosEnabled: storage.load("yoko-range-trainer:open:fixPosEnabled", false),
    fixPos: storage.load("yoko-range-trainer:open:fixPos", "UTG")
  },
  action: {
    correct: 0,
    total: 0,
    streak: 0,
    tableSize: 6,
    locked: false,
    fixPosEnabled: storage.load("yoko-range-trainer:action:fixPosEnabled", false),
    fixPos: storage.load("yoko-range-trainer:action:fixPos", "UTG")
  },
  paintSelection: new Set(),
  paintTableSize: storage.load("yoko-range-trainer:paintTableSize", 6),
  paintPosition: storage.load("yoko-range-trainer:paintPosition", "UTG"),
  paintShowCorrect: false
};

const elements = {
  modeToggle: document.getElementById("modeToggle"),
  modeLabel: document.getElementById("modeLabel"),
  tabs: Array.from(document.querySelectorAll(".tab-button")),
  panels: {
    open: document.getElementById("panel-open"),
    action: document.getElementById("panel-action"),
    paint: document.getElementById("panel-paint")
  },
  open: {
    tableSize: document.getElementById("openTableSize"),
    fixPosEnabled: document.getElementById("openFixPosEnabled"),
    fixPos: document.getElementById("openFixPos"),
    position: document.getElementById("openPosition"),
    oppRow: document.getElementById("openOppRow"),
    opp: document.getElementById("openOpp"),
    hand: document.getElementById("openHand"),
    feedback: document.getElementById("openFeedback"),
    btn1: document.getElementById("openBtn1"),
    btn2: document.getElementById("openBtn2"),
    next: document.getElementById("openNext"),
    answerRange: document.getElementById("openAnswerRange"),
    rangePos: document.getElementById("openRangePos"),
    rangeGrid: document.getElementById("openRangeGrid"),
    correct: document.getElementById("openCorrect"),
    total: document.getElementById("openTotal"),
    streak: document.getElementById("openStreak"),
    best: document.getElementById("openBest")
  },
  action: {
    tableSize: document.getElementById("actionTableSize"),
    fixPosEnabled: document.getElementById("actionFixPosEnabled"),
    fixPos: document.getElementById("actionFixPos"),
    opp: document.getElementById("actionOpp"),
    hero: document.getElementById("actionHero"),
    hand: document.getElementById("actionHand"),
    feedback: document.getElementById("actionFeedback"),
    reason: document.getElementById("actionReason"),
    next: document.getElementById("actionNext"),
    answerRange: document.getElementById("actionAnswerRange"),
    rangeHero: document.getElementById("actionRangeHero"),
    rangeOpp: document.getElementById("actionRangeOpp"),
    rangeGrid: document.getElementById("actionRangeGrid"),
    correct: document.getElementById("actionCorrect"),
    total: document.getElementById("actionTotal"),
    streak: document.getElementById("actionStreak"),
    best: document.getElementById("actionBest")
  },
  paint: {
    tableSize: document.getElementById("paintTableSize"),
    position: document.getElementById("paintPosition"),
    grid: document.getElementById("rangeGrid"),
    viewToggle: document.getElementById("paintViewToggle"),
    showCorrect: document.getElementById("paintShowCorrect"),
    feedback: document.getElementById("paintFeedback"),
    accuracy: document.getElementById("paintAccuracy"),
    missing: document.getElementById("paintMissing"),
    extra: document.getElementById("paintExtra"),
    check: document.getElementById("paintCheck"),
    clear: document.getElementById("paintClear"),
    legend: document.getElementById("rankLegend")
  }
};

const getModeKey = () => (state.mode === "ring" ? "ring" : "tour");
const getPositionsByTableSize = (tableSize) => (tableSize === 6 ? POSITIONS_6 : POSITIONS_9);

const setFixedPosOptions = (selectEl, tableSize, excludeBB = false) => {
  let positions = getPositionsByTableSize(tableSize);
  if (excludeBB) {
    positions = positions.filter((p) => p !== "BB");
  }
  selectEl.innerHTML = "";
  positions.forEach((pos) => {
    const opt = document.createElement("option");
    opt.value = pos;
    opt.textContent = pos;
    selectEl.appendChild(opt);
  });
};

// 「相手のレイズレベル（要求ランク）」をここで一元管理する
// ※ mode==="ring" は基本 +1（より厳しい）とする
// 横沢ルールによるオープンレイズの要求ランク
// 「後ろに何人いるか」で判断:
// - 後ろに6〜7人（UTG等）：緑（Lv5）以上
// - 後ろに4〜5人（MP等）：水色（Lv4）以上
// - 後ろに2人（BTN）：黒/赤枠（Lv2）以上
const REQUIRED_RANKS_TOURNAMENT = {
  6: {
    // 6人テーブル: UTG(後ろ5人)→Lv4, HJ(後ろ4人)→Lv4, CO(後ろ3人)→Lv3, BTN(後ろ2人)→Lv2
    UTG: 4,
    HJ: 4,
    CO: 3,
    BTN: 2,
    SB: 2,
    BB: 3  // BBはオープンレイズしないが、参考値
  },
  9: {
    // 9人テーブル: UTG帯(後ろ6-8人)→Lv5〜6, LJ/HJ(後ろ4-5人)→Lv4, CO(後ろ3人)→Lv3, BTN(後ろ2人)→Lv2
    UTG: 6,
    "UTG+1": 6,
    "UTG+2": 5,
    LJ: 5,
    HJ: 4,
    CO: 3,
    BTN: 2,
    SB: 2,
    BB: 3
  }
};

const getRequiredRank = (position, mode, tableSize) => {
  const t = tableSize === 9 ? 9 : 6;
  const base = REQUIRED_RANKS_TOURNAMENT[t][position] ?? 5;
  return mode === "ring" ? base + 1 : base;
};

const getHandRank = (hand) => HAND_RANKS[hand] ?? 0;

// レベル番号から色名への変換（下から順に: 灰、ピンク、紫、白、水、緑、黄、赤、青）
const RANK_COLOR_NAMES = ["灰", "ピンク", "紫", "白", "水", "緑", "黄", "赤", "青"];
const getRankColorName = (rank) => RANK_COLOR_NAMES[Math.min(Math.max(rank, 0), 8)];

// アクション決定の理由を生成する関数
const getActionDecisionReason = (heroPos, oppPos, mode, tableSize) => {
  const oppRequired = getRequiredRank(oppPos, mode, tableSize);
  const ringAdjust = mode === "ring" ? 1 : 0;
  const oppColorName = getRankColorName(oppRequired);
  
  // BB特例（横沢ルール）
  if (heroPos === "BB") {
    const baseCallColor = getRankColorName(3 + ringAdjust); // 白（リングは水）
    const threeBetColor = getRankColorName(oppRequired + 2);
    
    if (oppPos === "BTN" || oppPos === "SB") {
      const callMinColor = getRankColorName(1 + ringAdjust); // ピンク（リングは紫）
      return `相手は${oppPos}からレイズしているので、あなたは${threeBetColor}以上で3-BET、${baseCallColor}～${callMinColor}でコール、それ以下はフォールドします。`;
    } else if (oppPos === "CO") {
      const callMinColor = getRankColorName(2 + ringAdjust); // 紫（リングは白）
      return `相手は${oppPos}からレイズしているので、あなたは${threeBetColor}以上で3-BET、${baseCallColor}～${callMinColor}でコール、それ以下はフォールドします。`;
    } else {
      // EP/MPなど（白以上のみコール）
      return `相手は${oppPos}からレイズしているので、あなたは${threeBetColor}以上で3-BET、${baseCallColor}でコール、それ以下はフォールドします。`;
    }
  }
  
  // 通常ルール
  const callColor = getRankColorName(oppRequired + 1);
  const threeBetColor = getRankColorName(oppRequired + 2);
  
  return `相手は${oppColorName}以上でレイズしているので、あなたは${threeBetColor}以上で3-BET、${callColor}でコール、${oppColorName}以下はフォールドします。`; 
};

const formatHandWithSuits = (hand) => {
  const suited = hand.endsWith("s");
  const offsuit = hand.endsWith("o");
  const pair = !suited && !offsuit;
  
  if (pair) {
    const rank = hand[0];
    const suit1 = randomItem(SUITS);
    let suit2 = randomItem(SUITS);
    while (suit2 === suit1) suit2 = randomItem(SUITS);
    const class1 = SUIT_CLASSES[SUITS.indexOf(suit1)];
    const class2 = SUIT_CLASSES[SUITS.indexOf(suit2)];
    return `<span class="card ${class1}">${rank}${suit1}</span><span class="card ${class2}">${rank}${suit2}</span>`;
  }
  
  const rank1 = hand[0];
  const rank2 = hand[1];
  
  if (suited) {
    const suit = randomItem(SUITS);
    const suitClass = SUIT_CLASSES[SUITS.indexOf(suit)];
    return `<span class="card ${suitClass}">${rank1}${suit}</span><span class="card ${suitClass}">${rank2}${suit}</span>`;
  } else {
    const suit1 = randomItem(SUITS);
    let suit2 = randomItem(SUITS);
    while (suit2 === suit1) suit2 = randomItem(SUITS);
    const class1 = SUIT_CLASSES[SUITS.indexOf(suit1)];
    const class2 = SUIT_CLASSES[SUITS.indexOf(suit2)];
    return `<span class="card ${class1}">${rank1}${suit1}</span><span class="card ${class2}">${rank2}${suit2}</span>`;
  }
};

const buildMiniRangeGrid = (container, highlightHands) => {
  container.innerHTML = "";
  RANKS.forEach((rowRank, rowIdx) => {
    RANKS.forEach((colRank, colIdx) => {
      let hand = "";
      if (rowIdx === colIdx) {
        hand = `${rowRank}${colRank}`;
      } else if (rowIdx < colIdx) {
        hand = `${rowRank}${colRank}s`;
      } else {
        hand = `${colRank}${rowRank}o`;
      }
      const rankLevel = getHandRank(hand);
      const cell = document.createElement("div");
      cell.className = `range-cell rank-${rankLevel}`;
      cell.textContent = hand;
      
      if (highlightHands.has(hand)) {
        cell.classList.add("show-correct");
      }
      
      container.appendChild(cell);
    });
  });
};

const getCorrectRangeForPosition = (position, mode, tableSize) => {
  const required = getRequiredRank(position, mode, tableSize);
  return new Set(
    Object.keys(HAND_RANKS).filter(hand => getHandRank(hand) >= required)
  );
};

const judgeBBDefense = (hand, oppPos, mode, tableSize) => {
  const handRank = getHandRank(hand);
  // BB特例（横沢ルール）:
  // - どのポジションからのレイズでも「白（Lv3）」以上なら全コールOK
  // - COからのレイズ → Lv2（紫枠）までコール可
  // - BTNからのレイズ → Lv1（ピンク）までコール可
  // - SBからのレイズ → BTNと同様（steal spot）
  const ringAdjust = mode === "ring" ? 1 : 0;
  
  // 白（Lv3）以上なら、どのポジションからでもコール
  if (handRank >= 3 + ringAdjust) return "CALL";
  
  // BTN/SBからのレイズ: Lv1（ピンク）までコール可
  if (oppPos === "BTN" || oppPos === "SB") {
    return handRank >= 1 + ringAdjust ? "CALL" : "FOLD";
  }
  
  // COからのレイズ: Lv2（紫枠）までコール可
  if (oppPos === "CO") {
    return handRank >= 2 + ringAdjust ? "CALL" : "FOLD";
  }
  
  // その他のポジション: 白（Lv3）以上のみコール（既に上で処理済み）
  return "FOLD";
};

const getCorrectBBDefenseCallRange = (oppPos, mode, tableSize) => {
  // BB特例（横沢ルール）:
  // - どのポジションからのレイズでも「白（Lv3）」以上なら全コールOK
  // - COからのレイズ → Lv2（紫枠）までコール可
  // - BTNからのレイズ → Lv1（ピンク）までコール可
  const ringAdjust = mode === "ring" ? 1 : 0;
  
  let threshold;
  if (oppPos === "BTN" || oppPos === "SB") {
    threshold = 1 + ringAdjust;  // ピンク（Lv1）まで
  } else if (oppPos === "CO") {
    threshold = 2 + ringAdjust;  // 紫枠（Lv2）まで
  } else {
    threshold = 3 + ringAdjust;  // 白（Lv3）まで
  }
  
  return new Set(Object.keys(HAND_RANKS).filter((hand) => getHandRank(hand) >= threshold));
};

const getCorrectRangeForAction = (heroPos, oppPos, mode, tableSize) => {
  const correctHands = new Set();
  const oppRequired = getRequiredRank(oppPos, mode, tableSize);
  const ringAdjust = mode === "ring" ? 1 : 0;
  
  Object.keys(HAND_RANKS).forEach(hand => {
    const handRank = getHandRank(hand);
    
    // BB特例（横沢ルール）
    if (heroPos === "BB") {
      // 白（Lv3）以上なら、どのポジションからでもコール
      if (handRank >= 3 + ringAdjust) {
        correctHands.add(hand);
        return;
      }
      // BTN/SBからのレイズ: Lv1（ピンク）までコール可
      if ((oppPos === "BTN" || oppPos === "SB") && handRank >= 1 + ringAdjust) {
        correctHands.add(hand);
        return;
      }
      // COからのレイズ: Lv2（紫枠）までコール可
      if (oppPos === "CO" && handRank >= 2 + ringAdjust) {
        correctHands.add(hand);
        return;
      }
      return;
    }
    
    // 通常ロジック: 相手より1ランク以上上ならCALLまたは3-BET
    if (handRank > oppRequired) {
      correctHands.add(hand);
    }
  });
  
  return correctHands;
};

const judgeOpenRaise = (hand, position, mode, tableSize) => {
  const required = getRequiredRank(position, mode, tableSize);
  return getHandRank(hand) >= required ? "RAISE" : "FOLD";
};

const judgeActionDecision = (hand, heroPos, oppPos, mode) => {
  const handRank = getHandRank(hand);
  const oppRequired = getRequiredRank(oppPos, mode, state.action.tableSize);
  const ringAdjust = mode === "ring" ? 1 : 0;

  // BB特例（横沢ルール）
  if (heroPos === "BB") {
    // 白（Lv3）以上なら、どのポジションからでもコール
    // ただし、2ランク以上上（oppRequired+2以上）なら3-BET
    if (handRank >= oppRequired + 2) return "3-BET";
    if (handRank >= 3 + ringAdjust) return "CALL";
    
    // BTN/SBからのレイズ: Lv1（ピンク）までコール可
    if ((oppPos === "BTN" || oppPos === "SB") && handRank >= 1 + ringAdjust) return "CALL";
    
    // COからのレイズ: Lv2（紫枠）までコール可
    if (oppPos === "CO" && handRank >= 2 + ringAdjust) return "CALL";
    
    return "FOLD";
  }

  // 通常の判定ロジック（横沢ルール）:
  // - 相手と同じ色以下 → FOLD
  // - 1ランク上 → CALL
  // - 2ランク以上上 → 3-BET
  if (handRank <= oppRequired) return "FOLD";
  if (handRank === oppRequired + 1) return "CALL";
  return "3-BET";
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const nextOpenQuestion = () => {
  const positions = getPositionsByTableSize(state.open.tableSize);
  // BBはオープンレイズしないため除外
  const validPositions = positions.filter((p) => p !== "BB");
  
  state.open.currentHand = randomItem(Object.keys(HAND_RANKS));
  if (state.open.fixPosEnabled) {
    // 固定ポジションがBBの場合は最初の有効ポジションを使用
    state.open.currentPos = validPositions.includes(state.open.fixPos) ? state.open.fixPos : validPositions[0];
  } else {
    state.open.currentPos = randomItem(validPositions);
  }
  state.open.quizType = "open";

  state.open.oppPos = null;
  elements.open.oppRow.style.display = "none";
  elements.open.btn2.textContent = "RAISE";
  elements.open.rangePos.textContent = state.open.currentPos;

  elements.open.position.textContent = state.open.currentPos;
  elements.open.hand.innerHTML = formatHandWithSuits(state.open.currentHand);
  elements.open.answerRange.style.display = "none";
  elements.open.next.style.display = "none";
  elements.open.feedback.textContent = "";
  state.open.locked = false;
  Array.from(document.querySelectorAll("#panel-open [data-open-answer]")).forEach((btn) => (btn.disabled = false));
};

const nextActionQuestion = () => {
  const positions = getPositionsByTableSize(state.action.tableSize);
  state.action.currentHand = randomItem(Object.keys(HAND_RANKS));
  
  // 3betシナリオでは、Openレイザー（oppPos）より後ろのポジションのみが3bet可能
  // ポジション順: UTG → HJ → CO → BTN → SB → BB（先にアクション→後にアクション）
  // Openレイザーはアクション順で先の人、3betするのは後ろの人
  
  if (state.action.fixPosEnabled) {
    // ポジション固定時: heroPos を先に決め、それより前のポジションからoppPosを選ぶ
    state.action.heroPos = positions.includes(state.action.fixPos) ? state.action.fixPos : positions[0];
    const heroIndex = positions.indexOf(state.action.heroPos);
    // heroより前のポジション（インデックスが小さい）がOpenレイザー候補
    // BB(最後のポジション)はOpenレイザーにならない
    const validRaisers = positions.slice(0, heroIndex).filter((p) => p !== "BB");
    if (validRaisers.length === 0) {
      // UTGなど最初のポジションが固定されている場合、3bet対象がいない
      // この場合は固定を無視してランダムに選ぶ
      state.action.heroPos = randomItem(positions.slice(1)); // UTG以外
      const newHeroIndex = positions.indexOf(state.action.heroPos);
      const newValidRaisers = positions.slice(0, newHeroIndex).filter((p) => p !== "BB");
      state.action.oppPos = randomItem(newValidRaisers);
    } else {
      state.action.oppPos = randomItem(validRaisers);
    }
  } else {
    // 「相手がレイズ済み」なので、BBはレイザーにならない
    // また、最後のポジション（BB）はOpenレイザーになれない（全員にフォールドされたらBBはBBのまま）
    // Openレイザーは positions[0] から positions[n-2] まで（BBを除く）
    const raisers = positions.slice(0, -1).filter((p) => p !== "BB"); // BBと最後を除く
    state.action.oppPos = randomItem(raisers);
    
    // oppPosより後ろのポジションからheroPosを選ぶ
    const oppIndex = positions.indexOf(state.action.oppPos);
    const validHeroPositions = positions.slice(oppIndex + 1);
    state.action.heroPos = randomItem(validHeroPositions);
  }
  elements.action.opp.textContent = state.action.oppPos;
  elements.action.hero.textContent = state.action.heroPos;
  elements.action.hand.innerHTML = formatHandWithSuits(state.action.currentHand);
  elements.action.answerRange.style.display = "none";
  elements.action.reason.style.display = "none";
  elements.action.next.style.display = "none";
  elements.action.feedback.textContent = "";
  state.action.locked = false;
  Array.from(document.querySelectorAll("#panel-action [data-action-answer]")).forEach((btn) => (btn.disabled = false));
};

const updateStats = (key) => {
  if (key === "open") {
    const bestKey = `yoko-range-trainer:highscore:openRaise:${getModeKey()}`;
    const best = storage.load(bestKey, 0);
    elements.open.correct.textContent = state.open.correct;
    elements.open.total.textContent = state.open.total;
    elements.open.streak.textContent = state.open.streak;
    elements.open.best.textContent = best;
  } else if (key === "action") {
    const bestKey = `yoko-range-trainer:highscore:actionDecision:${getModeKey()}`;
    const best = storage.load(bestKey, 0);
    elements.action.correct.textContent = state.action.correct;
    elements.action.total.textContent = state.action.total;
    elements.action.streak.textContent = state.action.streak;
    elements.action.best.textContent = best;
  }
};

const updateBestScore = (key, value) => {
  const storageKey =
    key === "open"
      ? `yoko-range-trainer:highscore:openRaise:${getModeKey()}`
      : `yoko-range-trainer:highscore:actionDecision:${getModeKey()}`;
  const current = storage.load(storageKey, 0);
  if (value > current) {
    storage.save(storageKey, value);
  }
};

const setMode = (mode) => {
  state.mode = mode;
  storage.save("yoko-range-trainer:mode", mode);
  elements.modeToggle.checked = mode === "ring";
  elements.modeLabel.textContent = mode === "ring" ? "リング" : "トーナメント";
  updateStats("open");
  updateStats("action");
};

const setPaintPositionOptions = () => {
  const positions = state.paintTableSize === 6 ? POSITIONS_6 : POSITIONS_9;
  elements.paint.position.innerHTML = "";
  positions.forEach((pos) => {
    const opt = document.createElement("option");
    opt.value = pos;
    opt.textContent = pos;
    elements.paint.position.appendChild(opt);
  });

  // 既存の選択が候補にない場合は先頭へ
  if (!positions.includes(state.paintPosition)) {
    state.paintPosition = positions[0];
    storage.save("yoko-range-trainer:paintPosition", state.paintPosition);
  }
  elements.paint.position.value = state.paintPosition;
};

const setActiveTab = (tab) => {
  state.quiz = tab;
  elements.tabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  Object.entries(elements.panels).forEach(([key, panel]) => {
    panel.classList.toggle("active", key === tab);
  });
};

const buildRangeGrid = () => {
  elements.paint.grid.innerHTML = "";
  RANKS.forEach((rowRank, rowIdx) => {
    RANKS.forEach((colRank, colIdx) => {
      let hand = "";
      if (rowIdx === colIdx) {
        hand = `${rowRank}${colRank}`;
      } else if (rowIdx < colIdx) {
        hand = `${rowRank}${colRank}s`;
      } else {
        hand = `${colRank}${rowRank}o`;
      }
      const rankLevel = getHandRank(hand);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `range-cell rank-${rankLevel}`;
      cell.dataset.hand = hand;
      cell.textContent = hand;
      elements.paint.grid.appendChild(cell);
    });
  });
};

const updatePaintRequired = () => {
  // Removed - no longer needed
};

const loadPaintSelection = () => {
  const key = `yoko-range-trainer:rangePaint:selection:${getModeKey()}:t${state.paintTableSize}:${state.paintPosition}`;
  const saved = storage.load(key, []);
  state.paintSelection = new Set(saved);
  syncPaintSelectionUI();
};

const savePaintSelection = () => {
  const key = `yoko-range-trainer:rangePaint:selection:${getModeKey()}:t${state.paintTableSize}:${state.paintPosition}`;
  storage.save(key, Array.from(state.paintSelection));
};

const syncPaintSelectionUI = () => {
  Array.from(elements.paint.grid.children).forEach((cell) => {
    const hand = cell.dataset.hand;
    const isSelected = state.paintSelection.has(hand);
    
    if (state.paintShowCorrect) {
      cell.classList.remove("selected");
      const required = getRequiredRank(state.paintPosition, state.mode, state.paintTableSize);
      const handRank = getHandRank(hand);
      if (handRank >= required) {
        cell.classList.add("show-correct");
      } else {
        cell.classList.remove("show-correct");
      }
    } else {
      cell.classList.remove("show-correct");
      cell.classList.toggle("selected", isSelected);
    }
  });
};

const evaluatePaint = () => {
  const required = getRequiredRank(state.paintPosition, state.mode, state.paintTableSize);
  const allHands = Object.keys(HAND_RANKS);
  const correctSet = new Set(allHands.filter((hand) => getHandRank(hand) >= required));
  let correct = 0;
  let missing = 0;
  let extra = 0;

  correctSet.forEach((hand) => {
    if (state.paintSelection.has(hand)) {
      correct += 1;
    } else {
      missing += 1;
    }
  });

  state.paintSelection.forEach((hand) => {
    if (!correctSet.has(hand)) extra += 1;
  });

  // 正解率の計算：余分も考慮する
  // 正解率 = 正しく選択したハンド数 / (正解の総数 + 余分に選択したハンド数)
  const totalRequired = correctSet.size + extra;
  const accuracy = totalRequired === 0 ? 0 : Math.round((correct / totalRequired) * 100);
  elements.paint.accuracy.textContent = `${accuracy}%`;
  elements.paint.missing.textContent = missing;
  elements.paint.extra.textContent = extra;
  elements.paint.feedback.textContent =
    accuracy === 100 && extra === 0 ? "完璧です！" : "不足・余分を確認して調整しましょう。";
  
  elements.paint.viewToggle.style.display = "flex";
};

const buildLegend = () => {
  const levels = [
    { label: "Lv8 UTG Strong", color: "var(--rank-8)" },
    { label: "Lv7 UTG Mid", color: "var(--rank-7)" },
    { label: "Lv6 UTG Weak", color: "var(--rank-6)" },
    { label: "Lv5 LJ/HJ", color: "var(--rank-5)" },
    { label: "Lv4 CO", color: "var(--rank-4)" },
    { label: "Lv3 BTN", color: "var(--rank-3)" },
    { label: "Lv2 SB Open", color: "var(--rank-2-bg)" },
    { label: "Lv1 BB Defense", color: "var(--rank-1)" },
    { label: "Lv0 Fold", color: "var(--rank-0)" }
  ];
  elements.paint.legend.innerHTML = "";
  levels.forEach((item) => {
    const row = document.createElement("div");
    row.className = "legend-item";
    const swatch = document.createElement("div");
    swatch.className = "legend-swatch";
    swatch.style.background = item.color;
    if (item.label.includes("Lv3")) swatch.style.border = "2px solid #000000";
    if (item.label.includes("Lv2")) swatch.style.border = `3px solid var(--rank-2-border)`;
    row.appendChild(swatch);
    row.appendChild(document.createTextNode(item.label));
    elements.paint.legend.appendChild(row);
  });
};

document.addEventListener("click", (event) => {
  const openBtn = event.target.closest("[data-open-answer]");
  if (openBtn) {
    if (state.open.locked) return;
    const answer = openBtn.dataset.openAnswer;
    const correct = judgeOpenRaise(state.open.currentHand, state.open.currentPos, state.mode, state.open.tableSize);
    const isCorrect = answer === correct;
    state.open.total += 1;
    if (isCorrect) {
      state.open.correct += 1;
      state.open.streak += 1;
      updateBestScore("open", state.open.streak);
      elements.open.feedback.textContent = "正解！";
    } else {
      state.open.streak = 0;
      elements.open.feedback.textContent = `不正解。正解は ${correct}`;
    }
    updateStats("open");
    
    // Show correct range
    const correctRange = getCorrectRangeForPosition(state.open.currentPos, state.mode, state.open.tableSize);
    buildMiniRangeGrid(elements.open.rangeGrid, correctRange);
    elements.open.answerRange.style.display = "block";
    elements.open.next.style.display = "block";
    state.open.locked = true;
    Array.from(document.querySelectorAll("#panel-open [data-open-answer]")).forEach((btn) => (btn.disabled = true));
    return;
  }

  const actionBtn = event.target.closest("[data-action-answer]");
  if (actionBtn) {
    if (state.action.locked) return;
    const answer = actionBtn.dataset.actionAnswer;
    const correct = judgeActionDecision(
      state.action.currentHand,
      state.action.heroPos,
      state.action.oppPos,
      state.mode
    );
    const isCorrect = answer === correct;
    state.action.total += 1;
    if (isCorrect) {
      state.action.correct += 1;
      state.action.streak += 1;
      updateBestScore("action", state.action.streak);
      elements.action.feedback.textContent = "正解！";
    } else {
      state.action.streak = 0;
      elements.action.feedback.textContent = `不正解。正解は ${correct}`;
    }
    updateStats("action");
    
    // Show reason
    const reason = getActionDecisionReason(state.action.heroPos, state.action.oppPos, state.mode, state.action.tableSize);
    elements.action.reason.textContent = reason;
    elements.action.reason.style.display = "block";
    
    // Show correct range
    const correctRange = getCorrectRangeForAction(state.action.heroPos, state.action.oppPos, state.mode, state.action.tableSize);
    elements.action.rangeHero.textContent = state.action.heroPos;
    elements.action.rangeOpp.textContent = state.action.oppPos;
    buildMiniRangeGrid(elements.action.rangeGrid, correctRange);
    elements.action.answerRange.style.display = "block";
    elements.action.next.style.display = "block";
    state.action.locked = true;
    Array.from(document.querySelectorAll("#panel-action [data-action-answer]")).forEach((btn) => (btn.disabled = true));
    return;
  }

  const cell = event.target.closest(".range-cell");
  if (cell && !state.paintShowCorrect) {
    const hand = cell.dataset.hand;
    if (state.paintSelection.has(hand)) {
      state.paintSelection.delete(hand);
    } else {
      state.paintSelection.add(hand);
    }
    cell.classList.toggle("selected");
    savePaintSelection();
  }
});

elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
});

elements.modeToggle.addEventListener("change", (event) => {
  setMode(event.target.checked ? "ring" : "tournament");
  setPaintPositionOptions();
  loadPaintSelection();
  // モード切替時に、クイズ表示/正解レンジ表示も必ず更新する
  nextOpenQuestion();
  nextActionQuestion();

  // Range Painting も表示状態をリセット（正解表示ONのままにしない）
  elements.paint.viewToggle.style.display = "none";
  state.paintShowCorrect = false;
  elements.paint.showCorrect.checked = false;
  syncPaintSelectionUI();
});

elements.open.tableSize.addEventListener("change", (event) => {
  state.open.tableSize = parseInt(event.target.value);
  setFixedPosOptions(elements.open.fixPos, state.open.tableSize, true);
  const validPositions = getPositionsByTableSize(state.open.tableSize).filter((p) => p !== "BB");
  if (!validPositions.includes(state.open.fixPos)) {
    state.open.fixPos = validPositions[0];
    storage.save("yoko-range-trainer:open:fixPos", state.open.fixPos);
  }
  elements.open.fixPos.value = state.open.fixPos;
  nextOpenQuestion();
});

elements.action.tableSize.addEventListener("change", (event) => {
  state.action.tableSize = parseInt(event.target.value);
  setFixedPosOptions(elements.action.fixPos, state.action.tableSize);
  if (!getPositionsByTableSize(state.action.tableSize).includes(state.action.fixPos)) {
    state.action.fixPos = getPositionsByTableSize(state.action.tableSize)[0];
    storage.save("yoko-range-trainer:action:fixPos", state.action.fixPos);
  }
  elements.action.fixPos.value = state.action.fixPos;
  nextActionQuestion();
});

elements.open.next.addEventListener("click", nextOpenQuestion);
elements.action.next.addEventListener("click", nextActionQuestion);

// Open: 自分ポジション固定
elements.open.fixPosEnabled.checked = !!state.open.fixPosEnabled;
elements.open.fixPosEnabled.addEventListener("change", (event) => {
  state.open.fixPosEnabled = event.target.checked;
  storage.save("yoko-range-trainer:open:fixPosEnabled", state.open.fixPosEnabled);
  nextOpenQuestion();
});
elements.open.fixPos.addEventListener("change", (event) => {
  state.open.fixPos = event.target.value;
  storage.save("yoko-range-trainer:open:fixPos", state.open.fixPos);
  if (state.open.fixPosEnabled) nextOpenQuestion();
});

// Action: 自分ポジション固定
elements.action.fixPosEnabled.checked = !!state.action.fixPosEnabled;
elements.action.fixPosEnabled.addEventListener("change", (event) => {
  state.action.fixPosEnabled = event.target.checked;
  storage.save("yoko-range-trainer:action:fixPosEnabled", state.action.fixPosEnabled);
  nextActionQuestion();
});
elements.action.fixPos.addEventListener("change", (event) => {
  state.action.fixPos = event.target.value;
  storage.save("yoko-range-trainer:action:fixPos", state.action.fixPos);
  if (state.action.fixPosEnabled) nextActionQuestion();
});

elements.paint.position.value = state.paintPosition;
// paint: テーブル人数に応じてポジション候補を変える
elements.paint.tableSize.value = String(state.paintTableSize);
elements.paint.tableSize.addEventListener("change", (event) => {
  state.paintTableSize = parseInt(event.target.value);
  storage.save("yoko-range-trainer:paintTableSize", state.paintTableSize);
  setPaintPositionOptions();
  loadPaintSelection();
  elements.paint.viewToggle.style.display = "none";
  state.paintShowCorrect = false;
  elements.paint.showCorrect.checked = false;
});

elements.paint.position.addEventListener("change", (event) => {
  state.paintPosition = event.target.value;
  storage.save("yoko-range-trainer:paintPosition", state.paintPosition);
  loadPaintSelection();
  elements.paint.viewToggle.style.display = "none";
  state.paintShowCorrect = false;
  elements.paint.showCorrect.checked = false;
});

elements.paint.showCorrect.addEventListener("change", (event) => {
  state.paintShowCorrect = event.target.checked;
  syncPaintSelectionUI();
});

elements.paint.check.addEventListener("click", evaluatePaint);
elements.paint.clear.addEventListener("click", () => {
  state.paintSelection.clear();
  savePaintSelection();
  syncPaintSelectionUI();
  elements.paint.feedback.textContent = "";
  elements.paint.accuracy.textContent = "0%";
  elements.paint.missing.textContent = "0";
  elements.paint.extra.textContent = "0";
  elements.paint.viewToggle.style.display = "none";
  state.paintShowCorrect = false;
  elements.paint.showCorrect.checked = false;
});

const init = () => {
  buildRangeGrid();
  buildLegend();
  setMode(state.mode);
  setPaintPositionOptions();
  // fixed position selects
  setFixedPosOptions(elements.open.fixPos, state.open.tableSize, true);
  setFixedPosOptions(elements.action.fixPos, state.action.tableSize);
  const validOpenPositions = getPositionsByTableSize(state.open.tableSize).filter((p) => p !== "BB");
  if (!validOpenPositions.includes(state.open.fixPos)) {
    state.open.fixPos = validOpenPositions[0];
    storage.save("yoko-range-trainer:open:fixPos", state.open.fixPos);
  }
  if (!getPositionsByTableSize(state.action.tableSize).includes(state.action.fixPos)) {
    state.action.fixPos = getPositionsByTableSize(state.action.tableSize)[0];
    storage.save("yoko-range-trainer:action:fixPos", state.action.fixPos);
  }
  elements.open.fixPos.value = state.open.fixPos;
  elements.action.fixPos.value = state.action.fixPos;
  nextOpenQuestion();
  nextActionQuestion();
  loadPaintSelection();
  updateStats("open");
  updateStats("action");
};

init();
