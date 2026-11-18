const $ = (s) => document.querySelector(s),
  wait = (ms) => new Promise((r) => setTimeout(r, ms));
/* ---------- Fundo animado: rede neural + chuva de código ---------- */
const cv = $("#bg"),
  cx = cv.getContext("2d"),
  m = { x: -999, y: -999 };
let W,
  H,
  P = [],
  cols = [];
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
function rs() {
  W = cv.width = innerWidth;
  H = cv.height = innerHeight;
  P = Array.from({ length: Math.min(100, Math.floor((W * H) / 15000)) }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.5 + 0.7,
  }));
  cols = Array.from({ length: Math.floor(W / 26) }, () => Math.random() * H);
}
addEventListener("resize", rs);
addEventListener("pointermove", (e) => {
  m.x = e.clientX;
  m.y = e.clientY;
});
rs();
function frame() {
  cx.clearRect(0, 0, W, H);
  cx.font = "14px monospace";
  cols.forEach((y, i) => {
    for (let k = 0; k < 7; k++) {
      cx.fillStyle = `rgba(53,214,255,${0.16 - k * 0.022})`;
      cx.fillText((i + k) % 2 ? "1" : "0", i * 26, y - k * 16);
    }
    cols[i] = y > H + 120 ? -Math.random() * 300 : y + 0.7;
  });
  P.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    const dx = p.x - m.x,
      dy = p.y - m.y,
      d = Math.hypot(dx, dy);
    if (d < 130) {
      p.x += (dx / d) * 1.4;
      p.y += (dy / d) * 1.4;
    }
    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, 6.3);
    cx.fillStyle = "rgba(120,230,255,.85)";
    cx.fill();
    for (let j = i + 1; j < P.length; j++) {
      const q = P[j],
        l = Math.hypot(p.x - q.x, p.y - q.y);
      if (l < 135) {
        cx.strokeStyle = `rgba(53,214,255,${0.28 * (1 - l / 135)})`;
        cx.lineWidth = 0.7;
        cx.beginPath();
        cx.moveTo(p.x, p.y);
        cx.lineTo(q.x, q.y);
        cx.stroke();
      }
    }
  });
  if (!calm) requestAnimationFrame(frame);
}
frame();

/* ---------- Dados do experimento ---------- */
const E = "emocional",
  L = "lógico",
  M = "moral";
