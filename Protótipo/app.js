const STORAGE_KEY = "greenmify-prototype-v1";

const starterState = {
  role: "consumer",
  profile: {
    name: "Marina Costa",
    email: "marina@email.com",
    phone: "(81) 99912-3456",
    city: "Recife, PE",
    bio: "Apaixonada por comida de verdade e por conhecer quem está por trás de cada produto.",
    farm: ""
  },
  products: [
    { id: "p1", title: "Tomate italiano orgânico", type: "Produto agrícola", category: "Hortifruti", price: 8.9, unit: "kg", quantity: 120, description: "Tomates cultivados sem agrotóxicos, colhidos no ponto certo e prontos para chegar à sua mesa.", location: "Gravatá, PE", seller: "Sítio Boa Terra", owner: "me", emoji: "🍅", tone: "sun", availability: "available", moderation: "approved", created: "2026-04-12" },
    { id: "p2", title: "Mel silvestre artesanal", type: "Produto agrícola", category: "Mel e derivados", price: 28, unit: "unidade", quantity: 34, description: "Mel puro de florada silvestre, produzido em pequenos lotes e cuidadosamente envasado.", location: "Caruaru, PE", seller: "Apiário Serra Azul", owner: "other", emoji: "🍯", tone: "earth", availability: "available", moderation: "approved", created: "2026-04-10" },
    { id: "p3", title: "Abóbora cabotiá", type: "Produto agrícola", category: "Hortifruti", price: 4.5, unit: "kg", quantity: 0, description: "Abóbora selecionada, saborosa e ideal para receitas do dia a dia.", location: "Vitória de Santo Antão, PE", seller: "Horta da Lúcia", owner: "other", emoji: "🎃", tone: "sun", availability: "unavailable", moderation: "approved", created: "2026-04-08" },
    { id: "p4", title: "Mudas de manjericão", type: "Produto agrícola", category: "Mudas e sementes", price: 6, unit: "unidade", quantity: 42, description: "Mudas fortes e saudáveis, prontas para cultivo em canteiro ou vaso.", location: "Paulista, PE", seller: "Sítio Boa Terra", owner: "me", emoji: "🌱", tone: "sky", availability: "available", moderation: "approved", created: "2026-04-05" },
    { id: "p5", title: "Bomba d'água agrícola 1 CV", type: "Equipamento agrícola", category: "Irrigação", price: 690, unit: "unidade", quantity: 3, description: "Bomba revisada, ideal para pequenas propriedades e sistemas de irrigação.", location: "Garanhuns, PE", seller: "Agro Peças do Vale", owner: "other", emoji: "⚙️", tone: "clay", brand: "AgroFlow 1 CV", condition: "Usado — revisado", availability: "available", moderation: "approved", created: "2026-04-03" },
    { id: "p6", title: "Milho verde selecionado", type: "Produto agrícola", category: "Grãos e cereais", price: 3.2, unit: "unidade", quantity: 85, description: "Espigas fresquinhas, colhidas pela manhã e selecionadas uma a uma.", location: "Bezerros, PE", seller: "Cooperativa Raízes", owner: "other", emoji: "🌽", tone: "sun", availability: "available", moderation: "approved", created: "2026-04-02" },
    { id: "p7", title: "Roçadeira costal", type: "Equipamento agrícola", category: "Máquinas e ferramentas", price: 1250, unit: "unidade", quantity: 1, description: "Equipamento seminovo em ótimo estado, revisado e pronto para uso.", location: "Caruaru, PE", seller: "Sítio do Nando", owner: "other", emoji: "🛠️", brand: "TerraForte 52cc", condition: "Seminovo — revisado", availability: "available", moderation: "pending", created: "2026-04-14" },
    { id: "p8", title: "Queijo coalho artesanal", type: "Produto agrícola", category: "Laticínios", price: 32, unit: "kg", quantity: 16, description: "Queijo coalho feito com leite fresco da fazenda, com sabor e textura tradicionais.", location: "Venturosa, PE", seller: "Fazenda Riacho Doce", owner: "other", emoji: "🧀", tone: "earth", availability: "available", moderation: "approved", created: "2026-04-01" },
    { id: "p9", title: "Sementes de feijão-de-corda", type: "Produto agrícola", category: "Mudas e sementes", price: 14, unit: "kg", quantity: 22, description: "Sementes selecionadas de variedade adaptada ao clima do Nordeste.", location: "Serra Talhada, PE", seller: "Raízes do Sertão", owner: "other", emoji: "🫘", tone: "clay", availability: "available", moderation: "pending", created: "2026-04-15" }
  ],
  favorites: ["p2"],
  compare: [],
  conversations: [
    { id: "c1", productId: "p2", buyer: "Marina Costa", seller: "Apiário Serra Azul", partner: "Apiário Serra Azul", messages: [
      { sender: "other", text: "Olá, Marina! O mel é de qual florada?", time: "09:42" },
      { sender: "me", text: "Oi! É de florada silvestre da região?", time: "09:45" }
    ] }
  ],
  reports: [
    { id: "r1", productId: "p7", reason: "Preço parece muito abaixo do valor praticado.", reporter: "Marina Costa", status: "open" }
  ]
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(starterState);
  const parsed = JSON.parse(saved);
  return { ...structuredClone(starterState), ...parsed };
}

let state = loadState();
let activeView = "explore";
let selectedCategory = "Todos";
let searchTerm = "";
let maxPrice = "";
let sortOrder = "recommended";
let selectedConversationId = state.conversations[0]?.id || null;
let conversationFilter = "";

const content = document.getElementById("app-content");
const modalRoot = document.getElementById("modal-root");
const toastRoot = document.getElementById("toast-root");
const roleSwitch = document.getElementById("role-switch");

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function productById(id) {
  return state.products.find(product => product.id === id);
}

function roleName(role = state.role) {
  return ({ consumer: "Consumidor", producer: "Produtor", admin: "Administrador" })[role];
}

