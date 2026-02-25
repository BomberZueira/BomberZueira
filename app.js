
const API = "http://localhost:5000";

let user;

async function login() {
  const username = document.getElementById("username").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ username })
  });

  user = await res.json();

  document.getElementById("login").style.display="none";
  document.getElementById("game").style.display="block";

  loadGame();
}

async function loadGame() {

  document.getElementById("balance").innerText =
    Math.floor(user.balance);

  const upgrades = await fetch(API + "/upgrades")
    .then(r=>r.json());

  const container = document.getElementById("upgrades");
  container.innerHTML="";

  upgrades.forEach(up => {

    const level = user.upgrades?.[up.id] || 0;
    const cost = up.baseCost * Math.pow(1.5, level);

    const div = document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <h3>${up.name}</h3>
      <p>Nível: ${level}</p>
      <p>Custo: ${Math.floor(cost)}</p>
      <button onclick="buy(${up.id})">
        Comprar
      </button>
    `;

    container.appendChild(div);
  });
}

async function buy(id) {

  const res = await fetch(API + "/upgrade", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      username:user.username,
      upgradeId:id
    })
  });

  user = await res.json();
  loadGame();
}
