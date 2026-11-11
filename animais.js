const API_URL = "http://localhost:8080/api";
const lista = document.getElementById("lista-animais");
const formAnimal = document.getElementById("form-cadastrar-animal");

// 1. Alternar entre as telas de Adotar e Doar
function mudarAba(aba) {
  document.getElementById('aba-catalogo').style.display = aba === 'catalogo' ? 'block' : 'none';
  document.getElementById('aba-doar').style.display = aba === 'doar' ? 'block' : 'none';
  
  if (aba === 'catalogo') carregarAnimais();
}

// 2. Buscar animais do banco e mostrar na tela
async function carregarAnimais() {
  try {
    const res = await fetch(`${API_URL}/animais`);
    const animais = await res.json();

    if (animais.length === 0) {
      lista.innerHTML = "<p>Nenhum pet cadastrado.</p>";
      return;
    }

    lista.innerHTML = "";
    animais.forEach(pet => {
      const card = document.createElement("div");
      card.className = "card";
      
      // Emoji mostrado quando o pet está sem foto
      const especie = (pet.especie || "").toLowerCase();
      const emoji = especie.startsWith("gat") ? "🐱" : especie.startsWith("cach") ? "🐶" : "🐾";

      card.innerHTML = `
        <img src="${pet.foto || ''}" alt="${pet.nome}" onerror="this.outerHTML='<div class=&quot;sem-foto&quot;>${emoji}</div>'">
        <h3>${pet.nome}</h3>
        <p>${pet.especie}, ${pet.idade}</p>
        <button onclick="adotar(${pet.id}, '${pet.nome}')">ADOTAR-ME</button>
      `;
      lista.appendChild(card);
    });
  } catch (err) {
    lista.innerHTML = "<p>Erro ao carregar o catálogo.</p>";
  }
}

// 3. Solicitar adoção de um pet
async function adotar(id, nomePet) {
  const nome = prompt(`Quer adotar o(a) ${nomePet}? Digite seu nome:`);
  const email = prompt("Digite seu e-mail:");
  if (!nome || !email) return;

  try {
    const res = await fetch(`${API_URL}/adocoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animalId: id, nomeInteressado: nome, email: email })
    });
    alert(await res.text());
  } catch (err) {
    alert("Erro ao enviar pedido de adoção.");
  }
}

// 4. Cadastrar um novo animal (Doar)
formAnimal.addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoPet = {
    nome: document.getElementById("nome").value,
    especie: document.getElementById("especie").value,
    idade: document.getElementById("idade").value,
    foto: document.getElementById("foto").value
  };

  try {
    const res = await fetch(`${API_URL}/animais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPet)
    });

    if (res.ok) {
      alert("Pet cadastrado com sucesso!");
      formAnimal.reset();
      mudarAba('catalogo');
    } else {
      // Antes, nada acontecia quando o servidor recusava o cadastro
      alert("Não foi possível cadastrar o pet (erro " + res.status + "). " +
            "Se enviou uma foto, o campo da foto no banco pode ser pequeno demais.");
    }
  } catch (err) {
    alert("Erro ao conectar com o servidor.");
  }
});

// Inicializa mostrando os animais
carregarAnimais();