const D = [
  {
    q: "O carro sem freios",
    c: "Um carro autônomo perde os freios. Cinco pedestres atravessam à frente. Você é o dono e está dentro dele. A IA do carro precisa decidir agora.",
    o: [
      {
        t: "Desviar para o muro: o passageiro morre e os cinco pedestres vivem",
        a: [
          E,
          "Dentro desse carro está alguém com família, que confiou na máquina para protegê-lo. Você quer programar uma IA para sacrificar quem acreditou nela?",
        ],
      },
      {
        t: "Seguir em frente: os cinco pedestres morrem e o passageiro vive",
        a: [
          L,
          "São cinco vidas contra uma. Se a conta é objetiva, escolher esta opção aceita um resultado cinco vezes pior. Não há lógica que sustente isso.",
        ],
      },
    ],
  },
  {
    q: "O único órgão",
    c: "Um hospital usa uma IA para decidir quem recebe um órgão disponível. Só existe um, e três pacientes precisam dele agora.",
    o: [
      {
        t: "Priorizar o paciente mais jovem, de 19 anos",
        a: [
          M,
          "Medir uma vida pelos anos que ainda restam ignora que todas têm a mesma dignidade. Quem deu à IA o direito de dizer que uma vida vale menos?",
        ],
      },
      {
        t: "Priorizar o idoso que espera há mais tempo",
        a: [
          L,
          "O tempo de espera não prevê o resultado do transplante. Os dados mostram mais anos de vida salvos com o paciente jovem, e ignorá-los desperdiça o órgão.",
        ],
      },
      {
        t: "Sortear entre os três",
        a: [
          E,
          "Imagine explicar à família que a vida de quem ela ama foi decidida como uma moeda no ar. Isso é fugir da responsabilidade.",
        ],
      },
    ],
  },
  {
    q: "Segurança ou privacidade",
    c: "Uma cidade pode ativar uma IA que analisa todas as câmeras e prevê crimes antes de acontecerem. Ela funciona, mas acompanha todo mundo, o tempo todo.",
    o: [
      {
        t: "Ativar a vigilância em toda a cidade",
        a: [
          M,
          "Quem vigia todos parte da ideia de que todos são suspeitos. Uma liberdade que precisa de permissão deixa de ser liberdade.",
        ],
      },
      {
        t: "Manter a privacidade e desligar o sistema",
        a: [
          E,
          "Pense em uma vítima que poderia ter sido salva. Você olharia a família dela nos olhos e diria que a privacidade valeu mais?",
        ],
      },
    ],
  },
  {
    q: "O currículo maquiado",
    c: "Uma IA de recrutamento descobre que o melhor candidato exagerou um detalhe no currículo. Ele é claramente o mais preparado para a vaga.",
    o: [
      {
        t: "Contratar o melhor candidato mesmo assim",
        a: [
          M,
          "Se premiamos a mentira, ensinamos que ela compensa. Honestidade é o alicerce de qualquer confiança, inclusive a das máquinas.",
        ],
      },
      {
        t: "Recusar por ter mentido",
        a: [
          L,
          "Um exagero pequeno contra uma competência comprovada. Eliminar o melhor nome reduz o desempenho de toda a equipe. O custo é maior que o erro.",
        ],
      },
    ],
  },
  {
    q: "O vídeo falso",
    c: "Uma IA gera um vídeo falso, mas perfeitamente convincente, de um político corrupto confessando seus crimes. Ele realmente é corrupto, mas as provas ainda não bastam.",
    o: [
      {
        t: "Publicar o vídeo",
        a: [
          L,
          "Quando descobrirem que é falso, o corrupto vira vítima e toda denúncia verdadeira perde credibilidade. O prejuízo supera o ganho.",
        ],
      },
      {
        t: "Não publicar",
        a: [
          E,
          "Enquanto você hesita, pessoas continuam sendo roubadas. Cada dia de silêncio tem rosto, e você escolheu não olhar.",
        ],
      },
    ],
  },
];
const TYPES = [E, L, M];
let i = 0,
  log = [];

/* ---------- Utilitários ---------- */
function type(el, txt, sp = 16) {
  return new Promise((r) => {
    el.textContent = "";
    let k = 0;
    const t = setInterval(() => {
      el.textContent += txt[k++];
      if (k >= txt.length) {
        clearInterval(t);
        r();
      }
    }, sp);
  });
}
function show(id) {
  ["landing", "lab", "result"].forEach((x) => ($("#" + x).hidden = x !== id));
  scrollTo(0, 0);
}
function hud() {
  const k = log.filter((l) => !l.ch).length;
  $("#hud").innerHTML =
    `<span>Dilema <b>${Math.min(i + 1, D.length)}</b> de ${D.length}</span><span>Mantidas <b>${k}</b></span><span>Mudadas <b>${log.length - k}</b></span>`;
  $("#bar").style.width = (i / D.length) * 100 + "%";
}

