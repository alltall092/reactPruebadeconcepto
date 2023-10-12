import React, { useState } from 'react';
import axios from 'axios';
import {  composeAPI, generateAddress, prepareTransfers, sendTrytes, getBalances } from '@iota/core';
//import generateSeed from 'iota-generate-seed';
import './TangleRed.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from 'crypto-js';




function TangleRed() {
    const [seed, setSeed] = useState('');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [file, setFile] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  
  const notifySuccess = (trytes) => {
    toast.success('Mensaje de éxito', {
      style: { background: 'green', color: 'white' },
    },trytes);
  };
  const Redireccion = () => {
     window.location.href = 'https://armidale-taipan-sskg.1.ie-1.fl0.io/api/v1/docs';
    
  };
  const notifyError = (error) => {
    toast.error('Mensaje de error', {
      style: { background: 'red', color: 'white' },
    },error);
  };
  const handleChange = (event) => {
    setSeed(event.target.value);
  };

  const generateAddres = () => {
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
          notifyError(error);
          console.error('Error al generar la dirección:', error);
        });
    } else {
      alert('Ingresa un seed válido');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const encryptFile = () => {
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileContent = event.target.result;

          // Encripta el archivo con una clave secreta (debes gestionar esta clave de forma segura)
          const encryptionKey = 'ClaveDeEncriptacion';
          const encrypted = CryptoJS.AES.encrypt(fileContent, encryptionKey).toString();
          setEncryptedFile(encrypted);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error al encriptar el archivo:', error);
    }
  };

  const sendEncryptedFile = async () => {
    if (!address || !encryptedFile) {
      console.error('Debes generar una dirección y encriptar un archivo primero.');
      return;
    }

    try {
      const iota = composeAPI({
        provider: 'https://nodes.devnet.iota.org' // Cambia a la red principal cuando sea necesario
      });

      // Prepara la transacción con el archivo encriptado
      const transfers = prepareTransfers([encryptedFile], [{ address, value: 0 }]);

      // Envia la transacción a la red Tangle
      const trytes = await sendTrytes(iota, transfers, 3, 9);

      console.log('Transacción enviada con éxito:', trytes);
      notifySuccess(trytes);
    } catch (error) {
      console.error('Error al enviar el archivo encriptado:', error);
    }
  };

  const checkBalance = async () => {
    if (address) {
      try {
        const iota = composeAPI({
          provider: 'https://nodes.devnet.iota.org' // Cambia a la red principal cuando sea necesario
        });

        // Verifica el saldo de la dirección
        const { balances } = await getBalances(iota, [address]);
        setBalance(balances[0]);
      } catch (error) {
        console.error('Error al verificar el saldo:', error);
      }
    } else {
      console.error('Debes generar una dirección primero.');
    }
  };
  const decencritarArchivo=()=>{
    axios.post('https://armidale-taipan-sskg.1.ie-1.fl0.io/decryptFile',JSON.stringify({encryptFile:encryptFile,encryptionKey: 'ClaveDeEncriptacion'}), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(() => {
      console.log('File uploaded successfully');
      // You can handle the response here
    })
    .catch(error => {
      console.error('Error uploading file', error);
      // Handle the error
    });



  }

  return (
    <div className="container">
      <div className="item">
      <h2>Red Tangle Básica para Enviar Archivo Encriptado</h2>
      <button onClick={generateAddres}>Generar Dirección</button>
  <button onClick={checkBalance}>Verificar Saldo</button>
      <button onClick={encryptFile}>Encriptar Archivo</button>
      <button onClick={sendEncryptedFile}>Enviar Archivo Encriptado</button>
      <button onClick={decencritarArchivo}>decencriptar Archivo </button>
      <button onClick={Redireccion}>Documentacion</button>

      <div className="row">
      <div className="col-md-4">
      <ToastContainer />
        <label>Ingresar Seed</label>
        <input
        type="text" className="form-control"
        placeholder="Ingresa tu seed"
        onChange={handleChange}
      />
    
      <p>Dirección Generada: {address}</p>
      <input type="file" className="form-control" onChange={handleFileChange} />
        <p>Saldo: {balance} IOTA</p>
      </div>
      </div>
    </div>
    </div>
  );
}

export default TangleRed;
