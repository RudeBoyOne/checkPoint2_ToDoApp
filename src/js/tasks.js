/* 1. Declarando as variáveis globais */
const URL_API = "https://ctd-todo-api.herokuapp.com/v1";
const jwt = localStorage.getItem('jwt');
let infoUsuario;
let tasks;
let botaoSair = document.getElementById("finalizarSessao");
let botaoExcluiTarefa = document.getElementById("botaoModalExluiTarefa")

const settings = {
    headers : {
        "authorization": `${jwt}`
    },
};



/* 2. Escutando evento de carregamento da page para chamar as funções para requisições dos dados e tarefas do usuário e renderiza-los no viewport */
window.addEventListener("load",   () =>{
    
    buscaInfosDoUsuario()
    buscaTarefasUsuario()
    
});


async function buscaInfosDoUsuario(){
    try {
        const response = await fetch(`${URL_API}/users/getMe`, settings);
        const responseEmJson = await response.json();
        infoUsuario = responseEmJson;
        let divNomeUsuario = document.getElementById("nomeUsuario");
        let tituloNomeUsuario = document.createElement("h1");
        tituloNomeUsuario.innerText = `${infoUsuario.firstName} ${infoUsuario.lastName}`;
        divNomeUsuario.appendChild(tituloNomeUsuario)
    }catch(error){
        console.error(error)
    };
}

async function buscaTarefasUsuario(){
    try{
        const response = await fetch(`${URL_API}/tasks`, settings);
        const responseEmJson = await response.json();
        tasks = responseEmJson;
        renderizaTarefasPendentes(tasks);
        renderizaTarefasConcluidas(tasks);
    }catch(error){
        console.error(error)
    };
    
}

function renderizaTarefasPendentes(tarefas){
    tarefas.forEach(tarefa => {
            
        if(!tarefa.completed){
            let listadeTarefas = document.getElementById("listaTasks")
            let itemListaTarefas = document.createElement("li");
            let botaoCompleta = document.createElement("button");
            let caixaTextoData = document.createElement("div")
            let textoTarefa = document.createElement("p");
            let dataTarefa = document.createElement("p");
            let lixeira = document.createElement("div");
            let calendar = document.createElement("div")
            let iconeLixeira = `<svg width="20" height="20" fill="#dc3545" class="bi bi-trash2-fill" viewBox="0 0 14 14">
            <path d="M2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225zm9.89-.69C10.966 2.214 9.578 2 8 2c-1.58 0-2.968.215-3.926.534-.477.16-.795.327-.975.466.18.14.498.307.975.466C5.032 3.786 6.42 4 8 4s2.967-.215 3.926-.534c.477-.16.795-.327.975-.466-.18-.14-.498-.307-.975-.466z"/>
          </svg>`
            let iconCalendar = `<svg width="16" height="16" fill="currentColor" class="bi bi-calendar4-event" viewBox="0 0 16 16">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z"/>
            <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
          </svg>`
            let iconCheck = `<svg width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 11 15">
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
          </svg>`

            let data = new Date(tarefa.createdAt);
            let dataFormatada = data.toLocaleDateString('pt-BR')
            
            itemListaTarefas.classList.add("list-group-item");
            botaoCompleta.setAttribute("type", "button")
            botaoCompleta.classList.add( "btn-outline-primary", "btn")
            botaoCompleta.innerHTML = iconCheck;
            textoTarefa.innerText = `${tarefa.description}`;
            dataTarefa.innerText =  `${dataFormatada} |`;
            caixaTextoData.appendChild(textoTarefa);
            calendar.innerHTML = iconCalendar;
            caixaTextoData.appendChild(calendar)
            calendar.appendChild( dataTarefa);
            calendar.classList.add("arrumaData")
            caixaTextoData.classList.add("itemBox");
            itemListaTarefas.appendChild(botaoCompleta);
            itemListaTarefas.appendChild(caixaTextoData);
            lixeira.innerHTML = iconeLixeira;
            lixeira.classList.add("delete")
            lixeira.setAttribute("data-bs-toggle", "modal")
            lixeira.setAttribute("data-bs-target", "#modalExluiTarefa")
            itemListaTarefas.appendChild(lixeira);
            listadeTarefas.appendChild(itemListaTarefas);

            lixeira.addEventListener('click', (evento) => {

                evento.target.id = tarefa.id

                botaoExcluiTarefa.addEventListener("click" , () =>{
                    deletarTarefa(evento.target.id);
                })

            });

            botaoCompleta.addEventListener("click", () => {
                marcarTarefaConcluidaOuPendente(tarefa, true);
            })

            
        }    

    });
}

