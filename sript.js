class Yhatzee {
    constructor() {
        this.dado1 = new Dado(1);
        this.dado2 = new Dado(2);
        this.dado3 = new Dado(3);
        this.dado4 = new Dado(4);
        this.dado5 = new Dado(5);
        this.controlador_dados = new ControladorDados([this.dado1, this.dado2, this.dado3, this.dado4, this.dado5]);
    }
}

class Dado {
    constructor(id) {
        this.valor = null;
        this.id = id;
    }

    tirar_dado() {
        this.valor = Math.ceil(Math.random() * 6);
    }
}



class ControladorDados {
    constructor(lista_dados) {
        this.lista = lista_dados;
        this.reservados = [];
    }

    tirar_dados() {
        this.lista.forEach(dado_actual => {
            if (!this.reservados.includes(dado_actual.id)) {
                dado_actual.tirar_dado();
                dado_actual.valor;

                DOM_cambiar_valor_dado(dado_actual.valor, dado_actual.id);
            }
        });
    }

    reservar_dados(lista) {
        lista.forEach(reservar => {
            if (!this.reservados.includes(reservar)) this.reservados.push(reservar);
        });
    }
}

class ControladorTiradas {

}

var yahtzee_game = new Yhatzee;

//Modifican/utilizan el DOM
function DOM_cambiar_valor_dado(valor, id){
    document.getElementById("check_dado" + id).style.cursor = "pointer";
    document.getElementById("check_dado" + id).disabled = false;
    document.getElementById("dado" + id).src = "Imagenes/dado_numero" + valor + ".svg";
}

function DOM_cambiar_opacidad_dado(numero_dado) {
    var dado = document.getElementById("dado" + numero_dado);
    if (dado.getAttribute("src") != "Imagenes/signo_interr.svg") {
        var elemento = document.getElementById("check_dado" + numero_dado);

        if (elemento.checked) dado.style.scale = 1.3;
        else dado.style.scale = 1;
    }
}

function DOM_reservar_dados() {
    let fuente = document.getElementById("dado1").getAttribute("src");
    if(fuente != "Imagenes/signo_interr.svg"){
        var lista = [];
        for (let i = 1; i <= 5; i++) {
            let dado = document.getElementById("check_dado" + i);
            if (dado.checked){
                document.getElementById("dado" + i).style.scale = 1;
                document.getElementById("dado" + i).style.opacity = 0.5;
                dado.style.cursor = "default";
                dado.disabled = true;
                lista.push(i)
            }
        }

        yahtzee_game.controlador_dados.reservar_dados(lista);
    }
}