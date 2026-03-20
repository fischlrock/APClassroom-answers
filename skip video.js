/* 
// subtitle link
https://fast.wistia.net/embed/captions/VIDEOID_APD.vtt?language=eng

run get assigment info.js
filter dev console output to include debug
look for the Object with the title of the video assignment you want to complete

Good luck for the rest

*/
async function completeVideo(videoId) {
  const duration = Number(prompt("Enter the video's duration in seconds"));
  const progress = new Array(Math.ceil(duration)).fill(1);
  await fetch("https://apc-api-production.collegeboard.org/fym/graphql", {
    "credentials": "include",
    "headers": {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Bearer ${window.localStorage.account_access_token}`,
    },
    "body": JSON.stringify({
      "query":
        "mutation StoreDailyVideoProgressMutation($userId: Int!, $cbPersonid: String!, $videoId: Int!, $status: String!, $progress: String!, $watchedPercentage: String!, $playTimePercentage: String) {\n  storeDailyVideoProgress(\n    userId: $userId\n    videoId: $videoId\n    status: $status\n    cbPersonid: $cbPersonid\n    progress: $progress\n    watchedPercentage: $watchedPercentage\n    playTimePercentage: $playTimePercentage\n  ) {\n    ok\n    __typename\n  }\n}",
      "variables": {
        "userId": Number(window.current_user.initId),
        "progress": progress,
        "videoId": videoId,
        "status": "COMPLETE",
        "cbPersonid": Number(window.current_user.importId),
        "watchedPercentage": "1.0",
        "playTimePercentage": "1.0",
      },
      "operationName": "StoreDailyVideoProgressMutation",
    }),
    "method": "POST",
    "mode": "cors",
  });
}

var videoIds = [];

videoIds.forEach((videoId) => {
  console.log(videoId);
  completeVideo(videoId);
});
