import { valida } from "./validacao.js";

const inputs = document.querySelectorAll('input'); // recebe todos inputs

inputs.forEach(input => {

  if (input.dataset.tipo === 'preco') {
    SimpleMaskMoney.setMask(input, {
      allowNegative: false,
      prefix: 'R$',
      suffix: '',
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ',',
      thousandsSeparator: '.',
      cursor: 'move'
    });
  }

  input.addEventListener('blur', (evento) => { // evento é chamado quando sai da campo
    valida(evento.target); // event.target é o que elemento que ativou o evento
  });
})