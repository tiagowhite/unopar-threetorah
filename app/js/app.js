"use strict";

import baffle from 'baffle';
import * as data from '../data/estados';

Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

const textEffect = () => {
  baffle('.name h1', {
    speed: 55
  }).reveal(1000);
};

const buildData = (count) => {
  const estados = data;
  const ano = Array.range(2000, 2018);
  const estado = [];
  estados.UF.forEach(function (key) {
    estado.push(key.nome);
  });
  return {
    "count": count,
    "ano": ano[Math.floor(Math.random() * ano.length)],
    "estado": estado[Math.floor(Math.random() * estado.length)],
    "cortadas": Math.floor(Math.random() * (1000)),
    "volume": Math.floor(Math.random() * (100000)) + " m3",
    "repostas": Math.floor(Math.random() * (1000)),
    "valor": "R$ " + calcula(Math.floor(Math.random() * (100000)))
  };
};

const calcula = (mcubicos) => {
  const total = (mcubicos * 6);
  return total;
};

const buildTable = (id, loop) => {
  const table = document.getElementById(id).getElementsByTagName('tbody')[0];

  let newRow = undefined;
  for (let i = 0; i < loop; i++) {
    newRow = table.insertRow(table.rows.length);
    newRow.classList.add('data');
    for (let k = 0; k < 7; k++) {
      newRow.insertCell(k);
      document.getElementsByClassName('data')[i].children[k].appendChild(document.createTextNode(Object.values(buildData(i))[k]))
    }
  }
};

buildTable("modelo", 10);

textEffect();



