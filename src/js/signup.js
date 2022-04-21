/* URL - API */
const URL_API = "https://ctd-todo-api.herokuapp.com/v1";

/* elementos form cadastro */
const formulario = document.querySelector("form")
const firstName = document.getElementById("inputNomeCadastro");
const lastName = document.getElementById("inputSobrenomeCadastro");
const email = document.getElementById("inputEmailCadastro");
const senha = document.getElementById("inputSenhaCadastro");
const confirmSenha = document.getElementById("inputRepetirSenhaCadastro");
const botao = document.getElementById("botaoCriarContaCadastro")
const divAlertSucess = document.getElementById("divAlertSucess")
const botaoAlertSucess = document.getElementById("botaoAlertSucess")
const divAlertError = document.getElementById("divAlertError")
const botaoAlertError = document.getElementById("botaoAlertError")
const home = "index.html"




formulario.addEventListener("change" ,() => {

    let mailformat = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;

    if(email.value.match(mailformat) && senha.value.length >= 6 && senha.value == confirmSenha.value){
        botao.removeAttribute("disabled");
        botao.innerText = "Criar conta"
        console.log('Tudo valido!');
    }
})



formulario.addEventListener('submit', function(evento) {

    evento.preventDefault()

    const body =  {
        "firstName": `${firstName.value}`,
        "lastName": `${lastName.value}`,
        "email": `${email.value}`,
        "password": `${senha.value}`
    }


    const settings = {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    
    fetch(`${URL_API}/users`, settings)
    .then((result) =>{
        
        return result;

    }).then((info) => {
        console.log(info.status)
        if(info.status == 200 || info.status == 201){
            divAlertSucess.classList.remove("alertSucessoEscondido");
        }else{
            divAlertError.classList.remove("alertErroEscondido")
        }

    }).catch( (error) => {

        console.error("Criação de um novo usuário não concluida, segue o erro: " + error);

    })


}) 

/* Função que irá dar um feedback ao usuário sobre novo usuário criado com sucesso e redireciona-lo a rota (página) index.html */
botaoAlertSucess.addEventListener("click" , () => {
    
    setTimeout(() => {
        location.href = `${home}`;
    },1000)
    
    
})

botaoAlertError.addEventListener("click", () => {
    divAlertError.classList.add("alertErroEscondido")
})