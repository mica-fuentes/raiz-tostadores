import React from 'react';
import { createRoot } from 'react-dom/client';
import '../estilos/tienda.css';
import Tienda from '../paginas/Tienda.jsx';

createRoot(document.getElementById('app')).render(<Tienda />);
