class Yhatzee {
    constructor() {
        this.dado1 = new Dado(1);
        this.dado2 = new Dado(2);
        this.dado3 = new Dado(3);
        this.dado4 = new Dado(4);
        this.dado5 = new Dado(5);
        this.controlador_dados = new ControladorDados([this.dado1, this.dado2, this.dado3, this.dado4, this.dado5]);
        this.controlador_tiradas = new ControladorTiradas;
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

    verificar_todos_reservados(){
        if(this.reservados.length == 5){
            DOM_desactivar_reserva_tirar();
            DOM_des_reservar_dados();
        }
    }
}

class ControladorTiradas {
    constructor(){
        this.num_tiradas = 0;
        this.jugador = 1;
    }

    contar_tirada(){
        this.num_tiradas++;
        
        if(this.num_tiradas<=3){
            DOM_aumentar_numero_tirada(this.jugador, this.num_tiradas);
        }
        if(this.num_tiradas>=3){
            DOM_desactivar_reserva_tirar();
            DOM_des_reservar_dados();
        }
        
    }
}

class ControladorTurno{
    constructor(){
        this.num_jugadores = 2;

    }
}

var yahtzee_game = new Yhatzee;

//Modifican/utilizan el DOM
function DOM_cambiar_valor_dado(valor, id){
    document.getElementById("check_dado" + id).style.cursor = "pointer";
    document.getElementById("check_dado" + id).disabled = false;
    document.getElementById("dado" + id).src = "Imagenes/dado_numero" + valor + ".svg";
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
        yahtzee_game.controlador_dados.verificar_todos_reservados();
    }
}

function DOM_aumentar_numero_tirada(jugador, tiro_num){
    document.getElementById("tirada_j"+jugador).style.display = "block";
    document.getElementById("tirada_j"+jugador).innerHTML = "Tirada número " + tiro_num;
}

function DOM_desactivar_reserva_tirar(){
    document.getElementById("boton_tirar").style.opacity = 0;
    document.getElementById("boton_tirar").disabled = true;
    document.getElementById("boton_tirar").style.cursor = "default";
    
    document.getElementById("boton_reservar").style.opacity = 0;
    document.getElementById("boton_reservar").disabled = true;
    document.getElementById("boton_reservar").style.cursor = "default";
}

function DOM_des_reservar_dados(){
    for (let i = 1; i <= 5; i++) {
        let dado = document.getElementById("check_dado" + i);
            document.getElementById("dado" + i).style.opacity = 1;
            dado.style.cursor = "default";
            dado.disabled = true;
    }
}

var score_ya_seleccionado = null;

function DOM_seleccionar_score(label_id){
    score_ya_seleccionado = document.getElementById(label_id);
}

// #15ff00 color para aniadidos