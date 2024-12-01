class Carta {
  imagen;
  valorCarta;

  constructor(representacion) {
    representacion = representacion.toUpperCase();
    this.imagen = `${representacion}.png`;
  
    // Tomamos el número o letra de la carta
    const valor = representacion.slice(0, -1); 
  
    if (valor === "J" || valor === "Q" || valor === "K") {
      this.valorCarta = 10;
    } else if (valor === "A") { //en caso de que sea un as distinto puntaje
      this.valorCarta = 11; 
    } else {
      this.valorCarta = parseInt(valor, 10);
    }
  }
}
