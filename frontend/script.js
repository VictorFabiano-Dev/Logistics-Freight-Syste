// Endereço da API backend
const API_URL = "http://localhost:3000/fretes";
let fretesCarregados = [];
let freteEditandoId = null;

// Função principal para cadastrar ou editar frete
async function cadastrarFrete() {
    // Captura os valores digitados pelo usuário
    const origem = document.getElementById("origem").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const peso = Number(document.getElementById("peso").value);

    // Validação para impedir cadastro vazio
    if (origem.length < 2) {
    alert("Informe uma origem válida.");
    return;
}

if (destino.length < 2) {
    alert("Informe um destino válido.");
    return;
}

if (!peso || peso <= 0) {
    alert("Informe um peso maior que zero.");
    return;
}

if (peso > 40000) {
    alert("Peso muito alto. Verifique se o valor está correto.");
    return;
}

    // Calcula o valor do frete automaticamente
    const valor = calcularFrete(origem, destino, peso);

    // Objeto que será enviado para o backend
    const novoFrete = {
        origem,
        destino,
        peso,
        valor
    };

    //Se existir ID em edição → atualiza
    if (freteEditandoId !== null) {
        await fetch(`${API_URL}/${freteEditandoId}`, {
            method: "PUT",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(novoFrete)
        });

    freteEditandoId = null;
    document.querySelector("button").innerText = "Cadastrar";document.getElementById("btnCadastrar").innerText =
    "Cadastrar";
    } else {
        // Senão → cria novo
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoFrete)
        });
    }

    // Limpa os campos do formulário
    limparCampos();

    // Atualiza a lista de fretes na tela
    carregarFretes();
}

function editarFrete(id) {
    const frete = fretesCarregados.find(item => item.id === id);

    document.getElementById("origem").value = frete.origem;
    document.getElementById("destino").value = frete.destino;
    document.getElementById("peso").value = frete.peso;

    freteEditandoId = id;

    document.getElementById("btnCadastrar").innerText =
    "Salvar Alteração";
}

// Função para excluir um frete pelo ID
async function excluirFrete(id) {
    const confirmar = confirm("Deseja realmente excluir este frete?");

    if (!confirmar) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    // Atualiza a lista após excluir
    carregarFretes();
}

async function resetarBase() {
    const confirmar = confirm("Deseja realmente apagar todos os fretes?");

    if (!confirmar) {
        return;
    }

    await fetch(API_URL, {
        method: "DELETE"
    });

    carregarFretes();
}

// Regra de negócio para calcular o valor do frete
function calcularFrete(origem, destino, peso) {
    let valorKg = 0;

    // Define o valor por kg conforme a faixa de peso
    if (peso <= 100) {
        valorKg = 1.2;
    } else if (peso <= 500) {
        valorKg = 1.0;
    } else {
        valorKg = 0.85;
    }

    // Define a taxa da rota
    // Se origem e destino forem iguais, taxa menor
    // Se forem diferentes, taxa maior
    const taxaRota =
        origem.toLowerCase() === destino.toLowerCase()
            ? 150
            : 400;

    // Retorna o valor final do frete
    return (peso * valorKg) + taxaRota;
}

// Limpa os campos do formulário
function limparCampos() {
    document.getElementById("origem").value = "";
    document.getElementById("destino").value = "";
    document.getElementById("peso").value = "";
}

// Formata valores para moeda brasileira
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Busca todos os fretes cadastrados na API e mostra na tela
async function carregarFretes() {
    // Busca os dados no backend
    const resposta = await fetch(API_URL);

    // Converte a resposta para JSON
    const fretes = await resposta.json();

    fretesCarregados = fretes;

    atualizarDashboard(fretes);
    renderizarGraficoDestinos(fretes);
    renderizarInsights(fretes);
    // Pega a área onde os fretes serão exibidos
    renderizarListaFretes(fretes);
}

