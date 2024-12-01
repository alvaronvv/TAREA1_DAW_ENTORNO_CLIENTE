class Jugador {
    nombre = "Invitado"
    cartasJugador = [];
  
    constructor(nombre) {
      if (nombre && nombre.trim() !== "") {
        this.nombre = nombre.trim();
      }
    }
  }