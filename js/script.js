// =====================================================
// NEXORA GAMES - SCRIPT PRINCIPAL
// =====================================================

// Catálogo temporário para testes.
// Depois esses dados virão do Cloudflare D1.
const jogos = [
    {
        id: 1,
        titulo: "Cyberpunk 2077",
        descricao: "RPG de ação em mundo aberto ambientado em Night City.",
        preco: 149.90,
        imagem: "https://placehold.co/600x800?text=Cyberpunk+2077",
        nota: 4.8,
        genero: ["RPG", "Ação"],
        plataforma: ["PC", "PlayStation", "Xbox"],
        classificacao: 18
    },
    {
        id: 2,
        titulo: "Elden Ring",
        descricao: "Uma aventura de RPG de ação em um vasto mundo de fantasia.",
        preco: 249.90,
        imagem: "https://placehold.co/600x800?text=Elden+Ring",
        nota: 4.9,
        genero: ["RPG", "Ação"],
        plataforma: ["PC", "PlayStation", "Xbox"],
        classificacao: 16
    },
    {
        id: 3,
        titulo: "Counter Strike 2",
        descricao: "FPS competitivo focado em estratégia, precisão e trabalho em equipe.",
        preco: 0,
        imagem: "https://placehold.co/600x800?text=Counter+Strike+2",
        nota: 4.7,
        genero: ["FPS", "Ação"],
        plataforma: ["PC"],
        classificacao: 16
    },
    {
        id: 4,
        titulo: "Forza Horizon 5",
        descricao: "Experiência de corrida em mundo aberto com diversos veículos.",
        preco: 199.90,
        imagem: "https://placehold.co/600x800?text=Forza+Horizon+5",
        nota: 4.6,
        genero: ["Corrida"],
        plataforma: ["PC", "Xbox"],
        classificacao: 12
    },
    {
        id: 5,
        titulo: "Minecraft",
        descricao: "Explore, construa e sobreviva em um mundo gerado proceduralmente.",
        preco: 99.90,
        imagem: "https://placehold.co/600x800?text=Minecraft",
        nota: 4.9,
        genero: ["Aventura", "Indie"],
        plataforma: ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"],
        classificacao: 10
    },
    {
        id: 6,
        titulo: "Resident Evil 4",
        descricao: "Uma aventura de terror e sobrevivência cheia de ação.",
        preco: 179.90,
        imagem: "https://placehold.co/600x800?text=Resident+Evil+4",
        nota: 4.8,
        genero: ["Terror", "Ação"],
        plataforma: ["PC", "PlayStation", "Xbox"],
        classificacao: 18
    },
    {
        id: 7,
        titulo: "Hades",
        descricao: "Roguelike de ação com combates rápidos e narrativa envolvente.",
        preco: 74.90,
        imagem: "https://placehold.co/600x800?text=Hades",
        nota: 4.8,
        genero: ["Indie", "Ação"],
        plataforma: ["PC", "PlayStation", "Xbox", "Nintendo"],
        classificacao: 12
    },
    {
        id: 8,
        titulo: "EA Sports FC 26",
        descricao: "Jogo de futebol com diversos modos e equipes.",
        preco: 299.90,
        imagem: "https://placehold.co/600x800?text=EA+Sports+FC+26",
        nota: 4.5,
        genero: ["Esportes"],
        plataforma: ["PC", "PlayStation", "Xbox", "Nintendo"],
        classificacao: 12
    }
];


// =====================================================
// ELEMENTOS DA PÁGINA
// =====================================================

const listaJogos = document.getElementById("listaJogos");
const nenhumJogo = document.getElementById("nenhumJogo");

const campoBusca = document.getElementById("campoBusca");
const btnBuscar = document.getElementById("btnBuscar");

const filtroPlataforma = document.getElementById("filtroPlataforma");
const filtroPreco = document.getElementById("filtroPreco");

const botoesCategoria = document.querySelectorAll(".category-button");

const modalDetalhes = document.getElementById("modalDetalhes");
const fecharModal = document.getElementById("fecharModal");
const conteudoModal = document.getElementById("conteudoModal");

const modalCarrinho = document.getElementById("modalCarrinho");
const fecharCarrinho = document.getElementById("fecharCarrinho");
const listaCarrinho = document.getElementById("listaCarrinho");
const valorTotalCarrinho = document.getElementById("valorTotalCarrinho");

const btnCarrinho = document.getElementById("btnCarrinho");
const contadorCarrinho = document.getElementById("contadorCarrinho");
const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");


// =====================================================
// ESTADO DO SISTEMA
// =====================================================

let categoriaAtual = "Todos";
let carrinho = JSON.parse(localStorage.getItem("nexoraCarrinho")) || [];


