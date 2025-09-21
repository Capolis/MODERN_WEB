// =====================
// Função 1: Mostrar data e hora no rodapé em tempo real
// =====================
function atualizarDataHora() {
    const agora = new Date();
    const formatado = agora.toLocaleString("pt-BR");
    document.getElementById("data-hora").textContent = `${formatado}`;
}
setInterval(atualizarDataHora, 1000);
atualizarDataHora();


// =====================
// Função 2: Alternar entre modo claro e escuro
// =====================
const toggleTema = document.getElementById("toggle-tema");
const body = document.body;

const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "escuro") {
    body.classList.add("dark");
    toggleTema.textContent = "☀️ Modo Claro";
} else {
    body.classList.remove("dark");
    toggleTema.textContent = "🌙 Modo Escuro";
}

toggleTema.addEventListener("click", () => {
    const estaEscuro = body.classList.toggle("dark");
    if (estaEscuro) {
        toggleTema.textContent = "☀️ Modo Claro";
        localStorage.setItem("tema", "escuro");
    } else {
        toggleTema.textContent = "🌙 Modo Escuro";
        localStorage.setItem("tema", "claro");
    }
});


// =====================
// Função 3: Buscar produtos da API e renderizar
// =====================
async function carregarProdutos() {
    try {
        const response = await fetch("https://fakestoreapi.com/products?limit=12");
        const produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function renderizarProdutos(produtos) {
    const container = document.querySelector(".grid-produtos");
    container.innerHTML = produtos.map((p, index) => `
        <article class="produto">
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p class="preco">R$ ${p.price.toFixed(2)}</p>
            <button class="btn-detalhes" data-descricao="${p.description.replace(/"/g, '&quot;')}">Ver Detalhes</button>
            <button class="btn-carrinho" data-index="${index}">Adicionar ao carrinho</button>
        </article>
    `).join("");

    const botoes = container.querySelectorAll(".btn-carrinho");
    botoes.forEach(botao => {
        botao.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            const produto = produtos[index];

            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            // verifica se já existe no carrinho
            const existente = carrinho.find(item => item.id === produto.id);
            if (existente) {
                existente.quantidade++;
            } else {
                carrinho.push({
                    id: produto.id,
                    nome: produto.title,
                    preco: produto.price,
                    quantidade: 1
                });
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            alert(`${produto.title} foi adicionado ao carrinho!`);
        });
    });

    // ===============================
    //  Ver Detalhes com Modal
    // ===============================
    const botoesDetalhes = document.querySelectorAll(".btn-detalhes");
    const modal = document.getElementById("modal-detalhes");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalDescricao = document.getElementById("modal-descricao");
    const modalFechar = document.querySelector(".modal-fechar");

    botoesDetalhes.forEach(botao => {
        botao.addEventListener("click", (e) => {
            const produto = e.target.closest(".produto");
            const titulo = produto.querySelector("h3").textContent;
            const descricao = e.target.getAttribute("data-descricao");

            modalTitulo.textContent = titulo;
            modalDescricao.textContent = descricao;
            modal.style.display = "block"; // abre modal
        });
    });

    // Fechar modal ao clicar no X
    modalFechar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fechar modal ao clicar fora do conteúdo
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

carregarProdutos();


// =====================
// Funções do Carrinho (carrinho.html)
// =====================
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
                <button onclick="alterarQuantidade(${index}, -1)">➖</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade(${index}, 1)">➕</button>
                <span><strong>${(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></span>
                <button onclick="removerItem(${index})">❌</button>
            </div>
        </div>
    `).join("");

    const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
    totalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function alterarQuantidade(index, delta) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}

function removerItem(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}

const btnLimpar = document.getElementById("limpar-carrinho");
if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        localStorage.removeItem("carrinho");
        atualizarCarrinho();
    });
}

atualizarCarrinho();