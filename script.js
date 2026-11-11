// Endereço do back-end Java (Spring Boot)
const API_URL = "http://localhost:8080";
const lista = document.getElementById("lista-animais");

// Busca os animais no back-end Java (que lê do banco de dados)
async function carregarAnimais() {
  try {
    const resp = await fetch(`${API_URL}/api/animais`);
    
    if (!resp.ok) {
      throw new Error(`Erro na requisição: ${resp.status}`);
    }

    const animais = await resp.json();

    if (!animais || animais.length === 0) {
      lista.innerHTML = "<p>Nenhum animal disponível no momento.</p>";
      return;
    }

    lista.innerHTML = "";
    
    animais.forEach(animal => {
      const card = document.createElement("div");
      card.className = "card";

      // Evita erros caso specie venha nulo ou indefinido do banco
      const especie = animal.especie ? animal.especie.toLowerCase() : "";
      const emoji = especie.startsWith("gat") ? "🐱" : "🐶";
      const fotoUrl = animal.foto || "";

      card.innerHTML = `
        <img src="${fotoUrl}" alt="${animal.nome || 'Animal'}"
             onerror="this.outerHTML='<div class=&quot;sem-foto&quot;>${emoji}</div>'">
        <h3>${animal.nome || 'Sem nome'}</h3>
        <p>${animal.especie || 'Não informada'}, ${animal.idade || 'Idade desconhecida'}</p>
        <button class="btn-adotar">ADOTAR-ME</button>
      `;

      card.querySelector(".btn-adotar").addEventListener("click", () => adotar(animal));
      lista.appendChild(card);
    });

  } catch (error) {
    console.error("Erro detalhado ao buscar animais:", error);
    lista.innerHTML = "<p>Erro ao carregar os animais. Verifique a conexão com o servidor.</p>";
  }
}

// Envia o pedido de adoção para o back-end
async function adotar(animal) {
  try {
    const nome = prompt(`Quer adotar ${animal.nome || 'este animal'}? Digite seu nome:`);
    if (!nome) return;
    
    const email = prompt("Digite seu e-mail para contato:");
    if (!email) return;

    const resp = await fetch(`${API_URL}/api/adocoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        animalId: animal.id,
        nomeInteressado: nome,
        email: email
      })
    });

    const resultado = await resp.text();
    alert(resultado);

  } catch (error) {
    console.error("Erro ao processar adoção:", error);
    alert("Não foi possível enviar o pedido de adoção. Tente novamente mais tarde.");
  }
}

// Inicializa a listagem ao carregar a página
carregarAnimais();
