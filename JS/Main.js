//Como anotacion, la logica desarollada en este programa es la seguida en el juego BlackJack 21, que difiere de las instrucciones de la tarea.

//Inicializamos variables.
let cuentaJugador = 0;
let cuentaBanca = 0;
let cartasOcultas = true;
let banca;

// Preguntamos mediante prompt al jugador su nombre. En caso de que no ponga nada, se jugara como invitado.
let nombre = prompt("Introduce tu nombre:").trim() || "Invitado";
const jugador = new Jugador(nombre);

// Llamamos a los estiloss css y creamos el div donde almacenamos el mensaje de bienvenida del jugador al juego.
const mensajeWrapper = document.querySelector("#mensajeWrapper");
mensajeWrapper.innerHTML = `
  <div class="mensajeInicial">
    <h1>¡Bienvenido al Blackjack, ${jugador.nombre}!</h1>
    <button id="btn-iniciar" class="btn btn-success mt-3">Iniciar juego</button>
  </div>
`;

// Función donde sacamos las cartas
function sacarCarta(banca, oculta = false) {
  const carta = banca.cartasBarajadas.pop();
  carta.oculta = oculta;
  return carta;
}

// Comenzamos el juego. Llamamos a la funcion iniciar juego.
document.querySelector("#btn-iniciar").addEventListener("click", iniciarJuego);

function iniciarJuego() {
  //  Quitamos el mensaje del comienzo y inicializamos los dos containers donde estarán las cartas de la banca y del jugador
  mensajeWrapper.remove();
  const bancaContainer = document.querySelector("#banca-container");
  const jugadorContainer = document.querySelector("#jugador-container");

  bancaContainer.hidden = false;
  jugadorContainer.hidden = false;

  // Asignarmos a la variable global
  banca = new Banca(); 
  banca.generarBaraja();

  const botones = crearBotones(banca);
  document.body.appendChild(botones);

  // Creamos y mostramos las puntuaciones
  mostrarPuntajes();

  jugador.cartasJugador = [sacarCarta(banca), sacarCarta(banca)];
  cuentaJugador = calcularPuntaje(jugador.cartasJugador);

  banca.cartasBanca = [sacarCarta(banca), sacarCarta(banca, true)];
  // Solo mostramos la primera carta de la banca
  cuentaBanca = calcularPuntaje([banca.cartasBanca[0]]); 

  mostrarCartas(jugador.cartasJugador, jugadorContainer);
  mostrarCartas([banca.cartasBanca[0]], bancaContainer);

  //Actualizamos puntuaciones
  actualizarPuntajes();
}

//Funcion que crea los containers de los botones de pedir carta y retirarse

function crearBotones(banca) {

  const botonesContainer = document.createElement("div");
  botonesContainer.id = "botones-container";
//Creamos el boton de pedir
  const btnSacarCarta = document.createElement("button");
  btnSacarCarta.textContent = "Pedir";
  //Asignamos css
  btnSacarCarta.className = "btn btn-success"; 
  //Le damos funcionalidad al boton
  btnSacarCarta.addEventListener("click", () => {
    jugador.cartasJugador.push(sacarCarta(banca));
    cuentaJugador = calcularPuntaje(jugador.cartasJugador);
    //mostramos las cartas actuales en el contenedor correspondiente
    mostrarCartas(jugador.cartasJugador, document.querySelector("#jugador-container"));
    actualizarPuntajes();

    //si la puntuacion del jugador es mayor a 21 damos a la banca como ganadora
    if (cuentaJugador > 21) {
      finalizarJuego("La banca gana");
    }
  });

  //lo mismo para el boton de retirarse
  const btnRetirarse = document.createElement("button");
  btnRetirarse.textContent = "Plantarse";
  btnRetirarse.className = "btn btn-danger";
  btnRetirarse.addEventListener("click", () => turnoBanca());

  botonesContainer.appendChild(btnSacarCarta);
  botonesContainer.appendChild(btnRetirarse);
  return botonesContainer;
}

//funcion para crear los divs de las puntuaciones y mostrarlas
function mostrarPuntajes() {
  const bancaPuntaje = document.createElement("div");
  bancaPuntaje.id = "banca-puntaje";
  bancaPuntaje.textContent = "Puntos banca: 0";
  document.body.appendChild(bancaPuntaje);

  const jugadorPuntaje = document.createElement("div");
  jugadorPuntaje.id = "jugador-puntaje";
  jugadorPuntaje.textContent = "Puntos jugador: 0";
  document.body.appendChild(jugadorPuntaje);
}

//funcion para mostrar las cartas en el container correspondiente o bien a la banca o bien al jugador
function mostrarCartas(cartas, contenedor) {
  contenedor.innerHTML = "";

  cartas.forEach((carta) => {
    const cartaElement = document.createElement("img");

    cartaElement.src = carta.oculta
      ? "images/blue.png"
      : `images/${carta.imagen}`;

    contenedor.appendChild(cartaElement);
  });
}

//funcion donde tenemos toda la logica del sistema de puntuaciones
function calcularPuntaje(cartas) {
  let total = 0;
  let ases = 0;

  cartas.forEach((carta) => {
    total += carta.valorCarta;
    if (carta.valorCarta === 11) ases++;
  });

  while (total > 21 && ases > 0) {
    total -= 10;
    ases--;
  }

  return total;
}

//funcion donde actualizamos las puntuaciones
function actualizarPuntajes() {
  const bancaPuntajeElement = document.querySelector("#banca-puntaje");
  const jugadorPuntajeElement = document.querySelector("#jugador-puntaje");

  if (bancaPuntajeElement && jugadorPuntajeElement) {
    bancaPuntajeElement.textContent = `Puntos banca: ${cuentaBanca}`;
    jugadorPuntajeElement.textContent = `Puntos jugador: ${cuentaJugador}`;
  } else {
    console.error("No se encontraron los elementos de puntajes.");
  }
}

function turnoBanca() {
  cartasOcultas = false;

  // Destapar todas las cartas ocultas de la banca
  banca.cartasBanca.forEach((carta) => {
    carta.oculta = false;
  });

  // Mostrar todas las cartas de la banca
  mostrarCartas(banca.cartasBanca, document.querySelector("#banca-container"));

  // Calcular el puntaje de la banca con todas las cartas visibles
  cuentaBanca = calcularPuntaje(banca.cartasBanca);
  actualizarPuntajes();

  // Logica del turno de la banca
  while (cuentaBanca < 17) {
    const carta = sacarCarta(banca);
    banca.cartasBanca.push(carta);
    cuentaBanca = calcularPuntaje(banca.cartasBanca);
    // Mostramos la nueva carta
    mostrarCartas(banca.cartasBanca, document.querySelector("#banca-container")); 
    actualizarPuntajes();
  }

  //logica para saber cuando gana la banca y el jugador
  if (cuentaBanca > 21) {
    finalizarJuego("El jugador gana");
  } else if (cuentaJugador > cuentaBanca) {
    finalizarJuego("El jugador gana");
  } else if (cuentaJugador < cuentaBanca) {
    finalizarJuego("La banca gana");
  } else {
    finalizarJuego("Empate");
  }
}

//función final para mostrar el resultado
function finalizarJuego(resultado) {
  const mensaje = document.createElement("div");
  mensaje.innerHTML = `<h2>${resultado}</h2>`;
  document.body.appendChild(mensaje);
}
