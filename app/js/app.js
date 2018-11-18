"use strict";

import baffle from 'baffle';
import * as data from '../data/estados';

Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

const textEffect = () => {
  baffle('.name h1', {
    speed: 55
  }).reveal(1000);
};

const buildData = () => {
  const estados = data;
  const ano = Array.range(2000, 2018);
  const estado = [];
  estados.UF.forEach(function (key) {
    estado.push(key.nome);
  });
  return {
    "ano": ano[Math.floor(Math.random() * ano.length)],
    "estado": estado[Math.floor(Math.random() * estado.length)],
    "cortadas": Math.floor(Math.random() * (1000)),
    "volume": Math.floor(Math.random() * (100000)) + "m3",
    "repostas": Math.floor(Math.random() * (1000)),
    "valor": null
  };
};

const buildTable = (data) => {

  const table = document.querySelector("table#modelo tr#data");
  let ano = table.getElementsByClassName("ano")



};

buildTable(buildData());
textEffect();


const calcula = (mcubicos) => {
  const total = (mcubicos * 6);
  return "Total de Arvores para para plantio: " + total;
};
console.log(calcula(10));
