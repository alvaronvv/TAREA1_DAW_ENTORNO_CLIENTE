class Banca {
  constructor() {
    this.cartasBanca = [];
    this.cartasBarajadas = [];
  }
  //generamos la baraja con un bucle anidado
  generarBaraja() {
    const palos = ["C", "D", "P", "T"];

    for (let i = 0; i < palos.length; i++) {
      for (let j = 1; j <= 13; j++) {
        let cartaNueva;
        switch (j) {
          case 11:
            cartaNueva = new Carta(`J${palos[i]}`);
            break;

          case 12:
            cartaNueva = new Carta(`Q${palos[i]}`);
            break;

          case 13:
            cartaNueva = new Carta(`K${palos[i]}`);
            break;

          default:
            cartaNueva = new Carta(`${j}${palos[i]}`);
            break;
        }
        this.cartasBanca.push(cartaNueva);
      }
    }
    this.barajarCartas();
  }
  //barajamos cartas con la libreria underscore
  barajarCartas() {
    this.cartasBarajadas = _.shuffle(this.cartasBanca);
  }
}
