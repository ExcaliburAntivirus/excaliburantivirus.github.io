const abrirBtn = document.getElementById("abrir-popover-perfil");
const fecharBtn = document.getElementById("close-perfil-btn");
const popover = document.getElementById("perfil-popover");

abrirBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  popover.style.display = "block";
});

fecharBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  popover.style.display = "none";
});

document.addEventListener("click", (e) => {
  if (!popover.contains(e.target)) {
    popover.style.display = "none";
  }
});

const nome = localStorage.getItem("usuario");

if (nome) {
    document.querySelector(".h4-perfil").textContent = nome;
}

function logout() {
    localStorage.removeItem("usuario");

    window.location.href = "index.html";
}


function pesquisar() {
    window.location.href = "pesquisar.html";
}


