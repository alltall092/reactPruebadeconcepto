import React, { useState } from 'react';
import { composeAPI, generateAddress } from '@iota/core';

function IotaAddressGenerator() {
  const [seed, setSeed] = useState('');
  const [address, setAddress] = useState('');

  const handleChange = (event) => {
    setSeed(event.target.value);
  };

  const generateAddress = () => {
    if (seed) {
      const iota = composeAPI({
        provider: 'https://nodes.iota.org:443', // Cambia a tu proveedor de nodos IOTA preferido
      });

      const options = {
        index: 0, // El índice de la dirección que deseas generar
        security: 2, // Nivel de seguridad (1, 2, o 3)
      };

      generateAddress(iota, seed, options)
        .then((address) => {
          setAddress(address);
        })
        .catch((error) => {
          console.error('Error al generar la dirección:', error);
        });
    } else {
      alert('Ingresa un seed válido');
    }
  };

  return (
    <div>
      <h1>Generador de Dirección IOTA</h1>
      <input
        type="text"
        placeholder="Ingresa tu seed"
        onChange={handleChange}
      />
      <button onClick={generateAddress}>Generar Dirección</button>
      <p>Dirección Generada: {address}</p>
    </div>
  );
}

export default IotaAddressGenerator;