// =====================================================
// 1. CARREGAR JOGOS
// =====================================================

function carregarJogos(lista = jogos) {

    listaJogos.innerHTML = "";

    if (lista.length === 0) {
        nenhumJogo.classList.remove("hidden");
        return;
    }

    nenhumJogo.classList.add("hidden");

    lista.forEach(jogo => {

        const preco =
            jogo.preco === 0
                ? "Grátis"
                : `R$ ${jogo.preco.toFixed(2).replace(".", ",")}`;

        const card = document.createElement("article");

        card.className = "game-card";

        card.innerHTML = `
            <div class="game-card-image">
                <img 
                    src="${jogo.imagem}" 
                    alt="${jogo.titulo}"
                >

                <span class="game-badge">
                    ${jogo.classificacao}+
                </span>
            </div>

            <div class="game-card-content">

                <h3>${jogo.titulo}</h3>

                <p class="game-description">
                    ${jogo.descricao}
                </p>

                <div class="game-info">

                    <span class="game-rating">
                        ★ ${jogo.nota}
                    </span>

                    <span class="game-platform">
                        ${jogo.plataforma.join(" • ")}
                    </span>

                </div>

                <div class="game-card-footer">

                    <span class="game-price">
                        ${preco}
                    </span>

                    <div class="game-actions">

                        <button 
                            class="game-details-button"
                            onclick="abrirDetalhes(${jogo.id})"
                        >
                            Detalhes
                        </button>

                        <button 
                            class="add-cart-button"
                            onclick="adicionarCarrinho(${jogo.id})"
                        >
                            + Carrinho
                        </button>

                    </div>

                </div>

            </div>
        `;

        listaJogos.appendChild(card);
    });
}


// =====================================================
// 2. FILTRAR JOGOS
// =====================================================

function filtrarJogos() {

    const textoBusca = campoBusca.value
        .toLowerCase()
        .trim();

    const plataforma = filtroPlataforma.value;
    const preco = filtroPreco.value;

    const resultado = jogos.filter(jogo => {

        // Busca pelo nome
        const correspondeBusca =
            jogo.titulo
                .toLowerCase()
                .includes(textoBusca);

        // Filtro por categoria
        const correspondeCategoria =
            categoriaAtual === "Todos" ||
            jogo.genero.includes(categoriaAtual);

        // Filtro por plataforma
        const correspondePlataforma =
            plataforma === "Todos" ||
            jogo.plataforma.includes(plataforma);

        // Filtro por preço
        let correspondePreco = true;

        if (preco === "gratis") {
            correspondePreco = jogo.preco === 0;
        }

        if (preco === "50") {
            correspondePreco = jogo.preco <= 50;
        }

        if (preco === "100") {
            correspondePreco = jogo.preco <= 100;
        }

        if (preco === "200") {
            correspondePreco = jogo.preco <= 200;
        }

        if (preco === "acima200") {
            correspondePreco = jogo.preco > 200;
        }

        return (
            correspondeBusca &&
            correspondeCategoria &&
            correspondePlataforma &&
            correspondePreco
        );
    });

    carregarJogos(resultado);
}


// =====================================================
// 3. BUSCAR JOGOS
// =====================================================

function buscarJogos() {
    filtrarJogos();
}


// =====================================================
// 4. ADICIONAR AO CARRINHO
// =====================================================

function adicionarCarrinho(idJogo) {

    const jogo = jogos.find(jogo => jogo.id === idJogo);

    if (!jogo) {
        return;
    }

    const itemExistente = carrinho.find(
        item => item.id === idJogo
    );

    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push({
            id: jogo.id,
            titulo: jogo.titulo,
            preco: jogo.preco,
            imagem: jogo.imagem,
            quantidade: 1
        });
    }

    salvarCarrinho();

    atualizarContadorCarrinho();

    alert(`${jogo.titulo} foi adicionado ao carrinho!`);
}


// =====================================================
// 5. SALVAR CARRINHO
// =====================================================

function salvarCarrinho() {

    localStorage.setItem(
        "nexoraCarrinho",
        JSON.stringify(carrinho)
    );
}


// =====================================================
// 6. ATUALIZAR CONTADOR
// =====================================================

function atualizarContadorCarrinho() {

    const quantidade = carrinho.reduce(
        (total, item) => total + item.quantidade,
        0
    );

    contadorCarrinho.textContent = quantidade;
}


// =====================================================
// 7. ABRIR CARRINHO
// =====================================================