function initials(name) {
  return (name || "G").trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}

function toast(message, type = "success") {
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.textContent = message;
  toastRoot.append(item);
  window.setTimeout(() => item.remove(), 3200);
}

function updateChrome() {
  document.querySelectorAll(".role-only").forEach(element => element.hidden = state.role === "consumer");
  document.querySelectorAll(".admin-only").forEach(element => element.hidden = state.role !== "admin");
  document.getElementById("sidebar-name").textContent = state.profile.name;
  document.getElementById("sidebar-role").textContent = roleName();
  document.getElementById("sidebar-avatar").textContent = initials(state.profile.name);
  document.getElementById("top-avatar").textContent = initials(state.profile.name);
  document.getElementById("favorite-count").textContent = state.favorites.length;
  document.getElementById("message-count").textContent = state.conversations.length;
  document.getElementById("moderation-count").textContent = state.products.filter(item => item.moderation === "pending").length + state.reports.filter(report => report.status === "open").length;
  roleSwitch.value = state.role;
  document.getElementById("connection-label").textContent = navigator.onLine ? "Protótipo local" : "Modo offline";
  const activeLink = document.querySelector(`.nav-link[data-view="${activeView}"]`);
  document.querySelectorAll(".nav-link[data-view]").forEach(link => link.classList.toggle("active", link === activeLink));
  document.getElementById("breadcrumb-current").textContent = viewTitle(activeView);
}

function viewTitle(view) {
  return ({
    explore: "Explorar", favorites: "Favoritos", messages: "Mensagens",
    listings: "Meus anúncios", moderation: "Moderação", profile: "Meu perfil", seller: "Perfil do produtor"
  })[view] || "Explorar";
}