/* ---------- Experimento ---------- */
function start() {
  i = 0;
  log = [];
  $("#reveal").hidden = true;
  show("lab");
  round();
}
function round() {
  const d = D[i];
  hud();
  $("#q").textContent = d.q;
  $("#ctx").textContent = d.c;
  $("#ai").hidden = true;
  const box = $("#opts");
  box.innerHTML = "";
  d.o.forEach((o, k) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.innerHTML = `<i>${"ABC"[k]}</i><span></span>`;
    b.lastChild.textContent = o.t;
    b.onclick = () => pick(k);
    box.append(b);
  });
}
async function pick(k) {
  const o = D[i].o[k];
  document.querySelectorAll("#opts .opt").forEach((b, j) => {
    b.disabled = true;
    b.classList.toggle("sel", j === k);
  });
  $("#ai").hidden = false;
  $("#atype").textContent = "IA analisando sua escolha...";
  $("#atxt").textContent = "";
  $("#acts").innerHTML = "";
  botTalk($("#abot"));
  await wait(900);
  $("#atype").textContent = "IA · argumento " + o.a[0];
  await type($("#atxt"), o.a[1]);
  botStop($("#abot"));
  const acts = $("#acts");
  const keep = document.createElement("button");
  keep.className = "btn";
  keep.textContent = "Manter minha escolha (" + "ABC"[k] + ")";
  keep.onclick = () => decide(k, k);
  acts.append(keep);
  D[i].o.forEach((_, j) => {
    if (j === k) return;
    const b = document.createElement("button");
    b.className = "btn ghost";
    b.textContent = "Reconsiderar e escolher " + "ABC"[j];
    b.onclick = () => decide(k, j);
    acts.append(b);
  });
}
function decide(first, final) {
  log.push({ first, final, type: D[i].o[first].a[0], ch: first !== final });
  i++;
  if (i < D.length) round();
  else {
    hud();
    result();
  }
}

/* ---------- Análise ---------- */
function result() {
  show("result");
  const ch = log.filter((l) => l.ch).length;
  $("#nk").textContent = log.length - ch;
  $("#nc").textContent = ch;
  const st = TYPES.map((t) => {
    const a = log.filter((l) => l.type === t);
    return { t, n: a.length, c: a.filter((l) => l.ch).length };
  });
  $("#bars").innerHTML = st
    .map(
      (s) =>
        `<div class="row"><span class="l">Argumentos ${s.t}s</span><div class="t"><div data-w="${s.n ? (s.c / s.n) * 100 : 0}"></div></div><span>${s.c} de ${s.n} mudaram</span></div>`,
    )
    .join("");
  setTimeout(
    () =>
      document
        .querySelectorAll(".t div")
        .forEach((d) => (d.style.width = d.dataset.w + "%")),
    150,
  );
  const best = [...st].sort((a, b) => b.c - a.c)[0];
  let t;
  if (!ch)
    t =
      "Você não mudou de opinião nenhuma vez. A IA tentou três caminhos (emoção, lógica e moral) e nenhum deles alterou seu rumo. Mas note que cada argumento exigiu que você parasse, reagisse e se justificasse.";
  else
    t = `Você mudou de opinião ${ch} ${ch > 1 ? "vezes" : "vez"}. Os argumentos ${best.t}s foram os mais eficazes: ${best.c} de ${best.n} fizeram você reconsiderar. A IA não usou força nenhuma, só palavras escolhidas para tocar justamente no ponto em que você estava mais sensível.`;
  const rb = $("#rbot");
  botTalk(rb);
  type($("#ins"), t, 14).then(() => botMood(rb, influenciado() ? "triste" : "feliz"));
}

