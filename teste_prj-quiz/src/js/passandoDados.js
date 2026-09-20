import { estado } from "./estado.js";

export async function enviarDadosBackend(){
    const pessoa = JSON.parse(sessionStorage.pessoa);

    const dados = {
        nome: pessoa.nome,
        email: pessoa.email,
        estado: pessoa.estado,
        sexo: pessoa.sexo,
        acertos: estado.acertos,
        respostas: estado.respostas.map(r => ({
            questao: r.pergunta,
            alternativaMarcada: r.opcoes[r.respostaDada]
        })),
    };

    console.log("Dados a serem enviados:", dados)
    
    const url = "http://localhost:3000/api/resultado";
    
    const options ={
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados),
    };

    try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
            throw new Error(`Erro ao enviar dados: ${resp.status}`);
        }

        const dados = await resp.json();
        console.log("Resposta do backend:", dados);
    }catch( error) {
        console.error("Erro ao enviar dados:", error);
    }
}