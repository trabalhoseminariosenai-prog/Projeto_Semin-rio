
/* =========================================
   NEXORA GAMES - PAINEL ADMINISTRATIVO
   Versão inicial: armazenamento local
========================================= */

const CHAVE_JOGOS = "nexora_jogos_admin";

// Elementos do formulário
const formJogo = document.getElementById("formJogo");
const campoId = document.getElementById("jogoId");
const campoTitulo = document.getElementById("titulo");
const campoDescricao = document.getElementById("descricao");
const campoPreco = document.getElementById("preco");
const campoPlataforma = document.getElementById("plataforma");
const campoClassificacao = document.getElementById("classificacao");
const campoImagem = document.getElementById("imagem");
const campoAtivo = document.getElementById("ativo");

const botaoSalvar = document.getElementById("btnSalvar");
const botaoLimpar = document.getElementById("btnLimpar");
const mensagemFormulario = document.getElementById("mensagemFormulario");

// Elementos da tabela e indicadores
const tabelaJogos = document.getElementById("tabelaJogos");
const buscaAdmin = document.getElementById("buscarJogoAdmin");
const quantidadeResultados = document.getElementById("quantidadeResultados");

const indicadorTotal = document.getElementById("totalJogos");
const indicadorAtivos = document.getElementById("jogosAtivos");
const indicadorPrecoMedio = document.getElementById("precoMedio");

// Carrega os jogos salvos neste navegador
let jogos = carregarJogosSalvos();

function carregarJogosSalvos() {
    try {
        const dados = localStorage.getItem(CHAVE_JOGOS);
        const lista = dados ? JSON.parse(dados) : [];

        return Array.isArray(lista) ? lista : [];
    } catch (erro) {
        console.error("Erro ao carregar jogos:", erro);
        return [];
    }
}

// Salva os jogos no navegador
function salvarJogos() {
    try {
        localStorage.setItem(CHAVE_JOGOS, JSON.stringify(jogos));
        return true;
    } catch (erro) {
        console.error("Erro ao salvar jogos:", erro);
        mostrarMensagem(
            "Não foi possível salvar os dados neste navegador.",
            "erro"
        );
        return false;
    }
}

// Exibe mensagens ao administrador
function mostrarMensagem(texto, tipo = "sucesso") {
    if (!mensagemFormulario) return;

    mensagemFormulario.textContent = texto;
    mensagemFormulario.className = `mensagem-formulario ${tipo}`;
}

// Lê todos os gêneros marcados
function obterGenerosSelecionados() {
    return Array.from(
        document.querySelectorAll(
            '#generos input[name="generos"]:checked'
        )
    ).map(input => input.value);
}

// Permite marcar os gêneros ao editar um jogo
function selecionarGeneros(generosSelecionados = []) {
    const generos = new Set(generosSelecionados);

    document.querySelectorAll(
        '#generos input[name="generos"]'
    ).forEach(input => {
        input.checked = generos.has(input.value);
    });
}

// Evita inserir texto do usuário como HTML
function criarCelula(texto) {
    const celula = document.createElement("td");
    celula.textContent = texto;
    return celula;
}

// Formata valores em reais
function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza os indicadores do painel
function atualizarIndicadores() {
    const total = jogos.length;
    const ativos = jogos.filter(jogo => jogo.ativo).length;

    const media = total > 0
        ? jogos.reduce((soma, jogo) => soma + Number(jogo.preco), 0) / total
        : 0;

    if (indicadorTotal) {
        indicadorTotal.textContent = total;
    }

    if (indicadorAtivos) {
        indicadorAtivos.textContent = ativos;
    }

    if (indicadorPrecoMedio) {
        indicadorPrecoMedio.textContent = formatarPreco(media);
    }
}

// Mostra os jogos na tabela
function renderizarTabela() {
    if (!tabelaJogos) return;

    const termo = buscaAdmin
        ? buscaAdmin.value.trim().toLocaleLowerCase("pt-BR")
        : "";

    const filtrados = jogos.filter(jogo => {
        const titulo = (jogo.titulo || "").toLocaleLowerCase("pt-BR");
        const plataforma = (jogo.plataforma || "").toLocaleLowerCase("pt-BR");
        const generos = (jogo.generos || []).join(" ").toLocaleLowerCase("pt-BR");

        return (
            titulo.includes(termo) ||
            plataforma.includes(termo) ||
            generos.includes(termo)
        );
    });

    tabelaJogos.replaceChildren();

    if (quantidadeResultados) {
        quantidadeResultados.textContent =
            `${filtrados.length} ${filtrados.length === 1 ? "jogo encontrado" : "jogos encontrados"}`;
    }

    if (filtrados.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 7;
        celula.textContent = termo
            ? "Nenhum jogo corresponde à pesquisa."
            : "Nenhum jogo cadastrado ainda.";

        celula.className = "tabela-vazia";
        linha.appendChild(celula);
        tabelaJogos.appendChild(linha);
        return;
    }

    filtrados.forEach(jogo => {
        const linha = document.createElement("tr");

        linha.appendChild(criarCelula(jogo.titulo));
        linha.appendChild(criarCelula((jogo.generos || []).join(", ") || "—"));
        linha.appendChild(criarCelula(jogo.plataforma || "—"));
        linha.appendChild(criarCelula(formatarPreco(jogo.preco)));
        linha.appendChild(criarCelula(jogo.classificacao || "—"));

        const celulaStatus = criarCelula(jogo.ativo ? "Ativo" : "Inativo");
        celulaStatus.className = jogo.ativo ? "status-ativo" : "status-inativo";
        linha.appendChild(celulaStatus);

        const celulaAcoes = document.createElement("td");
        celulaAcoes.className = "acoes-jogo";

        const botaoEditar = document.createElement("button");
        botaoEditar.type = "button";
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn-editar";
        botaoEditar.addEventListener("click", () => editarJogo(jogo.id));

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn-excluir";
        botaoExcluir.addEventListener("click", () => excluirJogo(jogo.id));

        celulaAcoes.append(botaoEditar, botaoExcluir);
        linha.appendChild(celulaAcoes);

        tabelaJogos.appendChild(linha);
    });
}

