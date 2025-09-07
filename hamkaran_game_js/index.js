const teamsUrl = "http://localhost:3000/teams";
const scoreboardUrl = "http://localhost:3000/scoreboard";

const teamsContainer = document.querySelector(".teams");

let teams = [];
let players = [];

const calculateScore = (player) => {
  return player.kills * 100 + player.revives * 75 + player.assists * 50;
};

fetch(teamsUrl)
  .then((res) => res.json())
  .then((fetchedTeams) => {
    teams = fetchedTeams;
    teams.forEach((team) => {
      // جدول تیم‌ها ساخته میشه
      const teamDiv = document.createElement("div");
      teamDiv.className = "team";
      teamDiv.id = team.id; //<div id="t1" class="team">

      const teamTitle = document.createElement("h2");
      teamTitle.innerText = team.name;
      teamDiv.appendChild(teamTitle);

      const table = document.createElement("table");
      table.innerHTML = `
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Kills</th>
          <th>Assists</th>
          <th>Revives</th>
          <th>Deaths</th>
          <th>Score</th>
        </tr>
      `;
      teamDiv.appendChild(table);
      teamsContainer.appendChild(teamDiv);
    });

    //   باید fetch دوم (برای بازیکن‌ها) برگردونده بشه
    //  تا then بعدی منتظر بمونه و داده رو دریافت کنه
    return fetch(scoreboardUrl);
  })
  .then((res) => res.json())
  .then((fetchedPlayers) => {
    players = fetchedPlayers;
    // برای هر تیم، بازیکن‌های مربوط به همون تیم رو فیلتر می‌کنیم
    teams.forEach((team) => {
      const teamPlayers = players
        .filter((p) => p.team === team.id)
        .map((p) => ({ ...p, score: calculateScore(p) }))
        .sort((a, b) => b.score - a.score);
      const table = document.querySelector(`#${team.id} table`);
      teamPlayers.forEach((player, index) => {
        let rank =
          index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : index === 2
            ? "🥉"
            : index + 1;
        const row = document.createElement("tr");
        row.innerHTML = `<td>${rank}</td>
			<td>${player.name}</td>
			<td>${player.kills}</td>
			<td>${player.assists}</td>
			<td>${player.revives}</td>
			<td>${player.deaths}</td>
			<td>${player.score}</td>`;
        table.appendChild(row);
      });

      team.totalScore = teamPlayers.reduce((acc, p) => acc + p.score, 0);
    });

    const winnerTeam = teams.reduce((acc, t) =>
      acc.totalScore > t.totalScore ? acc : t
    );
    const status = document.querySelector(".status");
    status.innerText = `${winnerTeam.name} HasThe Upper Hand!`;
  });
