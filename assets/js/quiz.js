// Quiz page: fetches questions from the Open Trivia DB, runs the timer,
// checks answers and saves the result.

const API_URL = "https://opentdb.com/api.php";

const startScreen = document.querySelector(".start-screen"),
  quizScreen = document.querySelector(".quiz"),
  endScreen = document.querySelector(".end-screen");

const numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  startMessage = document.querySelector("#start-message");

const startBtn = document.querySelector(".start"),
  submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next"),
  restartBtn = document.querySelector(".restart");

const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

const questionNumber = document.querySelector(".number"),
  questionText = document.querySelector(".question"),
  answersWrapper = document.querySelector(".answer-wrapper");

const finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score"),
  scoreText = document.querySelector(".score-text");

let questions = [],
  currentIndex = 0,
  score = 0,
  duration = 30, // seconds per question
  remaining = 0,
  timer = null,
  loadingInterval = null;

// An error with a message that is safe to show to the player.
class QuizError extends Error {}

// The API returns HTML-encoded text (e.g. &quot; and &#039;). Decode it once so
// answers can be compared as plain strings and rendered with textContent.
const decodeHtml = (html) =>
  new DOMParser().parseFromString(html, "text/html").documentElement.textContent;

// Fisher-Yates shuffle
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// ---------- Start screen ----------

const showStartMessage = (text) => {
  startMessage.textContent = text;
  startMessage.classList.toggle("hide", !text);
};

const setLoading = (loading) => {
  clearInterval(loadingInterval);
  startBtn.disabled = loading;
  if (!loading) {
    startBtn.textContent = "Start Quiz";
    return;
  }
  let dots = 0;
  startBtn.textContent = "Loading";
  loadingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    startBtn.textContent = "Loading" + ".".repeat(dots);
  }, 500);
};

const fetchQuestions = async () => {
  const params = new URLSearchParams({ amount: numQuestions.value, type: "multiple" });
  if (category.value) params.set("category", category.value);
  if (difficulty.value) params.set("difficulty", difficulty.value);

  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  // response_code 5 = rate limited (one request per 5 seconds per IP),
  // 1 = not enough questions for the requested filters.
  if (data.response_code === 5) {
    throw new QuizError("Too many requests. Please wait a few seconds and try again.");
  }
  if (data.response_code !== 0 || !data.results.length) {
    throw new QuizError(
      "Not enough questions for this selection. Try fewer questions or another category or difficulty."
    );
  }

  return data.results.map((q) => ({
    question: decodeHtml(q.question),
    correct: decodeHtml(q.correct_answer),
    answers: shuffle([q.correct_answer, ...q.incorrect_answers].map(decodeHtml)),
  }));
};

const startQuiz = async () => {
  showStartMessage("");
  setLoading(true);
  try {
    questions = await fetchQuestions();
    duration = Number(timePerQuestion.value);
    score = 0;
    currentIndex = 0;

    startScreen.classList.add("hide");
    quizScreen.classList.remove("hide");
    showQuestion();
  } catch (err) {
    showStartMessage(
      err instanceof QuizError
        ? err.message
        : "Could not load questions. Check your internet connection and try again."
    );
  } finally {
    setLoading(false);
  }
};

// ---------- Questions ----------

const showQuestion = () => {
  const q = questions[currentIndex];

  questionNumber.innerHTML = `Question <span class="current">${currentIndex + 1}</span> <span class="total">/${questions.length}</span>`;
  questionText.textContent = q.question;

  answersWrapper.innerHTML = "";
  q.answers.forEach((answer) => {
    const div = document.createElement("div");
    div.className = "answer";
    div.innerHTML = `<span class="text"></span><span class="checkbox"><i class="fas fa-check"></i></span>`;
    div.querySelector(".text").textContent = answer;
    div.addEventListener("click", () => selectAnswer(div));
    answersWrapper.appendChild(div);
  });

  submitBtn.disabled = true;
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
  startTimer();
};

const selectAnswer = (answerDiv) => {
  if (answerDiv.classList.contains("checked")) return; // already answered
  answersWrapper.querySelectorAll(".answer").forEach((a) => a.classList.remove("selected"));
  answerDiv.classList.add("selected");
  submitBtn.disabled = false;
};

const checkAnswer = () => {
  clearInterval(timer);
  const q = questions[currentIndex];
  const selected = answersWrapper.querySelector(".answer.selected");

  if (selected) {
    if (selected.querySelector(".text").textContent === q.correct) {
      score++;
    } else {
      selected.classList.add("wrong");
    }
  }
  answersWrapper.querySelectorAll(".answer").forEach((a) => {
    if (a.querySelector(".text").textContent === q.correct) a.classList.add("correct");
    a.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
};

// ---------- Timer ----------

const startTimer = () => {
  clearInterval(timer);
  remaining = duration;
  updateProgress(true);
  timer = setInterval(() => {
    remaining--;
    updateProgress();
    if (remaining > 0 && remaining <= 3) beep();
    if (remaining <= 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
};

// On reset the bar jumps straight back to full instead of sliding there.
const updateProgress = (reset = false) => {
  if (reset) progressBar.style.transition = "none";
  progressBar.style.width = `${(remaining / duration) * 100}%`;
  progressText.textContent = remaining;
  if (reset) {
    progressBar.offsetWidth; // force reflow so later changes animate again
    progressBar.style.transition = "";
  }
};

// Short beep for the last three seconds, synthesised so no audio file is needed.
let audioCtx = null;
const beep = () => {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) {
    // Sound is optional; ignore browsers that block it.
  }
};

// ---------- End screen ----------

const showScore = () => {
  quizScreen.classList.add("hide");
  endScreen.classList.remove("hide");

  const total = questions.length;
  const percent = Math.round((score / total) * 100);
  finalScore.textContent = score;
  totalScore.textContent = `/ ${total}`;
  scoreText.textContent =
    percent >= 80 ? "Excellent!" : percent >= 50 ? "Great job!" : "Keep practicing!";

  Store.addScore({
    name: Store.getLoggedInUser() || "Guest",
    email: Store.getLoggedInEmail() || null,
    score: `${score}/${total}`,
    correct: score,
    total,
    category: category.value ? category.options[category.selectedIndex].text : "Any Category",
    difficulty: difficulty.value || "any",
    date: new Date().toISOString(),
  });
};

// ---------- Events ----------

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", () => window.location.reload());

// ---------- Greeting and Login/Logout link ----------

const greetingDiv = document.getElementById("greeting");
const authLink = document.getElementById("auth-link");
const loggedInUser = Store.getLoggedInUser();

if (loggedInUser) {
  greetingDiv.textContent = `Hello, ${loggedInUser}!`;
  authLink.textContent = "Logout";
  authLink.addEventListener("click", (e) => {
    e.preventDefault();
    Store.logout();
    window.location.href = "login.html";
  });
} else {
  greetingDiv.textContent = "Playing as a guest. Log in to keep your scores on your account.";
  authLink.textContent = "Login";
}