function renderizaTarefasConcluidas(tarefas){
    tarefas.forEach(tarefa => {
        if(tarefa.completed){
            let listadeTarefas = document.getElementById("completasTasks")
            let itemListaTarefas = document.createElement("li");
            let caixaTexto = document.createElement("div")
            let textoTarefa = document.createElement("p");
            let buttonVoltar = document.createElement("button")
            let iconRecarega = `<svg width="18" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 11 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
          </svg>`


            itemListaTarefas.classList.add("list-group-item");
            textoTarefa.innerText = `${tarefa.description}`;
            caixaTexto.appendChild(textoTarefa);
            buttonVoltar.innerHTML = iconRecarega;
            buttonVoltar.classList.add("btn-outline-primary", "btn")
            caixaTexto.appendChild(buttonVoltar)
            caixaTexto.classList.add("itemBox");
            itemListaTarefas.appendChild(caixaTexto);
            listadeTarefas.appendChild(itemListaTarefas);


            buttonVoltar.addEventListener("click", () => {
                marcarTarefaConcluidaOuPendente(tarefa, false);
            })
        }

    })
}


/* Adicionando uma nova tarefa */

// 1 Recuperando elementos necessários
let formNovaTarefa = document.getElementById("formAdicionaTarefa");
let inputNovaTarefa = document.getElementById("novaTarefa");
let botaoTarefa = document.getElementById("botaoTarefa");


// 2 Escutando evento de submit do formulário de envio de uma nova tarefa
formNovaTarefa.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // 3 Validação simples para evitar envio de tarefas sem conteúdo
    if(inputNovaTarefa.value.length > 0){
        
        // 4 Criação das configurações necessárias para requisição a API (envio das novas tarefas)
        let body = {
            "description": `${inputNovaTarefa.value}`,
            "completed": false
        }
    
        const settings = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-type': 'application/json', 
                'Authorization': `${jwt}` 
            }
        }
        
        // 5 Requisição de envio das novas tarefas
        fetch(`${URL_API}/tasks`, settings)
        .then((response)=> {
            return response.json()
        }).then(() => {
            window.location.reload()
        }).catch((error) => {
            console.error(error);
        })
    
        // 4.6 Reset do input (limpa o input do conteúdo digitado)
        formNovaTarefa.reset()
    }else{
        alert("Adicione uma tarefa válida!")
    }   
    
})



/* Deletando uma tarefa */
function deletarTarefa(id){
        
    const settings = {
        method : "DELETE", 

        headers : {

            'Content-type': 'application/json',
            "Authorization": `${jwt}`
        },
    };

    fetch(`${URL_API}/tasks/${id}`, settings)
    .then((response)=> {

    let status = response.status
        return status;

    }).then((status) => {
        if(status == 200){

            window.location.reload()

        }
        
    }).catch((error) => {
        console.error(error)
    })

}


/* Modifica o status de uma tarefa como concluída */
function marcarTarefaConcluidaOuPendente(infoTarefa, status){

    const settings = {
        method: "PUT",
        body:JSON.stringify({
            "completed": status
        }),
        headers: {
            "Authorization": `${jwt}`,
            'Content-type': 'application/json',
        },
    }

    fetch(`${URL_API}/tasks/${infoTarefa.id}`, settings)
    .then((response) => {
        
        return response.status

    }).then((status) => {
        if(status == 200){

            window.location.reload()

        }
        
    }).catch((error) => {
        console.error(error)
    });
}


/* Reenviando tarefa para card de pendentes */
function retornaTarefaPendentes(infoTarefa){

    const settings = {
        method: "PUT",
        body:JSON.stringify({
            "completed": false
        }),
        headers: {
            "Authorization": `${jwt}`,
            'Content-type': 'application/json',
        },
    }


}

// Fazer voltar para tela de login
botaoSair.addEventListener('click', () =>{
    
    setTimeout(() => {
        
        location.href = "index.html";

    }, 4000)

});

