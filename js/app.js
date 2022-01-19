import { valida } from "./validacao.js";

const inputs = document.querySelectorAll('input'); // recebe todos inputs

inputs.forEach(input => {
  input.addEventListener('blur', (evento) => { // evento é chamado quando sai da campo
    valida(evento.target); // event.target é o que elemento que ativou o evento
   });
})