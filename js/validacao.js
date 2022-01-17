const dataNascimento = document.querySelector('#nascimento');
dataNascimento.addEventListener('blur', (evento) => { validaDataNascimento(evento.target) }); // quando perde o foco do campo

const validaDataNascimento = (input) => {
  const dataRecebida = new Date(input.value);
  let mensagem = ''; // vazio se nao houve erro

  if (!maiorQue18(dataRecebida)) {
    mensagem = 'Você deve ser maior que 18 anos para se cadastrar';
  }

  input.setCustomValidity(mensagem); // define mensagem de erro customizada
}

const maiorQue18 = (dataRecebida) => {
  
  const dataAtual = new Date(); // ja coloca automaticamente a data de hoje
  const dataRecebidaMais18 = new Date(dataRecebida.getUTCFullYear() + 18, dataRecebida.getUTCMonth(), dataRecebida.getUTCDate());
  
  return dataRecebidaMais18 <= dataAtual; // é maior de idade
}