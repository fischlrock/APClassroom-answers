// ==UserScript==
// @name        QOL Features
// @namespace   https://github.com/fischlrock/APClassroom-answers
// @match       https://apclassroom.collegeboard.org/*/assessments/assignments*
// @icon        https://apclassroom.collegeboard.org/external/images/favicon_0.ico
// @grant       none
// @version     1.0
// @author      -
// @description	-
// @updateURL   https://github.com/fischlrock/APClassroom-answers/raw/refs/heads/main/qol.user.js
// @downloadURL https://github.com/fischlrock/APClassroom-answers/raw/refs/heads/main/qol.user.js
// @supportURL  https://github.com/fischlrock/APClassroom-answers/issues
// ==/UserScript==
window.addEventListener("keydown", (event) => {
  let buttons = {};
  Array.from(document.querySelectorAll(".bg-bluebook-blue")).map((elem) => {
    buttons[elem.textContent.toLowerCase()] = elem;
  });
  if (buttons.back && event.key == "ArrowLeft") {
    buttons.back.click();
  } else if (buttons.next && event.key == "ArrowRight") {
    buttons.next.click();
  }
});