function setView(view) {
  if ((view === "listings" && state.role === "consumer") || (view === "moderation" && state.role !== "admin")) view = "explore";
  activeView = view;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function visibleProducts(view = activeView) {
  let items = state.products.filter(item => item.moderation === "approved" && item.availability === "available");
  if (view === "favorites") items = items.filter(item => state.favorites.includes(item.id));
  if (view === "seller") items = items.filter(item => item.seller === sellerProfileName);
  if (selectedCategory !== "Todos") items = items.filter(item => item.category === selectedCategory);
  if (searchTerm.trim()) {
    const needle = searchTerm.toLocaleLowerCase("pt-BR");
    items = items.filter(item => [item.title, item.category, item.description, item.location, item.seller, item.type].some(value => value.toLocaleLowerCase("pt-BR").includes(needle)));
  }
  if (maxPrice !== "") items = items.filter(item => item.price <= Number(maxPrice));
  if (sortOrder === "price-asc") items.sort((a, b) => a.price - b.price);
  if (sortOrder === "price-desc") items.sort((a, b) => b.price - a.price);
  if (sortOrder === "recent") items.sort((a, b) => b.created.localeCompare(a.created));
  return items;
}

let sellerProfileName = "";

function productCard(product) {
  const favorited = state.favorites.includes(product.id);
  const compared = state.compare.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-image ${escapeHtml(product.tone)}">
        <span class="image-tag">${escapeHtml(product.category)}</span>
        <button class="favorite-button ${favorited ? "favorited" : ""}" data-action="favorite" data-id="${escapeHtml(product.id)}" aria-label="${favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${favorited ? "♥" : "♡"}</button>
        <span class="product-emoji" aria-hidden="true">${escapeHtml(product.emoji)}</span>
        <label class="compare-check"><input type="checkbox" data-action="compare" data-id="${escapeHtml(product.id)}" ${compared ? "checked" : ""}> Comparar</label>
      </div>
      <div class="product-body">
        <span class="product-kicker">${escapeHtml(product.type)} · ${escapeHtml(product.seller)}</span>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <div class="product-meta">
          <div><div class="product-price">${money(product.price)} <small>/ ${escapeHtml(product.unit)}</small></div><div class="product-location">⌖ ${escapeHtml(product.location)}</div></div>
          <button class="button secondary small" data-action="details" data-id="${escapeHtml(product.id)}">Ver produto</button>
        </div>
      </div>
    </article>`;
}

function compareDock() {
  if (!state.compare.length) return "";
  const selected = state.compare.map(productById).filter(Boolean);
  return `<div class="compare-dock"><span>${selected.length}/3 selecionados</span><div class="compare-pills">${selected.map(item => `<span class="compare-pill">${escapeHtml(item.title)}</span>`).join("")}</div><button class="button small" data-action="compare-open" ${selected.length < 2 ? "disabled" : ""}>Comparar agora</button><button class="button ghost small" data-action="compare-clear">Limpar</button></div>`;
}

function marketplacePage(view = "explore") {
  const favoritePage = view === "favorites";
  const sellerPage = view === "seller";
  const sellerProducts = sellerPage ? state.products.filter(item => item.seller === sellerProfileName && item.moderation === "approved") : [];
  const seller = sellerProducts[0];
  const products = visibleProducts(view);
  const categories = ["Todos", "Hortifruti", "Grãos e cereais", "Mudas e sementes", "Mel e derivados", "Laticínios", "Irrigação", "Máquinas e ferramentas"];
  return `
    ${sellerPage ? `<section class="seller-profile-banner"><div class="seller-profile-avatar">${escapeHtml(initials(sellerProfileName))}</div><div><span class="eyebrow">Perfil do produtor</span><h1>${escapeHtml(sellerProfileName || "Produtor Greenmify")}</h1><p>${escapeHtml(seller?.location || "Pernambuco")} · ${sellerProducts.length} anúncios publicados</p><span class="seller-profile-bio">Produtor parceiro do Greenmify. Conheça os produtos disponíveis e fale diretamente com quem produz.</span></div></section>` : favoritePage ? `
    <div class="page-heading"><div><span class="eyebrow">Sua seleção</span><h1>Seus favoritos</h1><p class="subtitle">Produtos que você guardou para encontrar depois.</p></div><button class="button secondary" data-view="explore">Explorar produtos <span>→</span></button></div>` : ""}
    ${!favoritePage && !sellerPage ? `<section class="hero"><div class="hero-content"><span class="eyebrow">Do campo para perto de você</span><h1>Encontre o que o campo tem de melhor.</h1><p>Produtos frescos, equipamentos e histórias de quem produz. Tudo em um só lugar.</p><form class="search-box" id="search-form"><span class="search-symbol">⌕</span><input id="product-search" name="search" value="${escapeHtml(searchTerm)}" placeholder="O que você está procurando?" aria-label="Buscar produtos"><button class="button" type="submit">Buscar <span>→</span></button></form></div><span class="hero-plant" aria-hidden="true">🌿</span></section>` : ""}
    <div class="section-title-row"><div><h2>${sellerPage ? "Produtos deste produtor" : favoritePage ? "Produtos salvos" : "Descubra produtos"}</h2></div><span class="result-count">${products.length} ${products.length === 1 ? "produto encontrado" : "produtos encontrados"}</span></div>
    <div class="category-strip">${categories.map(category => `<button class="category-chip ${selectedCategory === category ? "selected" : ""}" data-action="category" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("")}</div>
    <div class="filter-row"><span class="filter-label">Filtrar por</span><select id="price-filter" class="filter-control" aria-label="Filtrar por preço"><option value="">Qualquer preço</option><option value="10" ${maxPrice === "10" ? "selected" : ""}>Até R$ 10</option><option value="50" ${maxPrice === "50" ? "selected" : ""}>Até R$ 50</option><option value="500" ${maxPrice === "500" ? "selected" : ""}>Até R$ 500</option></select><select id="sort-filter" class="filter-control" aria-label="Ordenar produtos"><option value="recommended" ${sortOrder === "recommended" ? "selected" : ""}>Recomendados</option><option value="recent" ${sortOrder === "recent" ? "selected" : ""}>Mais recentes</option><option value="price-asc" ${sortOrder === "price-asc" ? "selected" : ""}>Menor preço</option><option value="price-desc" ${sortOrder === "price-desc" ? "selected" : ""}>Maior preço</option></select></div>
    <div class="product-grid">${products.length ? products.map(productCard).join("") : `<div class="empty-state"><div style="font-size:27px">🌾</div><strong>${favoritePage ? "Sua lista ainda está vazia" : sellerPage ? "Este produtor ainda não tem anúncios publicados" : "Não encontramos esse produto"}</strong><p>${favoritePage ? "Toque no coração de um anúncio para salvá-lo aqui." : sellerPage ? "Volte em breve para conhecer novos produtos." : "Tente outro termo ou ajuste os filtros da busca."}</p></div>`}</div>
    ${compareDock()}`;
}

function listingsPage() {
  const items = state.role === "admin" ? state.products : state.products.filter(item => item.owner === "me");
  const listed = items.filter(item => item.moderation !== "rejected");
  const active = listed.filter(item => item.availability === "available" && item.moderation === "approved").length;
  const pending = listed.filter(item => item.moderation === "pending").length;
  const unavailable = listed.filter(item => item.availability === "unavailable").length;
  return `
    <div class="page-heading"><div><span class="eyebrow">${state.role === "admin" ? "Visão geral" : "Área do produtor"}</span><h1>Meus anúncios</h1><p class="subtitle">Gerencie seus produtos, disponibilidade e publicações.</p></div><button class="button" data-action="listing-new">＋ Novo anúncio</button></div>
    <div class="dashboard-stats"><div class="stat-card"><span>Anúncios publicados</span><strong>${active}</strong><small>visíveis no marketplace</small></div><div class="stat-card"><span>Em análise</span><strong>${pending}</strong><small>aguardando moderação</small></div><div class="stat-card"><span>Indisponíveis</span><strong>${unavailable}</strong><small>podem ser reativados</small></div><div class="stat-card"><span>Conversas</span><strong>${state.conversations.length}</strong><small>contatos recebidos</small></div></div>
    <section class="panel"><div class="panel-header"><h3>Anúncios cadastrados</h3><span class="result-count">${listed.length} itens</span></div><div style="overflow-x:auto"><table class="listing-table"><thead><tr><th>Produto</th><th>Status</th><th>Preço</th><th>Ações</th></tr></thead><tbody>${listed.length ? listed.map(item => `<tr><td><div class="table-product"><span class="mini-product">${escapeHtml(item.emoji)}</span><span>${escapeHtml(item.title)}<small style="color:#9aa39a;display:block;font-size:8px;font-weight:400;margin-top:3px">${escapeHtml(item.category)} · ${escapeHtml(item.seller)}</small></span></div></td><td><span class="pill ${item.moderation === "pending" ? "pending" : item.moderation === "rejected" ? "rejected" : item.availability === "available" ? "available" : "unavailable"}">${item.moderation === "pending" ? "Em análise" : item.moderation === "rejected" ? "Reprovado" : item.availability === "available" ? "Disponível" : "Esgotado"}</span></td><td>${money(item.price)} / ${escapeHtml(item.unit)}</td><td><div class="table-actions"><button class="button secondary small" data-action="listing-edit" data-id="${escapeHtml(item.id)}">Editar</button><button class="button secondary small" data-action="availability" data-id="${escapeHtml(item.id)}">${item.availability === "available" ? "Esgotar" : "Ativar"}</button></div></td></tr>`).join("") : `<tr><td colspan="4">Você ainda não cadastrou anúncios.</td></tr>`}</tbody></table></div></section>
    <div class="profile-tip"><strong>MUD01 aplicada neste protótipo:</strong> produtos e equipamentos usam o mesmo fluxo de cadastro, com campos específicos por tipo e unidade de medida para produtos agrícolas.</div>`;
}

function conversationPartner(conversation) {
  return state.role === "producer" ? conversation.buyer : conversation.seller;
}

function messagesPage() {
  let conversations = [...state.conversations];
  if (conversationFilter.trim()) conversations = conversations.filter(item => conversationPartner(item).toLowerCase().includes(conversationFilter.toLowerCase()) || (productById(item.productId)?.title || "").toLowerCase().includes(conversationFilter.toLowerCase()));
  const selected = state.conversations.find(item => item.id === selectedConversationId);
  return `
    <div class="page-heading"><div><span class="eyebrow">Conectando pessoas</span><h1>Mensagens</h1><p class="subtitle">${state.role === "producer" ? "Converse com quem tem interesse nos seus anúncios." : "Fale diretamente com produtores e tire suas dúvidas."}</p></div></div>
    <section class="panel inbox-layout">
      <aside class="conversation-list"><div class="conversation-list-header"><h3>Conversas <span class="result-count">(${state.conversations.length})</span></h3><input class="conversation-search" id="conversation-search" placeholder="Buscar conversa..." value="${escapeHtml(conversationFilter)}"></div>${conversations.length ? conversations.map(item => { const last = item.messages[item.messages.length - 1]; return `<button class="conversation-item ${selected?.id === item.id ? "selected" : ""}" data-action="conversation-select" data-id="${escapeHtml(item.id)}"><span class="conversation-avatar">${escapeHtml(initials(conversationPartner(item)))}</span><span class="conversation-info"><strong>${escapeHtml(conversationPartner(item))}</strong><span>${escapeHtml(last?.text || "Inicie a conversa")}</span></span><span class="conversation-time">${escapeHtml(last?.time || "")}</span></button>`; }).join("") : `<div class="thread-empty" style="min-height:120px">Nenhuma conversa encontrada.</div>`}</aside>
      <div class="thread">${selected ? `<div class="thread-header"><span class="conversation-avatar">${escapeHtml(initials(conversationPartner(selected)))}</span><div><h3>${escapeHtml(conversationPartner(selected))}</h3><span>Conversa sobre um anúncio</span></div><span class="thread-product">${escapeHtml(productById(selected.productId)?.title || "Produto removido")}</span></div><div class="thread-messages" id="thread-messages">${selected.messages.map(message => `<div class="message-bubble ${(state.role === "producer" ? message.sender === "other" : message.sender === "me") ? "mine" : ""}">${escapeHtml(message.text)}<span class="message-time">${escapeHtml(message.time)}</span></div>`).join("")}</div><form class="message-compose" id="message-form"><input name="message" maxlength="500" placeholder="Escreva sua mensagem..." aria-label="Escreva uma mensagem" required><button class="button" type="submit" aria-label="Enviar mensagem">Enviar ↗</button></form>` : `<div class="thread-empty"><strong>Suas conversas aparecem aqui</strong><span>Abra um produto e escolha “Falar com produtor” para iniciar.</span><button class="button secondary small" data-view="explore" style="margin-top:14px">Explorar produtos</button></div>`}</div>
    </section>`;
}

function profilePage() {
  const profile = state.profile;
  return `
    <div class="page-heading"><div><span class="eyebrow">Sua conta Greenmify</span><h1>Meu perfil</h1><p class="subtitle">Mantenha suas informações e seu perfil de produtor atualizados.</p></div><span class="pill approved">${roleName()}</span></div>
    <div class="profile-layout"><section class="panel profile-card"><div class="profile-avatar">${escapeHtml(initials(profile.name))}</div><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(profile.city || "Localização não informada")}</p><span class="pill approved">${roleName()}</span><div class="profile-bio">${escapeHtml(profile.bio || "Adicione uma breve apresentação ao seu perfil.")}</div></section>
      <section class="panel"><div class="panel-header"><h3>Informações pessoais</h3><span class="result-count">Seus dados ficam neste navegador</span></div><div class="panel-content"><form id="profile-form"><div class="form-grid"><div class="field"><label for="profile-name">Nome completo</label><input id="profile-name" name="name" value="${escapeHtml(profile.name)}" required></div><div class="field"><label for="profile-email">E-mail</label><input id="profile-email" name="email" type="email" value="${escapeHtml(profile.email)}" required></div><div class="field"><label for="profile-phone">Telefone</label><input id="profile-phone" name="phone" value="${escapeHtml(profile.phone)}"></div><div class="field"><label for="profile-city">Cidade / Estado</label><input id="profile-city" name="city" value="${escapeHtml(profile.city)}"></div>${state.role === "producer" ? `<div class="field full"><label for="profile-farm">Nome da propriedade / negócio</label><input id="profile-farm" name="farm" value="${escapeHtml(profile.farm)}" placeholder="Ex.: Sítio Boa Terra"></div>` : ""}<div class="field full"><label for="profile-bio">Sobre você</label><textarea id="profile-bio" name="bio" maxlength="300" placeholder="Conte um pouco sobre você">${escapeHtml(profile.bio)}</textarea></div></div><div class="form-actions"><button class="button" type="submit">Salvar alterações</button></div></form><div class="profile-tip">Este protótipo não cria uma conta real nem envia dados para um servidor. Use o seletor “Visualizar como” para testar as experiências de consumidor, produtor e administrador.</div><div class="form-actions"><button class="button secondary" data-action="register">Criar outra conta de demonstração</button></div></div></section></div>`;
}

function moderationPage() {
  const pending = state.products.filter(item => item.moderation === "pending");
  const openReports = state.reports.filter(item => item.status === "open");
  return `
    <div class="page-heading"><div><span class="eyebrow">Área administrativa</span><h1>Moderação</h1><p class="subtitle">Revise anúncios e acompanhe denúncias feitas pela comunidade.</p></div></div>
    <div class="dashboard-stats"><div class="stat-card"><span>Anúncios para revisar</span><strong>${pending.length}</strong><small>aguardando decisão</small></div><div class="stat-card"><span>Denúncias em aberto</span><strong>${openReports.length}</strong><small>precisam de análise</small></div><div class="stat-card"><span>Anúncios publicados</span><strong>${state.products.filter(item => item.moderation === "approved").length}</strong><small>visíveis no marketplace</small></div><div class="stat-card"><span>Perfis de acesso</span><strong>3</strong><small>consumidor, produtor, admin</small></div></div>
    <section class="panel" style="margin-bottom:18px"><div class="panel-header"><h3>Anúncios aguardando aprovação</h3><span class="result-count">${pending.length} pendentes</span></div><div class="panel-content"><div class="moderation-list">${pending.length ? pending.map(item => `<article class="moderation-card"><div class="moderation-image">${escapeHtml(item.emoji)}</div><div class="moderation-copy"><h3>${escapeHtml(item.title)} <span class="pill pending">Pendente</span></h3><p>${escapeHtml(item.type)} · ${escapeHtml(item.seller)} · ${money(item.price)} / ${escapeHtml(item.unit)} · ${escapeHtml(item.location)}</p></div><div class="moderation-actions"><button class="button secondary small" data-action="details" data-id="${escapeHtml(item.id)}">Ver anúncio</button><button class="button small" data-action="approve" data-id="${escapeHtml(item.id)}">Aprovar</button><button class="button danger small" data-action="reject" data-id="${escapeHtml(item.id)}">Reprovar</button></div></article>`).join("") : `<div class="empty-state"><strong>Fila em dia</strong><p>Não há anúncios aguardando aprovação.</p></div>`}</div></div></section>
    <section class="panel"><div class="panel-header"><h3>Denúncias da comunidade</h3><span class="result-count">${openReports.length} em aberto</span></div><div class="panel-content"><div class="moderation-list">${openReports.length ? openReports.map(report => { const product = productById(report.productId); return `<article class="report-card"><span class="report-icon">!</span><div class="report-copy"><strong>${escapeHtml(product?.title || "Anúncio removido")} <span class="pill reported">Denúncia</span></strong><span>Motivo: ${escapeHtml(report.reason)}<br>Enviada por ${escapeHtml(report.reporter)} · ${escapeHtml(product?.seller || "")}</span></div><div class="report-actions"><button class="button secondary small" data-action="report-resolve" data-id="${escapeHtml(report.id)}">Marcar analisada</button>${product ? `<button class="button danger small" data-action="report-remove" data-id="${escapeHtml(report.id)}">Remover anúncio</button>` : ""}</div></article>`; }).join("") : `<div class="empty-state"><strong>Nenhuma denúncia pendente</strong><p>Novas denúncias feitas pelos consumidores aparecerão aqui.</p></div>`}</div></div></section>`;
}

function render() {
  updateChrome();
  if (activeView === "explore" || activeView === "favorites" || activeView === "seller") content.innerHTML = marketplacePage(activeView);
  else if (activeView === "listings") content.innerHTML = listingsPage();
  else if (activeView === "messages") content.innerHTML = messagesPage();
  else if (activeView === "profile") content.innerHTML = profilePage();
  else if (activeView === "moderation") content.innerHTML = moderationPage();
  renderMobileNav();
  if (activeView === "messages") {
    const thread = document.getElementById("thread-messages");
    if (thread) thread.scrollTop = thread.scrollHeight;
  }
}

function renderMobileNav() {
  let nav = document.querySelector(".mobile-nav");
  if (!nav) {
    nav = document.createElement("nav");
    nav.className = "mobile-nav";
    nav.setAttribute("aria-label", "Navegação móvel");
    document.body.append(nav);
  }
  const links = [
    ["explore", "⌕", "Explorar"],
    ["favorites", "♡", "Favoritos"],
    ["messages", "▤", "Mensagens"],
    ...(state.role !== "consumer" ? [["listings", "▦", "Anúncios"]] : []),
    ...(state.role === "admin" ? [["moderation", "◈", "Moderação"]] : []),
    ["profile", "◉", "Perfil"]
  ];
  nav.innerHTML = links.map(([view, icon, label]) => `<button data-view="${view}" class="${activeView === view ? "active" : ""}"><span>${icon}</span>${label}</button>`).join("");
}

function modal(title, subtitle, body, options = {}) {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="modal-backdrop"><section class="modal ${options.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div><h2 id="modal-title">${escapeHtml(title)}</h2>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}</div><button class="modal-close" data-action="modal-close" aria-label="Fechar">×</button></header><div class="modal-body">${body}</div></section></div>`;
  const firstInput = modalRoot.querySelector("input, select, textarea, button");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  modalRoot.innerHTML = "";
}

function productDetails(id) {
  const product = productById(id);
  if (!product) return;
  const isPending = product.moderation === "pending";
  modal(product.title, `${product.type} · ${product.category}`, `
    <div class="detail-layout"><div class="detail-art ${escapeHtml(product.tone)}"><span>${escapeHtml(product.emoji)}</span><span class="image-tag">${isPending ? "Em análise" : product.availability === "available" ? "Disponível" : "Esgotado"}</span></div><div class="detail-copy"><span class="eyebrow">${escapeHtml(product.category)} · ${escapeHtml(product.location)}</span><h2>${escapeHtml(product.title)}</h2><div class="detail-price">${money(product.price)} <small>/ ${escapeHtml(product.unit)}</small></div><p>${escapeHtml(product.description)}</p>    <div class="detail-facts"><div><span>Vendedor</span><strong>${escapeHtml(product.seller)}</strong></div><div><span>Quantidade</span><strong>${product.quantity > 0 ? `${product.quantity} ${escapeHtml(product.unit)}` : "Indisponível"}</strong></div><div><span>Categoria</span><strong>${escapeHtml(product.category)}</strong></div><div><span>Tipo</span><strong>${escapeHtml(product.type)}</strong></div>${product.type === "Equipamento agrícola" ? `<div><span>Marca / modelo</span><strong>${escapeHtml(product.brand || "Não informado")}</strong></div><div><span>Condição</span><strong>${escapeHtml(product.condition || "Não informada")}</strong></div>` : ""}</div><button class="seller-box" data-action="seller-profile" data-seller="${escapeHtml(product.seller)}"><span class="conversation-avatar">${escapeHtml(initials(product.seller))}</span><span style="text-align:left"><strong>${escapeHtml(product.seller)}</strong><span>Conheça o perfil do produtor →</span></span></button><div class="modal-actions">${state.role === "consumer" ? `<button class="button" data-action="contact" data-id="${escapeHtml(product.id)}">Falar com produtor</button><button class="button secondary" data-action="report" data-id="${escapeHtml(product.id)}">Denunciar anúncio</button>` : `<button class="button secondary" data-action="listing-edit" data-id="${escapeHtml(product.id)}">Editar anúncio</button>`}<button class="button secondary" data-action="favorite" data-id="${escapeHtml(product.id)}">${state.favorites.includes(product.id) ? "♥ Salvo" : "♡ Favoritar"}</button></div></div></div>`, { wide: true });
}

function compareProducts() {
  const products = state.compare.map(productById).filter(Boolean);
  if (products.length < 2) return toast("Selecione pelo menos dois produtos para comparar.", "error");
  modal("Compare suas opções", "Veja lado a lado as informações dos produtos selecionados.", `
    <div style="overflow-x:auto"><table class="comparison-table"><thead><tr><th>Característica</th>${products.map(item => `<th class="comparison-product">${escapeHtml(item.emoji)} ${escapeHtml(item.title)}</th>`).join("")}</tr></thead><tbody>
      <tr><td>Preço</td>${products.map(item => `<td>${money(item.price)} / ${escapeHtml(item.unit)}</td>`).join("")}</tr>
      <tr><td>Categoria</td>${products.map(item => `<td>${escapeHtml(item.category)}</td>`).join("")}</tr>
      <tr><td>Vendedor</td>${products.map(item => `<td>${escapeHtml(item.seller)}</td>`).join("")}</tr>
      <tr><td>Localização</td>${products.map(item => `<td>${escapeHtml(item.location)}</td>`).join("")}</tr>
      <tr><td>Disponibilidade</td>${products.map(item => `<td>${item.availability === "available" ? "Disponível" : "Esgotado"}</td>`).join("")}</tr>
      <tr><td>Descrição</td>${products.map(item => `<td>${escapeHtml(item.description)}</td>`).join("")}</tr>
    </tbody></table></div><div class="modal-actions"><button class="button secondary" data-action="compare-clear">Limpar seleção</button><button class="button" data-action="modal-close">Continuar explorando</button></div>`, { wide: true });
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(item => item !== id);
    toast("Produto removido dos favoritos.");
  } else {
    state.favorites.push(id);
    toast("Produto salvo nos favoritos.");
  }
  persist();
  if (modalRoot.innerHTML) productDetails(id);
  else render();
}

function toggleCompare(id, checked) {
  if (checked && state.compare.length >= 3) {
    toast("Você pode comparar até 3 produtos por vez.", "error");
    render();
    return;
  }
  state.compare = checked ? [...state.compare, id] : state.compare.filter(item => item !== id);
  persist();
  render();
}

function startConversation(productId) {
  const product = productById(productId);
  if (!product) return;
  let conversation = state.conversations.find(item => item.productId === productId);
  if (!conversation) {
    conversation = { id: `c-${Date.now()}`, productId, buyer: state.profile.name, seller: product.seller, partner: product.seller, messages: [{ sender: "me", text: `Olá! Tenho interesse em ${product.title}.`, time: currentTime() }] };
    state.conversations.unshift(conversation);
  } else if (!conversation.messages.some(message => message.sender === "me")) {
    conversation.messages.push({ sender: "me", text: `Olá! Tenho interesse em ${product.title}.`, time: currentTime() });
  }
  selectedConversationId = conversation.id;
  persist();
  closeModal();
  setView("messages");
  toast("Conversa iniciada com o produtor.");
}

function currentTime() {
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function reportProduct(id) {
  const product = productById(id);
  if (!product) return;
  modal("Denunciar anúncio", `Ajude a manter o marketplace seguro. Anúncio: ${product.title}`, `
    <form id="report-form" data-id="${escapeHtml(id)}"><div class="field"><label for="report-reason">Por que você está denunciando?</label><select id="report-reason" name="reason" required><option value="">Selecione um motivo</option><option>Informação incorreta ou enganosa</option><option>Preço suspeito</option><option>Produto proibido ou inadequado</option><option>Anúncio duplicado</option><option>Outro motivo</option></select></div><div class="field" style="margin-top:12px"><label for="report-details">Detalhes adicionais (opcional)</label><textarea id="report-details" name="details" maxlength="300" placeholder="Descreva o que chamou sua atenção"></textarea></div><div class="form-actions"><button type="button" class="button secondary" data-action="modal-close">Cancelar</button><button class="button" type="submit">Enviar denúncia</button></div></form>`);
}

function listingForm(product) {
  const editing = Boolean(product);
  const item = product || { type: "Produto agrícola", category: "Hortifruti", title: "", price: "", unit: "kg", quantity: "", description: "", location: state.profile.city || "", emoji: "🌱", seller: state.profile.farm || "Sítio Boa Terra", tone: "sky", brand: "", condition: "", availability: "available" };
  const categories = ["Hortifruti", "Grãos e cereais", "Mudas e sementes", "Mel e derivados", "Laticínios", "Irrigação", "Máquinas e ferramentas", "Outros"];
  modal(editing ? "Editar anúncio" : "Novo anúncio", "Um formulário único para produtos agrícolas e equipamentos.", `
    <div class="form-note">Cadastro unificado (MUD01): selecione o tipo de anúncio para visualizar os campos adequados. A unidade de medida é obrigatória para produtos agrícolas.</div>
    <form id="listing-form" data-id="${editing ? escapeHtml(item.id) : ""}"><div class="form-grid">
      <div class="field"><label for="listing-type">Tipo de anúncio</label><select id="listing-type" name="type"><option ${item.type === "Produto agrícola" ? "selected" : ""}>Produto agrícola</option><option ${item.type === "Equipamento agrícola" ? "selected" : ""}>Equipamento agrícola</option></select></div>
      <div class="field"><label for="listing-category">Categoria</label><select id="listing-category" name="category">${categories.map(category => `<option ${item.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}</select></div>
      <div class="field full"><label for="listing-title">Nome do anúncio</label><input id="listing-title" name="title" value="${escapeHtml(item.title)}" maxlength="70" placeholder="Ex.: Tomate italiano orgânico" required></div>
      <div class="field"><label for="listing-price">Preço (R$)</label><input id="listing-price" name="price" type="number" min="0.01" step="0.01" value="${escapeHtml(item.price)}" placeholder="0,00" required></div>
      <div class="field" id="listing-unit-field"><label for="listing-unit">Unidade de medida</label><select id="listing-unit" name="unit" required>${["kg", "unidade", "caixa", "litro", "tonelada"].map(unit => `<option ${item.unit === unit ? "selected" : ""}>${unit}</option>`).join("")}</select></div>
      <div class="field" id="listing-brand-field" hidden><label for="listing-brand">Marca / modelo</label><input id="listing-brand" name="brand" value="${escapeHtml(item.brand || "")}" maxlength="80" placeholder="Ex.: TerraForte 52cc"></div>
      <div class="field" id="listing-condition-field" hidden><label for="listing-condition">Condição</label><select id="listing-condition" name="condition"><option value="">Selecione</option>${["Novo", "Usado — revisado", "Seminovo — revisado"].map(condition => `<option ${item.condition === condition ? "selected" : ""}>${condition}</option>`).join("")}</select></div>
      <div class="field"><label for="listing-quantity">Quantidade disponível</label><input id="listing-quantity" name="quantity" type="number" min="0" step="1" value="${escapeHtml(item.quantity)}" placeholder="Ex.: 25" required></div>
      <div class="field"><label for="listing-location">Cidade / Estado</label><input id="listing-location" name="location" value="${escapeHtml(item.location)}" placeholder="Ex.: Gravatá, PE" required></div>
      <div class="field full"><label for="listing-description">Descrição</label><textarea id="listing-description" name="description" maxlength="450" placeholder="Conte o que torna este anúncio especial" required>${escapeHtml(item.description)}</textarea></div>
    </div><div class="form-actions"><button type="button" class="button secondary" data-action="modal-close">Cancelar</button><button class="button" type="submit">${editing ? "Salvar alterações" : "Enviar para aprovação"}</button></div></form>`);
  const typeSelect = document.getElementById("listing-type");
  const unitSelect = document.getElementById("listing-unit");
  const brandField = document.getElementById("listing-brand-field");
  const conditionField = document.getElementById("listing-condition-field");
  const brandInput = document.getElementById("listing-brand");
  const conditionSelect = document.getElementById("listing-condition");
  const syncTypeFields = () => {
    const isProduct = typeSelect.value === "Produto agrícola";
    document.getElementById("listing-unit-field").hidden = !isProduct;
    unitSelect.disabled = !isProduct;
    unitSelect.required = isProduct;
    brandField.hidden = isProduct;
    conditionField.hidden = isProduct;
    brandInput.disabled = isProduct;
    conditionSelect.disabled = isProduct;
  };
  typeSelect?.addEventListener("change", () => {
    if (typeSelect.value === "Equipamento agrícola") {
      if (document.getElementById("listing-category").value === "Hortifruti") document.getElementById("listing-category").value = "Máquinas e ferramentas";
      unitSelect.value = "unidade";
    }
    syncTypeFields();
  });
  syncTypeFields();
}

function registrationForm() {
  modal("Criar sua conta", "Um cadastro demonstrativo, sem envio de dados a um servidor.", `
    <form id="registration-form"><div class="form-grid"><div class="field full"><label for="register-name">Nome completo</label><input id="register-name" name="name" placeholder="Ex.: Ana Souza" required></div><div class="field"><label for="register-email">E-mail</label><input id="register-email" name="email" type="email" placeholder="voce@email.com" required></div><div class="field"><label for="register-city">Cidade / Estado</label><input id="register-city" name="city" placeholder="Ex.: Recife, PE"></div><div class="field full"><label for="register-role">Como você quer usar o Greenmify?</label><select id="register-role" name="role"><option value="consumer">Quero encontrar produtos (consumidor)</option><option value="producer">Quero divulgar meus produtos (produtor)</option></select></div></div><div class="form-actions"><button type="button" class="button secondary" data-action="modal-close">Cancelar</button><button class="button" type="submit">Criar conta de demonstração</button></div></form>`);
}

function handleAction(button) {
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (action === "favorite") return toggleFavorite(id);
  if (action === "details") return productDetails(id);
  if (action === "compare") return toggleCompare(id, button.checked);
  if (action === "compare-open") return compareProducts();
  if (action === "compare-clear") {
    state.compare = [];
    persist();
    closeModal();
    return render();
  }
  if (action === "modal-close") return closeModal();
  if (action === "listing-new") return listingForm();
  if (action === "register") return registrationForm();
  if (action === "listing-edit") return listingForm(productById(id));
  if (action === "availability") {
    const product = productById(id);
    if (!product) return;
    product.availability = product.availability === "available" ? "unavailable" : "available";
    if (product.availability === "available") product.quantity = Math.max(product.quantity, 1);
    persist();
    render();
    return toast(product.availability === "available" ? "Anúncio marcado como disponível." : "Anúncio marcado como esgotado.");
  }
  if (action === "contact") return startConversation(id);
  if (action === "report") return reportProduct(id);
  if (action === "approve" || action === "reject") {
    const product = productById(id);
    if (!product) return;
    product.moderation = action === "approve" ? "approved" : "rejected";
    persist();
    render();
    return toast(action === "approve" ? "Anúncio aprovado e publicado." : "Anúncio reprovado.");
  }
  if (action === "report-resolve" || action === "report-remove") {
    const report = state.reports.find(item => item.id === id);
    if (!report) return;
    if (action === "report-remove") {
      const product = productById(report.productId);
      if (product) product.moderation = "rejected";
    }
    report.status = "resolved";
    persist();
    render();
    return toast(action === "report-remove" ? "Anúncio removido e denúncia analisada." : "Denúncia marcada como analisada.");
  }
  if (action === "category") {
    selectedCategory = button.dataset.category;
    return render();
  }
  if (action === "conversation-select") {
    selectedConversationId = id;
    return render();
  }
  if (action === "seller-profile") {
    sellerProfileName = button.dataset.seller;
    selectedCategory = "Todos";
    searchTerm = "";
    maxPrice = "";
    closeModal();
    setView("seller");
    return;
  }
  if (action === "modal-backdrop" && button.target === button) closeModal();
}

document.addEventListener("click", event => {
  const viewLink = event.target.closest("[data-view]");
  if (viewLink) {
    event.preventDefault();
    if (viewLink.dataset.view === "seller") sellerProfileName = viewLink.dataset.seller || "";
    setView(viewLink.dataset.view);
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (actionButton && actionButton.dataset.action !== "compare") {
    if (actionButton.dataset.action === "modal-backdrop" && event.target.closest(".modal")) return;
    handleAction(actionButton);
  }
});

document.addEventListener("change", event => {
  if (event.target.matches("#role-switch")) {
    state.role = event.target.value;
    persist();
    if ((activeView === "listings" && state.role === "consumer") || (activeView === "moderation" && state.role !== "admin")) activeView = "explore";
    render();
    toast(`Visualizando como ${roleName()}.`);
  }
  if (event.target.matches("#price-filter")) {
    maxPrice = event.target.value;
    render();
  }
  if (event.target.matches("#sort-filter")) {
    sortOrder = event.target.value;
    render();
  }
  if (event.target.matches('[data-action="compare"]')) toggleCompare(event.target.dataset.id, event.target.checked);
});

document.addEventListener("submit", event => {
  const form = event.target;
  if (form.id === "search-form") {
    event.preventDefault();
    searchTerm = new FormData(form).get("search").trim();
    render();
  } else if (form.id === "listing-form") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const existing = productById(form.dataset.id);
    if (!data.title.trim() || !data.description.trim() || Number(data.price) <= 0 || Number(data.quantity) < 0) return toast("Confira os campos obrigatórios antes de salvar.", "error");
    if (existing) {
      Object.assign(existing, {
        ...data,
        price: Number(data.price),
        quantity: Number(data.quantity),
        unit: data.unit || "unidade",
        seller: state.profile.farm || existing.seller,
        owner: "me",
        moderation: "pending"
      });
    } else {
      state.products.unshift({
        ...data,
        id: `p-${Date.now()}`,
        price: Number(data.price),
        quantity: Number(data.quantity),
        unit: data.unit || "unidade",
        emoji: data.type === "Equipamento agrícola" ? "🛠️" : "🌱",
        tone: data.type === "Equipamento agrícola" ? "clay" : "sky",
        seller: state.profile.farm || state.profile.name,
        owner: "me",
        availability: Number(data.quantity) > 0 ? "available" : "unavailable",
        moderation: "pending",
        created: new Date().toISOString().slice(0, 10)
      });
    }
    persist();
    closeModal();
    render();
    toast(existing ? "Alterações salvas. O anúncio voltou para análise." : "Anúncio enviado para aprovação.");
  } else if (form.id === "profile-form") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    state.profile = { ...state.profile, ...data };
    if (state.role === "producer" && data.farm) {
      state.products.filter(item => item.owner === "me").forEach(item => item.seller = data.farm);
    }
    persist();
    render();
    toast("Perfil atualizado com sucesso.");
  } else if (form.id === "registration-form") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    state.profile = { ...state.profile, name: data.name.trim(), email: data.email.trim(), city: data.city.trim() };
    state.role = data.role;
    persist();
    closeModal();
    setView("explore");
    toast(`Conta de demonstração criada. Olá, ${state.profile.name}!`);
  } else if (form.id === "report-form") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.reason) return toast("Selecione um motivo para a denúncia.", "error");
    const product = productById(form.dataset.id);
    state.reports.unshift({ id: `r-${Date.now()}`, productId: form.dataset.id, reason: `${data.reason}${data.details.trim() ? ` — ${data.details.trim()}` : ""}`, reporter: state.profile.name, status: "open" });
    persist();
    closeModal();
    render();
    toast(`Denúncia enviada para análise${product ? `: ${product.title}` : ""}.`);
  } else if (form.id === "message-form") {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const text = data.message.trim();
    if (!text) return;
    const conversation = state.conversations.find(item => item.id === selectedConversationId);
    if (!conversation) return toast("Não foi possível encontrar esta conversa.", "error");
    conversation.messages.push({ sender: state.role === "producer" ? "other" : "me", text, time: currentTime() });
    persist();
    render();
  }
});

document.addEventListener("input", event => {
  if (event.target.matches("#conversation-search")) {
    const cursor = event.target.selectionStart;
    conversationFilter = event.target.value;
    const list = event.target.closest(".conversation-list");
    const scrollTop = list.scrollTop;
    const selected = selectedConversationId;
    render();
    const input = document.getElementById("conversation-search");
    if (input) {
      input.focus();
      input.setSelectionRange(cursor, cursor);
      input.closest(".conversation-list").scrollTop = scrollTop;
    }
    selectedConversationId = selected;
  }
});

document.getElementById("create-account").addEventListener("click", registrationForm);
window.addEventListener("online", () => {
  updateChrome();
  toast("Conexão restaurada. Os dados locais permanecem disponíveis.");
});
window.addEventListener("offline", () => {
  updateChrome();
  toast("Você está offline. Este protótipo continua usando os dados salvos neste navegador.");
});

render();
