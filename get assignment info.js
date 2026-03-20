/*
open dev console
go to network tab
filter for student_assignments
change NUMBER to whatever yours is
*/
await fetch(
  "https://apc-api-production.collegeboard.org/fym/assessments/api/chameleon/student_assignments/NUMBER",

  {
    "headers": {
      "Authorization": `Bearer ${window.localStorage.account_access_token}`,
    },
    "method": "GET",
  },
)
  .then((response) => response.json())
  .then((response) => {
    console.debug(response.assignments);
  });