function abrirCarrinho() {

    listaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <div class="empty-cart">
                <p>Seu carrinho está vazio.</p>
                <span>Adicione alguns jogos para continuar.</span>
            </div>
        `;

        valorTotalCarrinho.textContent = "R$ 0,00";

        modalCarrinho.classList.add("active");

        return;
    }

    let total = 0;

    carrinho.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;

        const preco =
            item.preco === 0
                ? "Grátis"
                : `R$ ${item.preco.toFixed(2).replace(".", ",")}`;

        const itemHTML = document.createElement("div");

        itemHTML.className = "cart-item";

        itemHTML.innerHTML = `
            <img
                src="${item.imagem}"
                alt="${item.titulo}"
            >

            <div class="cart-item-info">

                <h4>${item.titulo}</h4>

                <p>${preco}</p>

                <span>
                    Quantidade: ${item.quantidade}
                </span>

            </div>

            <button
                class="remove-cart-button"
                onclick="removerCarrinho(${item.id})"
            >
                Remover
            </button>
        `;

        listaCarrinho.appendChild(itemHTML);
    });

    valorTotalCarrinho.textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;

    modalCarrinho.classList.add("active");
}


// =====================================================
// 8. REMOVER DO CARRINHO
// =====================================================

function removerCarrinho(idJogo) {

    carrinho = carrinho.filter(
        item => item.id !== idJogo
    );

    salvarCarrinho();

    atualizarContadorCarrinho();

    abrirCarrinho();
}


// =====================================================
// 9. ABRIR DETALHES
// =====================================================

function abrirDetalhes(idJogo) {

    const jogo = jogos.find(
        jogo => jogo.id === idJogo
    );

    if (!jogo) {
        return;
    }

    const preco =
        jogo.preco === 0
            ? "Grátis"
            : `R$ ${jogo.preco.toFixed(2).replace(".", ",")}`;

    conteudoModal.innerHTML = `

        <div class="modal-game">

            <img
                src="${jogo.imagem}"
                alt="${jogo.titulo}"
            >

            <div class="modal-game-info">

                <h2>${jogo.titulo}</h2>

                <p class="modal-rating">
                    ★ ${jogo.nota} / 5
                </p>

                <p>
                    ${jogo.descricao}
                </p>

                <p>
                    <strong>Gênero:</strong>
                    ${jogo.genero.join(", ")}
                </p>

                <p>
                    <strong>Plataformas:</strong>
                    ${jogo.plataforma.join(", ")}
                </p>

                <p>
                    <strong>Classificação:</strong>
                    ${jogo.classificacao} anos
                </p>

                <div class="modal-price">
                    ${preco}
                </div>

                <button
                    class="add-cart-button"
                    onclick="adicionarCarrinho(${jogo.id})"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        </div>
    `;

    modalDetalhes.classList.add("active");
}


// =====================================================
// 10. FECHAR MODAIS
// =====================================================

function fecharModais() {

    modalDetalhes.classList.remove("active");
    modalCarrinho.classList.remove("active");
}


// =====================================================
// 11. EVENTOS
// =====================================================

// Busca
btnBuscar.addEventListener(
    "click",
    buscarJogos
);


// Busca pressionando ENTER
campoBusca.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            buscarJogos();
        }

    }
);


// Busca enquanto digita
campoBusca.addEventListener(
    "input",
    filtrarJogos
);


// Filtro de plataforma
filtroPlataforma.addEventListener(
    "change",
    filtrarJogos
);


// Filtro de preço
filtroPreco.addEventListener(
    "change",
    filtrarJogos
);


// Categorias
botoesCategoria.forEach(botao => {

    botao.addEventListener(
        "click",
        function() {

            botoesCategoria.forEach(
                item => item.classList.remove("active")
            );

            this.classList.add("active");

            categoriaAtual =
                this.dataset.genero;

            filtrarJogos();
        }
    );

});


// Abrir carrinho
btnCarrinho.addEventListener(
    "click",
    abrirCarrinho
);


// Fechar detalhes
fecharModal.addEventListener(
    "click",
    function() {
        modalDetalhes.classList.remove("active");
    }
);


// Fechar carrinho
fecharCarrinho.addEventListener(
    "click",
    function() {
        modalCarrinho.classList.remove("active");
    }
);


// Fechar clicando fora do modal
window.addEventListener(
    "click",
    function(event) {

        if (event.target === modalDetalhes) {
            modalDetalhes.classList.remove("active");
        }

        if (event.target === modalCarrinho) {
            modalCarrinho.classList.remove("active");
        }

    }
);


// Finalizar compra
btnFinalizarCompra.addEventListener(
    "click",
    function() {

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        alert(
            "Compra de demonstração realizada com sucesso!"
        );

        carrinho = [];

        salvarCarrinho();

        atualizarContadorCarrinho();

        abrirCarrinho();
    }
);


// =====================================================
// 12. INICIALIZAÇÃO
// =====================================================

function inicializarApp() {

    carregarJogos();

    atualizarContadorCarrinho();
}


// Iniciar aplicação
inicializarApp();