function atualizarDashboard(fretes) {
    const totalFretes = fretes.length;

    const faturamentoTotal = fretes.reduce((total, frete) => {
        return total + frete.valor;
    }, 0);

    const pesoTotal = fretes.reduce((total, frete) => {
        return total + frete.peso;
    }, 0);

    const ticketMedio = totalFretes > 0
        ? faturamentoTotal / totalFretes
        : 0;

    document.getElementById("totalFretes").innerText =
    totalFretes.toLocaleString("pt-BR");
    document.getElementById("faturamentoTotal").innerText = formatarMoeda(faturamentoTotal);
    document.getElementById("pesoTotal").innerText =
    `${pesoTotal.toLocaleString("pt-BR")} kg`;
    document.getElementById("ticketMedio").innerText = formatarMoeda(ticketMedio);
}

// Renderiza gráfico simples de fretes por destino
function renderizarGraficoDestinos(fretes) {
    const grafico = document.getElementById("graficoDestinos");

    grafico.innerHTML = "";

    const destinos = {};

    fretes.forEach(frete => {
        if (!destinos[frete.destino]) {
            destinos[frete.destino] = 0;
        }

        destinos[frete.destino]++;
    });

    const maiorQuantidade = Math.max(...Object.values(destinos), 1);

    Object.entries(destinos).forEach(([destino, quantidade]) => {
        const largura = (quantidade / maiorQuantidade) * 100;

        grafico.innerHTML += `
            <div class="barra-item">
                <div class="barra-info">
                    <span>${destino}</span>
                    <strong>${quantidade} frete(s)</strong>
                </div>

                <div class="barra-fundo">
                    <div class="barra" style="width:${largura}%"></div>
                </div>
            </div>
        `;
    });
}

function renderizarInsights(fretes) {
    const insights = document.getElementById("insights");

    if (fretes.length === 0) {
        insights.innerHTML = "Nenhum dado disponível.";
        return;
    }

    const destinos = {};

    fretes.forEach(frete => {
        destinos[frete.destino] = (destinos[frete.destino] || 0) + 1;
    });

    const rotaMaisUsada = Object.entries(destinos)
        .sort((a, b) => b[1] - a[1])[0];

    const maiorFrete = fretes.reduce((maior, frete) => {
        return frete.valor > maior.valor ? frete : maior;
    }, fretes[0]);

    const pesoMedio = fretes.reduce((total, frete) => {
        return total + frete.peso;
    }, 0) / fretes.length;

    insights.innerHTML = `
        <p>Rota mais usada: <strong>${rotaMaisUsada[0]}</strong></p>
        <p>Maior frete: <strong>${formatarMoeda(maiorFrete.valor)}</strong></p>
        <p>Média de peso: <strong>${pesoMedio.toLocaleString("pt-BR")} kg</strong></p>
    `;
}

// Filtra fretes por origem ou destino
function filtrarFretes() {
    const termo = document.getElementById("filtroFretes").value
        .trim()
        .toLowerCase();

    const fretesFiltrados = fretesCarregados.filter(frete => {
        const origem = frete.origem.toLowerCase();
        const destino = frete.destino.toLowerCase();

        return origem.includes(termo) || destino.includes(termo);
    });

    renderizarListaFretes(fretesFiltrados);
}

// Renderiza a lista de fretes na tela
function renderizarListaFretes(fretes) {
    const lista = document.getElementById("listaFretes");

    lista.innerHTML = "";

    fretes.forEach(frete => {
        lista.innerHTML += `
            <div class="item">
                <strong>${frete.origem}</strong> → ${frete.destino}<br>
                Peso: ${frete.peso.toLocaleString("pt-BR")} kg<br>
                Valor calculado: ${formatarMoeda(frete.valor)}<br><br>

                <button onclick="editarFrete(${frete.id})" class="btn-editar">
                Editar
                </button>

                <button onclick="excluirFrete(${frete.id})" class="btn-excluir">
                    Excluir
                </button>
            </div>
        `;
    });
}

// Carrega os fretes automaticamente quando a página abre
carregarFretes();