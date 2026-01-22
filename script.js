let questions = [];
let current = 0;
let answers = [];

const quizEl = document.getElementById("quiz");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultEl = document.getElementById("result");

const fallback = [
  {
    text: "¿Cuál es la capital de Francia?",
    choices: ["París", "Londres", "Berlín", "Madrid"],
    answer: 0,
  },
  { text: "¿Cuánto es 2 + 2?", choices: ["3", "4", "5", "22"], answer: 1 },
  {
    text: "¿Qué planeta es conocido como el planeta rojo?",
    choices: ["Venus", "Tierra", "Marte", "Júpiter"],
    answer: 2,
  },
  {
    text: "¿Cuál de estas es un lenguaje de programación?",
    choices: ["HTML", "CSS", "Python", "HTTP"],
    answer: 2,
  },
  {
    text: "¿Cuál es el océano más grande?",
    choices: ["Atlántico", "Índico", "Ártico", "Pacífico"],
    answer: 3,
  },
];

function getBasePath() {
  try {
    const p = location.pathname || "/";
    if (p.indexOf("/quiz/quiz") === 0) return "/quiz/quiz";
    if (p.indexOf("/quiz") === 0) return "/quiz";
  } catch (e) {}
  return "";
}

function getTopic() {
  try {
    const url = new URL(location.href);
    let topic =
      url.searchParams.get("topic") ||
      (location.hash ? location.hash.slice(1) : null);
    if (!topic) {
      const p = location.pathname.replace(/^\/+|\/+$/g, "");
      if (p && !/index\.html$/i.test(p)) topic = p.split("/")[0];
    }
    if (!topic) return null;
    topic = String(topic)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    return topic || null;
  } catch (e) {
    return null;
  }
}

function loadQuestions() {
  const base = getBasePath();
  const topic = getTopic();
  const files = topic
    ? [`questions-${topic}.json`, "questions.json"]
    : ["questions.json"];

  const tryFetch = (i) => {
    if (i >= files.length) {
      console.warn(
        "No se pudo cargar ningún archivo de preguntas — usando fallback interno.",
      );
      questions = fallback;
      startQuiz();
      return;
    }
    const path = base ? `${base}/${files[i]}` : files[i];
    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error("no ok");
        return r.json();
      })
      .then((data) => {
        questions = data;
        startQuiz();
      })
      .catch(() => tryFetch(i + 1));
  };

  tryFetch(0);
}

function startQuiz() {
  answers = new Array(questions.length).fill(null);
  render();
  updateButtons();
}

function render() {
  const q = questions[current];
  if (!q) return;
  const html = [];
  html.push(
    `<div class="question"><strong>Pregunta ${current + 1} de ${questions.length}:</strong> <div>${escapeHtml(q.text)}</div></div>`,
  );
  html.push('<ul class="choices">');
  q.choices.forEach((c, i) => {
    const checked = answers[current] === i ? "checked" : "";
    html.push(
      `<li class="choice"><label><input type="radio" name="choice" value="${i}" ${checked}> ${escapeHtml(c)}</label></li>`,
    );
  });
  html.push("</ul>");
  quizEl.innerHTML = html.join("\n");

  const inputs = quizEl.querySelectorAll("input[name=choice]");
  inputs.forEach((inp) =>
    inp.addEventListener("change", (e) => {
      answers[current] = Number(e.target.value);
      updateButtons();
    }),
  );
}

function updateButtons() {
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === questions.length - 1;
  submitBtn.disabled = answers.every((a) => a === null);
}

prevBtn.addEventListener("click", () => {
  if (current > 0) {
    current--;
    render();
    updateButtons();
  }
});
nextBtn.addEventListener("click", () => {
  if (current < questions.length - 1) {
    current++;
    render();
    updateButtons();
  }
});

submitBtn.addEventListener("click", () => {
  let correct = 0;
  const details = questions.map((q, i) => {
    const user = answers[i];
    const ok = user === q.answer;
    if (ok) correct++;
    return { i, ok, user, correctIndex: q.answer };
  });
  const percent = Math.round((correct / questions.length) * 100);
  resultEl.innerHTML =
    `<strong>Resultado:</strong> ${correct}/${questions.length} (${percent}%)` +
    renderDetails(details);
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  submitBtn.disabled = true;
});

function renderDetails(details) {
  const out = ['<div style="margin-top:10px">', "<ol>"];
  details.forEach((d) => {
    const q = questions[d.i];
    const userText =
      d.user === null
        ? "<em>No respondida</em>"
        : escapeHtml(q.choices[d.user]);
    const correctText = escapeHtml(q.choices[d.correctIndex]);
    out.push(
      `<li><div><strong>${escapeHtml(q.text)}</strong></div><div>Tu respuesta: ${userText} — ${d.ok ? '<span style="color:green">✔</span>' : '<span style="color:crimson">✖</span>'} (Correcta: ${correctText})</div></li>`,
    );
  });
  out.push("</ol>", "</div>");
  return out.join("\n");
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// Inicializar
loadQuestions();
