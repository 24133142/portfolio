
// ========================================
// FIND YOUR ART 診断
// ========================================

// 質問データ
const questions = [

  {
    q: "旅に出るなら、どんな場所へ？",
    a: [
      "静かな森",
      "にぎやかな街",
      "不思議な世界",
      "知らない土地"
    ]
  },

  {
    q: "どんなものに心が動く？",
    a: [
      "色や形",
      "新しい技術",
      "物語",
      "手ざわり"
    ]
  },

  {
    q: "好きな時間の過ごし方は？",
    a: [
      "絵を見る",
      "ものを作る",
      "ゲームで遊ぶ",
      "散歩する"
    ]
  },

  {
    q: "作品に求めるものは？",
    a: [
      "美しさ",
      "驚き",
      "楽しさ",
      "温かさ"
    ]
  },

  {
    q: "最後に、気になる言葉は？",
    a: [
      "発見",
      "挑戦",
      "想像",
      "記憶"
    ]
  }

];

// ========================================
// 診断の状態
// ========================================

let step = 0;
let choice = -1;
let answers = [];

const root = document.getElementById("quiz-content");

// HTML要素を作成する補助関数
function el(tag, className, text) {

  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

// ========================================
// 診断画面を表示
// ========================================

function renderQuiz() {

  root.replaceChildren();

  // ======================================
  // 5問回答後：診断結果
  // ======================================

  if (step >= questions.length) {

    // 現在は仮の判定方式
    const total = answers.reduce(
      (sum, answer) => sum + answer,
      0
    );

    const index = total % window.works.length;
    const work = window.works[index];

    const wrap = el("div", "result");

    const label = el(
      "p",
      "",
      "あなたにおすすめの作品"
    );

    const cover = el(
      "div",
      "result-image",
      "PROJECT IMAGE"
    );

    cover.style.background = work.colors[0];

    // 画像が登録されている場合
    if (work.images[0]) {

      cover.textContent = "";

      const img = el("img");

      img.src = work.images[0];
      img.alt = work.title;

      img.style.cssText =
        "width:100%;height:100%;object-fit:contain";

      cover.append(img);
    }

    const title = el(
      "h2",
      "en",
      work.title
    );

    const category = el(
      "p",
      "",
      work.category
    );

    const view = el(
      "button",
      "next",
      "VIEW WORK →"
    );

    const retry = el(
      "button",
      "secondary-link",
      "もう一度診断する"
    );

    // 作品詳細を開く
    view.onclick = () => {
      window.openWorkModal(index);
    };

    // 最初からやり直す
    retry.onclick = () => {

      step = 0;
      choice = -1;
      answers = [];

      renderQuiz();
    };

    wrap.append(
      label,
      cover,
      title,
      category,
      view,
      el("br"),
      retry
    );

    root.append(wrap);

    return;
  }

  // ======================================
  // 質問画面
  // ======================================

  const questionData = questions[step];

  // 進捗表示
  const progress = el("div", "progress");

  progress.append(
    el(
      "span",
      "current",
      String(step + 1).padStart(2, "0")
    ),
    el("span", "line"),
    el(
      "span",
      "",
      String(questions.length).padStart(2, "0")
    )
  );

  // 質問文
  const question = el(
    "h2",
    "question",
    questionData.q
  );

  // 選択肢
  const choices = el("div", "choices");

  // NEXTボタン
  const next = el(
    "button",
    "next",
    "NEXT ➜"
  );

  next.disabled = true;

  // ======================================
  // 選択肢を作成
  // ======================================

  questionData.a.forEach((answer, index) => {

    const button = el("button", "choice");

    const letter = el(
      "strong",
      "en",
      "ABCD"[index]
    );

    const text = el(
      "span",
      "",
      answer
    );

    button.append(letter, text);

    button.onclick = () => {

      choice = index;

      // 選択したボタンの色を変更
      choices.querySelectorAll("button").forEach(
        (node, i) => {

          node.classList.toggle(
            "selected",
            i === index
          );

        }
      );

      next.disabled = false;
    };

    choices.append(button);
  });

  // ======================================
  // 次の質問へ
  // ======================================

  next.onclick = () => {

    if (choice < 0) return;

    answers.push(choice);

    step++;
    choice = -1;

    renderQuiz();
  };

  root.append(
    progress,
    question,
    choices,
    next
  );
}

// 初期表示
renderQuiz();
