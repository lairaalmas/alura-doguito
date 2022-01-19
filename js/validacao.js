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

// document.querySelector('input').validity retorna todos os tipos de erro e seus valores

const tiposDeErro = [
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
    typeMismatch: 'O email digitado não é válido'
  },
  senha: {
    valueMissing: 'O campo de senha não pode estar vazio.',
    patternMismatch: 'A senha deve conter:<br>- de 6 a 12 caracteres<br>- 1 letra maiúscula<br>- 1 letra minúscula<br>- 1 número<br>A senha NÃO deve conter:<br>- símbolos.'
  },
  dataNascimento: {
    customError: 'Você deve ter mais de 18 anos para se cadastrar.',
    valueMissing: 'O campo de data de nascimento não pode estar vazio.'
  }
}

// contem tipos de input
const validadores = {
  dataNascimento: (input) => validaDataNascimento(input)
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