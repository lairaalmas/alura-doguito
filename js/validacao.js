export const valida = (input) => {
  const tipoDeInput = input.dataset.tipo; // acessando data-* attribute do elemento, ex data-tipo="dataNascimento"

  if (validadores[tipoDeInput]) {
    validadores[tipoDeInput](input);
  }

  // Informa visualmente que o campo está com um valor inválido
  if (input.validity.valid) {
    input.parentElement.classList.remove('input-container--invalido');
    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''; // irmao do input
  } else {
    input.parentElement.classList.add('input-container--invalido');
    input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input);
  }
}

const tiposDeErro = [ // document.querySelector('input').validity retorna todos os tipos de erro e seus valores
  //'badInput',
  'customError',
  'patternMismatch',
  //'rangeOverflow',
  //'rangeUnderflow',
  //'stepMismatch',
  //'tooLong',
  //'tooShort',
  'typeMismatch',
  //'valid',
  'valueMissing',
]

const mensagensDeErro = {
  nome: {
    valueMissing: 'O campo nome não pode estar vazio.'
  },
  email: {
    valueMissing: 'O campo de email não pode estar vazio.',
    typeMismatch: 'O email digitado não é válido.'
  },
  senha: {
    valueMissing: 'O campo de senha não pode estar vazio.',
    patternMismatch: 'A senha deve conter:<br>- de 6 a 12 caracteres<br>- 1 letra maiúscula<br>- 1 letra minúscula<br>- 1 número<br>A senha NÃO deve conter:<br>- símbolos.'
  },
  dataNascimento: {
    customError: 'Você deve ter mais de 18 anos para se cadastrar.',
    valueMissing: 'O campo de data de nascimento não pode estar vazio.'
  },
  cpf: {
    valueMissing: 'O campo de CPF não deve estar vazio.',
    customError: 'O CPF digitado não é válido.'
  },
  cep: {
    valueMissing: 'O campo de CEP não pode estar vazio.',
    patternMismatch: 'O CEP digitado não é válido.',
    customError: 'Não foi possível buscar este CEP.'
  },
  logradouro: {
    valueMissing: 'O campo de logradouro não pode estar vazio.'
  },
  cidade: {
    valueMissing: 'O campo de cidade não pode estar vazio.'
  },
  estado: {
    valueMissing: 'O campo de estado não pode estar vazio.'
  }
}

const validadores = { // contem tipos de input
  dataNascimento: (input) => validaDataNascimento(input),
  cpf: (input) => validaCPF(input),
  cep: (input) => recuperarCEP(input)
}

const mostraMensagemDeErro = (tipoDeInput, input) => {
  let mensagem = '';
  tiposDeErro.forEach(erro => {
    if (input.validity[erro] != undefined && input.validity[erro] != null && input.validity[erro] == true) {
      mensagem = mensagensDeErro[tipoDeInput][erro];
    }
  });
  return mensagem;
}

// CAMPO: DATA DE NASCIMENTO
const validaDataNascimento = (input) => {

  const dataRecebida = new Date(input.value);
  let mensagem;

  if (!maiorQue18(dataRecebida)) {
    mensagem = 'Você deve ser maior que 18 anos para se cadastrar';
  } else {
    mensagem = ''; // se nao houve erro
  }

  input.setCustomValidity(mensagem); // define mensagem de erro personalizada
}

const maiorQue18 = (dataRecebida) => {

  const dataAtual = new Date(); // ja coloca automaticamente a data de hoje
  const dataRecebidaMais18 = new Date(dataRecebida.getUTCFullYear() + 18, dataRecebida.getUTCMonth(), dataRecebida.getUTCDate());

  return dataRecebidaMais18 <= dataAtual; // é maior de idade
}

// CAMPO: CPF 

// não garante que o cpf pertence a alguem, e sim se a estrutura dele é válida
const validaCPF = (input) => {
  const cpfFormatado = input.value.replace(/\D/g, ''); // regex para remover tudo que nao for numero
  let mensagem = '';

  if (!checaTamanhoCPF(cpfFormatado) || !checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
    mensagem = "O CPF digitado não é válido!!";
  }

  input.setCustomValidity(mensagem);
}

const checaTamanhoCPF = (cpf) => {
  return cpf.length == 11;
}

const checaCPFRepetido = (cpf) => {
  let cpfValido = true;
  const valoresRepetidos = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999'
  ];

  valoresRepetidos.forEach(valor => {
    if (cpf == valor) {
      cpfValido = false;
    }
  });

  return cpfValido;
}

const checaEstruturaCPF = (cpf) => {
  const multiplicador = 10;
  return checaDigitoVerificador(cpf, multiplicador);
}

const checaDigitoVerificador = (cpf, multiplicador) => {
  // usa recursao

  if (multiplicador >= 12) return true; // se já chamou recursivamente 2x

  let multiplicadorInicial = multiplicador;
  let soma = 0;

  const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
  const digitoVerificador = cpf.charAt(multiplicador - 1);

  for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--, contador++) {
    soma += cpfSemDigitos[contador] * multiplicadorInicial;
  }

  if (digitoVerificador == confirmaDigito(soma)) {
    return checaDigitoVerificador(cpf, multiplicador + 1);
  }

  return false;

  // soma1 = 10 * n1 + 9 * n2 + 8 * n3 + 7 * n4 + 6 * n5 + 5 * n6 + 4 * n7 + 3 * n8 + 2 * n9; 
  // if (11 - (soma1 % 11)) // valido 
  // soma2 = 11 * n1 + 10 * n2 + 9 * n3 + 8 * n4 + 7 * n5 + 6 * n6 + 5 * n7 + 4 * n8 + 3 * n9; 
  // if (11 - (soma2 % 11)) // valido

  /* solucao alternativa apresentada no forum sem usar recursao
     
    function cpfValido(cpf) {
    let soma1 = 0;
    for(let i = 0; i < cpf.length - 2; i++) {
        soma1 += (10 - i) * cpf[i]; 
    }

    let soma2 = 0;
    for(let i = 0; i < cpf.length - 1; i++) {
        soma2 += (11 - i) * cpf[i]; 
    }

    const digVerificadorCalculado1 = 11 - (soma1 % 11);
    const digVerificadorCalculado2 = 11 - (soma2 % 11);
    const digVerificadorCPF1 = cpf.slice(9,10);
    const digVerificadorCPF2 = cpf.slice(10,11);


    return digVerificadorCalculado1 == digVerificadorCPF1 && digVerificadorCalculado2 == digVerificadorCPF2;
  
    */
}

const confirmaDigito = (soma) => {
  return 11 - (soma % 11);
}

// CAMPO: CEP

const recuperarCEP = (input) => {
  
  const cep = input.value.replace('/\D/g', ''); // substitui tudo que não for numeros
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type':'application/json;charset=utf-8'
    }
  }

  if (!input.validity.patternMismatch && !input.validity.valueMissing) { // se não houver erro
    console.log("fui")
    fetch (url, options).then(response => response.json()).then(data => {
      if (data.erro) {
        input.setCustomValidity('Não foi possível buscar este CEP.'); // erro
        return // encerra fetch
      }
      input.setCustomValidity(''); // ok
      preencheCamposComCEP(data);
      return // encerra fetch
    })
  }

}

const preencheCamposComCEP = (data) => {
  const logradouro = document.querySelector('[data-tipo="logradouro"]');
  const cidade = document.querySelector('[data-tipo="cidade"]');
  const estado = document.querySelector('[data-tipo="estado"]');

  logradouro.value = data.logradouro;
  cidade.value = data.localidade;
  estado.value = data.uf;
}