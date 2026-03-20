// ==UserScript==
// @name        Collegeboard Answers + QOL
// @namespace   https://github.com/fischlrock/APClassroom-answers
// @match       https://apclassroom.collegeboard.org/*/assessments/assignments*
// @match       https://items-va.learnosity.com/*
// @grant       none
// @version     1.0
// @author      -
// @description -
// @icon        https://apclassroom.collegeboard.org/external/images/favicon_0.ico
// @run-at      document-start
// @updateURL   https://github.com/fischlrock/APClassroom-answers/raw/refs/heads/main/aio.user.js
// @downloadURL https://github.com/fischlrock/APClassroom-answers/raw/refs/heads/main/aio.user.js
// @supportURL  https://github.com/fischlrock/APClassroom-answers/issues
// ==/UserScript==

let answers = {};
let parsedActivity = {};

function parseActivityJSON(activityJSON) {
  const items = activityJSON?.data?.apiActivity?.items || [];
  let transformed_data = {};
  for (const item of items) {
    let questionsArray = [];
    item.questions.forEach((question) => {
      questionsArray.push({
        stimulus: question.stimulus,
        options: question.options,
        custom_distractor_rationale_response_level: question.metadata.custom_distractor_rationale_response_level,
        valid_response: question.validation.valid_response,
      });
    });
    transformed_data[item.reference] = {
      questions: questionsArray,
      features: item.features,
    };
  }
  return transformed_data;
}

function getCurrentQuestionDiv() {
  const elements = document.querySelectorAll(".item-is-loaded");
  return Array.from(elements).find((el) => {
    const style = window.getComputedStyle(el);
    return (
      style.zIndex === "10" &&
      style.opacity === "1" &&
      style.position === "relative" &&
      style.overflow === "visible" &&
      style.visibility === "visible"
    );
  });
}

function clickAnswer() {
  const questionDiv = getCurrentQuestionDiv();
  if (!questionDiv) return;

  const questionId = questionDiv.getAttribute("data-reference");
  console.debug(questionId);
  const value = answers[questionId]?.[0] || answers[questionId];
  if (!value) {
    console.debug("Question Id not found in answers:", questionId);
    return;
  }
  console.debug(parsedActivity[questionId]);

  const inputs = questionDiv.getElementsByClassName("lrn-input");
  let clicked = false;
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value === value) {
      inputs[i].click();
      clicked = true;
    }
  }
  return clicked;
}

window.addEventListener("keydown", (e) => {
  let buttons = {};
  buttons["check"] = document.querySelector(".h-16");
  Array.from(document.querySelectorAll(".bg-bluebook-blue")).map((elem) => {
    buttons[elem.textContent.toLowerCase()] = elem;
  });
  if (e.altKey && !e.shiftKey && (e.key == "`" || e.code == "Backquote")) {
    clickAnswer();
  }
  if (e.altKey && e.shiftKey && (e.key == "`" || e.code == "Backquote")) {
    clickAnswer();
    setTimeout(() => {
      if (buttons.check) {
        buttons.check.click();
      }
      setTimeout(() => {
        if (buttons.next) {
          buttons.next.click();
        }
      }, 100);
    }, 100);
  }
  if (buttons.back && e.key == "ArrowLeft") {
    buttons.back.click();
  } else if (buttons.next && e.key == "ArrowRight") {
    buttons.next.click();
  }
});

const TARGET = "/activity";

XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype._send = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function (...args) {
  this._url = args[1];
  return XMLHttpRequest.prototype._open.call(this, ...args);
};

XMLHttpRequest.prototype.send = function (body) {
  if (this._url && this._url.includes(TARGET)) {
    this.addEventListener("load", function () {
      try {
        const activityJSON = JSON.parse(this.responseText);

        window.parent.postMessage({ type: "learnosity-answers", data: activityJSON }, "*");
      } catch (err) {
        console.debug("Failed parsing activity JSON:", err);
      }
    });
  }
  return XMLHttpRequest.prototype._send.call(this, body);
};

window.addEventListener("message", (e) => {
  if (e.data?.type === "learnosity-answers") {
    let activityJSON = e.data.data;
    console.debug(activityJSON);
    const items = activityJSON?.data?.apiActivity?.items || [];

    const ans = {};
    parsedActivity = parseActivityJSON(activityJSON);
    console.debug("Parsed Activity", parsedActivity);

    for (const item of items) {
      for (const q of item.questions || []) {
        const ref = q.metadata?.sheet_reference;
        const val = q.validation?.valid_response?.value;
        if (ref && val) ans[ref] = val;
      }
    }
    answers = ans;
    console.debug("Learnosity answers loaded:", answers);
  }
});
