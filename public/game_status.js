const allSteps = document.querySelectorAll(".game_status_list li");

const waitingPhase = allSteps[0];
const drawPhase = allSteps[1];
const answerPhase = allSteps[2];

function changeGameStatus(phase) {
  allSteps.forEach((step) => {
    step.classList.add("disabled");
  });
  phase.classList.remove("disabled");
}

function setTimer(phase, time) {
  const timer = phase.querySelector("span");
  timer.innerHTML = time;
}
