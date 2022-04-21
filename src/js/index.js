/* Rescuperando elementos do arquivo HTML */
const formulario = document.querySelector("form");
const email = document.getElementById("inputEmailLogin");
const senha = document.getElementById("inputSenhaLogin");
const botao = document.getElementById("botaoLogin")
const divAlertError = document.getElementById("divAlertError")
const botaoAlertError = document.getElementById("botaoAlertError")
const tasks = "tasks.html";


/* Criando variáveis dos objetos necessários para requisição (tem de ser escopo global) */
const body = {
    "email": ``,
    "password": ``
}

const settings = {
    method: "POST",
    headers:{
        'Content-Type': 'application/json'
    },
    body: ""
}



/* Evento de 1.autenticação simples; 2.habiitação do botão de login; 3.atribuição dos valores as propriedades dos objetos da requisição*/

formulario.addEventListener("change" ,() => {

    var mailformat = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

    if(email.value.match(mailformat) && senha.value.length >= 6){
        botao.removeAttribute("disabled");
        botao.innerText = "Acessar"
        console.log('email valido!');
    }
    
    

    body.email = email.value;
    body.password = senha.value;
  
    settings.body = JSON.stringify(body);

})




/* Criando corpo e configurações da requisição e evento que dispara a requisição */
const URL_API = "https://ctd-todo-api.herokuapp.com/v1";




formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    

    setTimeout(() => {
        fetch(`${URL_API}/users/login`, settings)
        .then((result) =>{
            console.log(result.status)
            if(result.status == 201 || result.status == 200){

                return result.json();
                
            }else{

                
            }
            
        }).then((info) => {
            
            let token = info;
            localStorage.setItem("jwt", token.jwt)
            formulario.reset()
            location.href = tasks;
            
        }).catch( (error) => {
            
            divAlertError.classList.remove("alertErroEscondido")
            console.error("Criação de um novo usuário não concluida, segue o erro: " + error);
    
        })

    }, 500)
    
    botaoAlertError.addEventListener("click", () => {
    
        divAlertError.classList.add("alertErroEscondido")
       
    })
    
})
