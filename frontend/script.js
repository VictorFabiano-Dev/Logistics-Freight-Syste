let fretes = [];

function cadastrarFrete() {
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const peso = document.getElementById("peso").value;
    const valor = document.getElementById("valor").value;

    if(!origem || !destino || !peso || !valor) {
        alert("Preencha Todos os Campos");
        return;
    }

    
    const frete = {
        origem,
        destino,
        peso,
        valor
    };

    fretes.push(frete);

    limpaCampos();
    renderizarFretes();
}

function limparCampos() {
    document.getElementById("origem").value = "";
    document.getElementById("destino").value = "";
    document.getElementById("peso").value = "";
    document.getElementById("valor").value = "";
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function renderizarFretes() {
    const lista = document.getElementById("listaFretes");
    lista.innerHTML = "";

    fretes.forEach(frete => {
        lista.innerHTML += `
            <div class="item">
                <strong>${frete.origem}</strong> -> ${frete.destino}<br>
                peso: ${frete.peso} kg<br>
                valor: R$ ${frete.valor}
            </div>
        `;
    });
}