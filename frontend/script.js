// Endereço da API backend
const API_URL = "http://localhost:3000/fretes";

// Função principal para cadastrar um novo frete
async function cadastrarFrete() {
    // Captura os valores digitados pelo usuário
    const origem = document.getElementById("origem").value.trim();
    const destino = document.getElementById("destino").value.trim();
    const peso = Number(document.getElementById("peso").value);

    // Validação para impedir cadastro vazio
    if (!origem || !destino || !peso) {
        alert("Preencha todos os campos");
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

    // Envia o novo frete para a API usando POST
    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoFrete)
    });

    // Limpa os campos do formulário
    limparCampos();

    // Atualiza a lista de fretes na tela
    carregarFretes();
}

// Função para excluir um frete pelo ID
async function excluirFrete(id) {
    // Envia uma requisição DELETE para o backend
    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    // Atualiza a lista após excluir
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

    // Pega a área onde os fretes serão exibidos
    const lista = document.getElementById("listaFretes");

    // Limpa a lista antes de renderizar novamente
    lista.innerHTML = "";

    // Cria um card para cada frete cadastrado
    fretes.forEach(frete => {
        lista.innerHTML += `
            <div class="item">
                <strong>${frete.origem}</strong> → ${frete.destino}<br>
                Peso: ${frete.peso} kg<br>
                Valor calculado: ${formatarMoeda(frete.valor)}<br><br>

                <button onclick="excluirFrete(${frete.id})" class="btn-excluir">
                    Excluir
                </button>
            </div>
        `;
    });
}

// Carrega os fretes automaticamente quando a página abre
carregarFretes();