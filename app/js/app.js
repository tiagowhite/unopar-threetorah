
"use strict";

import baffle from 'baffle';

const textEffect = () => {
  baffle('.name h1', {
    speed: 55
  }).reveal(1000);
};

textEffect();