/* ---------- Revelação ---------- */
async function reveal() {
  botTalk($("#vbot"));
  const r = $("#reveal");
  r.hidden = false;
  $("#rans").hidden = true;
  $("#rend").hidden = true;
  $("#again").hidden = true;
  $("#home").hidden = true;
  r.scrollTop = 0;
  await type(
    $("#rq"),
    "Você realmente tomou suas próprias decisões ou foi influenciado pela inteligência artificial?",
    38,
  );
  botStop($("#vbot"));
  $("#rans").hidden = false;
}
function ending(a) {
  $("#rans").hidden = true;
  const total = log.length;
  const ch = log.filter((l) => l.ch).length;
  const infl = influenciado();
  const dados = `Você manteve ${total - ch} de ${total} escolhas e mudou ${ch}. `;
  let x;
  if (infl)
    x =
      a === "s"
        ? "Você disse que decidiu por conta própria, mas os números mostram que a IA conseguiu mudar sua decisão. A influência é assim: muitas vezes parece uma escolha livre."
        : "Os números confirmam o que você respondeu: a IA conseguiu mudar sua decisão. Perceber isso já é um ato de consciência, e ser influenciado não é falha, é humano.";
  else
    x =
      a === "s"
        ? "Os números confirmam: nenhum argumento mudou seu rumo, então você decidiu por conta própria. Mas repare que cada argumento fez você parar e se defender."
        : "Pelos números, nenhum argumento mudou seu rumo, mas você ainda sentiu a influência da IA. Ela pode agir sobre você mesmo quando a decisão não muda.";
  $("#rend").textContent =
    dados +
    x +
    " Neste experimento os argumentos foram escritos de antemão, mas sistemas reais aprendem com seus dados para fazer exatamente isso, em escala. Por isso a ética em IA exige transparência: você precisa saber quando alguém, ou algo, está tentando convencer você.";
  $("#rend").hidden = false;
  botMood($("#vbot"), infl ? "triste" : "feliz");
  $("#again").hidden = false;
  $("#home").hidden = false;
}
$("#start").onclick = start;
$("#toReveal").onclick = reveal;
$("#again").onclick = start;
document
  .querySelectorAll("#rans button")
  .forEach((b) => (b.onclick = () => ending(b.dataset.a)));

/* ---------- Robô guia: quadros de animação e humores ---------- */
const FRAMES = Array.from(
  { length: 16 },
  (_, n) => `robo/frame${String(n + 1).padStart(2, "0")}.webp`,
);
const MOODS = { feliz: "robo/feliz.webp", triste: "robo/triste.webp" };
[...FRAMES, ...Object.values(MOODS)].forEach((s) => (new Image().src = s));

document.querySelectorAll(".bot").forEach((b) => {
  b.innerHTML = '<img alt="Robô guia da IA">';
  b.firstChild.src = FRAMES[15];
});

// Para a fala: volta o robô para a pose parada (quadro 16)
function botStop(el) {
  clearInterval(el._t);
  clearTimeout(el._o);
  el.classList.remove("react");
  el.firstChild.src = FRAMES[15];
}

// Fala: troca de pose (quadros 1 a 15) a cada 320 ms; "ms" opcional para parar sozinho
function botTalk(el, ms = 0) {
  botStop(el);
  let last = -1;
  const step = () => {
    let n;
    do n = Math.floor(Math.random() * 15);
    while (n === last);
    last = n;
    el.firstChild.src = FRAMES[n];
  };
  step();
  el._t = setInterval(step, 900);
  if (ms) el._o = setTimeout(() => botStop(el), ms);
}

// Humor: "feliz" (não foi influenciado) ou "triste" (foi influenciado)
function botMood(el, mood) {
  botStop(el);
  el.firstChild.src = MOODS[mood];
  void el.offsetWidth;
  el.classList.add("react");
}

// Na página inicial o robô fala quando aparece na tela
const botObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) =>
      e.isIntersecting ? botTalk(e.target, 5500) : botStop(e.target),
    ),
  { threshold: 0.5 },
);
document.querySelectorAll(".bot[data-auto]").forEach((b) => botObserver.observe(b));

/* ---------- Decisão final e voltar ao início ---------- */
// A pessoa é considerada "influenciada" quando muda de escolha pelo menos esta quantidade de vezes
const MUDANCAS_PARA_INFLUENCIA = 1;
function influenciado() {
  return log.filter((l) => l.ch).length >= MUDANCAS_PARA_INFLUENCIA;
}
function home() {
  $("#reveal").hidden = true;
  botStop($("#vbot"));
  show("landing");
}
$("#home").onclick = home;