// Limpa o formulário
function limparFormulario() {
    if (!formJogo) return;

    formJogo.reset();

    if (campoId) {
        campoId.value = "";
    }

    selecionarGeneros([]);

    if (botaoSalvar) {
        botaoSalvar.textContent = "Salvar jogo";
    }

    mostrarMensagem("");
}

// Cadastra ou atualiza um jogo
function salvarJogo(evento) {
    evento.preventDefault();

    const titulo = campoTitulo.value.trim();
    const descricao = campoDescricao.value.trim();
    const preco = Number(campoPreco.value);
    const plataforma = campoPlataforma.value;
    const classificacao = campoClassificacao.value;
    const imagem = campoImagem.value.trim();
    const ativo = campoAtivo.value === "true";
    const generos = obterGenerosSelecionados();

    if (!titulo || !descricao || !plataforma || !classificacao) {
        mostrarMensagem("Preencha todos os campos obrigatórios.", "erro");
        return;
    }

    if (!Number.isFinite(preco) || preco < 0) {
        mostrarMensagem("Informe um preço válido.", "erro");
        return;
    }

    if (generos.length === 0) {
        mostrarMensagem("Selecione pelo menos um gênero.", "erro");
        return;
    }

    if (imagem) {
        try {
            const url = new URL(imagem);

            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Protocolo inválido");
            }
        } catch {
            mostrarMensagem("Informe uma URL de imagem válida (HTTP ou HTTPS).", "erro");
            return;
        }
    }

    const idExistente = campoId.value;
    const jogoExistente = jogos.find(
        jogo => String(jogo.id) === String(idExistente)
    );

    const jogo = {
        id: idExistente ? Number(idExistente) : Date.now(),
        titulo,
        descricao,
        preco,
        plataforma,
        classificacao,
        imagem,
        generos,
        ativo,
        dataAtualizacao: new Date().toISOString()
    };

    if (jogoExistente) {
        jogos = jogos.map(item =>
            String(item.id) === String(idExistente) ? jogo : item
        );
    } else {
        jogos.push(jogo);
    }

    if (!salvarJogos()) return;

    renderizarTabela();
    atualizarIndicadores();
    limparFormulario();

    mostrarMensagem(
        jogoExistente
            ? "Jogo atualizado com sucesso!"
            : "Jogo cadastrado com sucesso!",
        "sucesso"
    );
}

// Preenche o formulário para edição
function editarJogo(id) {
    const jogo = jogos.find(item => String(item.id) === String(id));

    if (!jogo) {
        mostrarMensagem("Jogo não encontrado.", "erro");
        return;
    }

    campoId.value = jogo.id;
    campoTitulo.value = jogo.titulo || "";
    campoDescricao.value = jogo.descricao || "";
    campoPreco.value = jogo.preco;
    campoPlataforma.value = jogo.plataforma || "";
    campoClassificacao.value = jogo.classificacao || "";
    campoImagem.value = jogo.imagem || "";
    campoAtivo.value = String(jogo.ativo);

    selecionarGeneros(jogo.generos || []);

    if (botaoSalvar) {
        botaoSalvar.textContent = "Salvar alterações";
    }

    mostrarMensagem("Editando jogo: " + jogo.titulo, "sucesso");

    formJogo.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Exclui um jogo
function excluirJogo(id) {
    const jogo = jogos.find(item => String(item.id) === String(id));

    if (!jogo) return;

    const confirmar = confirm(
        `Deseja realmente excluir o jogo "${jogo.titulo}"?`
    );

    if (!confirmar) return;

    const jogosAnteriores = jogos;
    jogos = jogos.filter(item => String(item.id) !== String(id));

    if (!salvarJogos()) {
        jogos = jogosAnteriores;
        return;
    }

    renderizarTabela();
    atualizarIndicadores();
    mostrarMensagem("Jogo excluído com sucesso!", "sucesso");
}

// Eventos
if (formJogo) {
    formJogo.addEventListener("submit", salvarJogo);
}

if (botaoLimpar) {
    botaoLimpar.addEventListener("click", limparFormulario);
}

if (buscaAdmin) {
    buscaAdmin.addEventListener("input", renderizarTabela);
}

// Inicialização do painel
renderizarTabela();
atualizarIndicadores();