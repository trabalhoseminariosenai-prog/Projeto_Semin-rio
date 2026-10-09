
-- ============================================
-- NEXORA GAMES
-- Estrutura inicial do banco de dados
-- Cloudflare D1 (SQLite)
-- ============================================

PRAGMA foreign_keys = ON;

-- 1. Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'usuario'
        CHECK (tipo IN ('usuario', 'admin')),
    data_cadastro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Jogos
CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    preco REAL NOT NULL DEFAULT 0 CHECK (preco >= 0),
    imagem TEXT,
    plataforma TEXT NOT NULL,
    classificacao TEXT NOT NULL DEFAULT 'L',
    data_lancamento TEXT,
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
    data_cadastro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gêneros disponíveis
CREATE TABLE IF NOT EXISTS generos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

-- 4. Relação entre jogos e gêneros
-- Permite que um jogo tenha vários gêneros.
CREATE TABLE IF NOT EXISTS jogos_generos (
    jogo_id INTEGER NOT NULL,
    genero_id INTEGER NOT NULL,
    PRIMARY KEY (jogo_id, genero_id),
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    FOREIGN KEY (genero_id) REFERENCES generos(id) ON DELETE CASCADE
);

-- 5. Avaliações dos jogos
CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    jogo_id INTEGER NOT NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE
);

-- 6. Carrinhos
CREATE TABLE IF NOT EXISTS carrinhos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 7. Itens do carrinho
CREATE TABLE IF NOT EXISTS itens_carrinho (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carrinho_id INTEGER NOT NULL,
    jogo_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco REAL NOT NULL CHECK (preco >= 0),
    FOREIGN KEY (carrinho_id) REFERENCES carrinhos(id) ON DELETE CASCADE,
    FOREIGN KEY (jogo_id) REFERENCES jogos(id) ON DELETE CASCADE,
    UNIQUE (carrinho_id, jogo_id)
);

-- Índices para pesquisas frequentes
CREATE INDEX IF NOT EXISTS idx_jogos_titulo
    ON jogos(titulo);

CREATE INDEX IF NOT EXISTS idx_jogos_ativo
    ON jogos(ativo);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_jogo
    ON avaliacoes(jogo_id);

CREATE INDEX IF NOT EXISTS idx_jogos_generos_genero
    ON jogos_generos(genero_id);

-- Gêneros iniciais
INSERT OR IGNORE INTO generos (nome) VALUES
    ('Ação'),
    ('Aventura'),
    ('RPG'),
    ('FPS'),
    ('Estratégia'),
    ('Terror'),
    ('Corrida'),
    ('Esportes'),
    ('Indie'),
    ('Simulação'),
    ('Sobrevivência'),
    ('Plataforma'),
    ('Luta'),
    ('MMORPG'),
    ('Mundo aberto');