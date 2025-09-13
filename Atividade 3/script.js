// Função 1: Alerta ao adicionar produto no carrinho OBSOLETA
// const btn_alerta = document.querySelectorAll(".btn-carrinho");
// btn_alerta.forEach(btn_alerta => {
//     btn_alerta.addEventListener("click", () => {
//         alert("Produto adicionado ao carrinho com sucesso!");
//     });
// });

// OBSOLETA, substituída pela função de adicionar produtos ao carrinho

// Função 2: Mostrar data e hora no rodapé em tempo real
function atualizarDataHora() {
    const agora = new Date();
    const formatado = agora.toLocaleString("pt-BR");
    document.getElementById("data-hora").textContent = `${formatado}`;
}

setInterval(atualizarDataHora, 1000);
atualizarDataHora();

// Função 3: Alternar entre modo claro e escuro
const toggleTema = document.getElementById("toggle-tema");
const body = document.body;

// === Carregar preferência salva no localStorage ===
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "escuro") {
    body.classList.add("dark"); 
    toggleTema.textContent = "☀️ Modo Claro";
} else {
    body.classList.remove("dark");
    toggleTema.textContent = "🌙 Modo Escuro";
}

// === Alternar tema ao clicar no botão ===
toggleTema.addEventListener("click", () => {
    const estaEscuro = body.classList.toggle("dark");

    if (estaEscuro) {
        toggleTema.textContent = "☀️ Modo Claro";
        localStorage.setItem("tema", "escuro"); // salva no navegador
    } else {
        toggleTema.textContent = "🌙 Modo Escuro";
        localStorage.setItem("tema", "claro");
    }
});


// Adicionar produtos ao carrinho
const btn_carrinho = document.querySelectorAll(".btn-carrinho");

btn_carrinho.forEach(botao => {
    botao.addEventListener("click", (e) => {
        const produto = e.target.closest(".produto");
        const nome = produto.querySelector("h3").textContent;
        const precoTexto = produto.querySelector(".preco").textContent;
        const preco = parseFloat(precoTexto.replace("R$", "").replace(".", "").replace(",", "."));

        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
        // Verificando se já existe
        const existente = carrinho.find(item => item.nome === nome);
        if (existente) {
            existente.quantidade += 1;
        } else {
            carrinho.push({ nome, preco, quantidade: 1 });
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));

        alert(`${nome} foi adicionado ao carrinho!`);
    });
});


// Função: Mostrar carrinho
const listaCarrinho = document.getElementById("lista-carrinho");
// Função: Mostrar carrinho na página carrinho.html
function atualizarCarrinho() {

    const listaCarrinho = document.getElementById("lista-carrinho");
    const totalEl = document.getElementById("total-carrinho");

    if (!listaCarrinho) return;
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalEl.textContent = "R$ 0,00";
        return;
    }
    listaCarrinho.innerHTML = carrinho.map((item, index) => `
    <div class="carrinho-item">
        <h4 class="carrinho-nome">${item.nome}</h4>
        <div class="carrinho-controles">
            <button class="btn-quantidade" onclick="alterarQuantidade(${index}, -1)">➖</button>
            <span class="carrinho-qtd">${item.quantidade}</span>
            <button class="btn-quantidade" onclick="alterarQuantidade(${index}, 1)">➕</button>
            <span class="carrinho-preco"><strong>${(item.preco * item.quantidade).toLocaleString('pt-BR', {
        style:
            'currency', currency: 'BRL'
    })}</strong></span>
            <button class="btn-remover" onclick="removerItem(${index})">❌</button>
        </div>
    </div>
`).join("");
    const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    totalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
// Alterar quantidade
function alterarQuantidade(index, delta) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}
// Remover item
function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}
// Limpar carrinho
const btnLimpar = document.getElementById("limpar-carrinho");
if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        localStorage.removeItem("carrinho");
        atualizarCarrinho();
    });
}

atualizarCarrinho();