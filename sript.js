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

    verificar_todos_reservados() {
        if (this.reservados.length == 5) {
            alert("Ha reservado todos los dados, no puede hacer más tiradas.");
            DOM_desactivar_reserva();
            DOM_desactivar_tirar();
            DOM_des_reservar_dados();
        }
    }
}

class ControladorTiradas {
    constructor() {
        this.num_tiradas = 0;
        this.jugador = 1;
    }

    contar_tirada() {
        this.num_tiradas++;

        if (this.num_tiradas <= 3) {
            DOM_aumentar_numero_tirada(this.jugador, this.num_tiradas);
        }
        if (this.num_tiradas >= 3) {
            DOM_desactivar_reserva();
            DOM_desactivar_tirar();
            DOM_des_reservar_dados();
        }

    }
}

class ControladorScoreJugador {
    constructor(jugador) {
        this.jugador = jugador;
        this.cubeta = [];
        this.unos = this.doses = this.treses = this.cuatros = this.cincos = this.seises = -1;
        this.bonus = this.tres_tipo = this.cuatro_tipo = this.full_house = -1;
        this.esc_corta = this.esc_larga = this.yhatzee = this.chance = -1;
        this.mit_superior = this.mit_inferior = this.tot_final = -1;
    }

    calc_cubeta(lista_valores) {
        this.cubeta = [null, 0, 0, 0, 0, 0, 0];
        lista_valores.forEach(valor => {
            this.cubeta[valor]++;
        });
    }
    
    calcular_score_mostrar() {
        if (this.unos == -1) DOM_mostrar_dato_score(this.jugador, "unos", this.cubeta[1]);
        if (this.doses == -1) DOM_mostrar_dato_score(this.jugador, "doses", this.cubeta[2] * 2);
        if (this.treses == -1) DOM_mostrar_dato_score(this.jugador, "treses", this.cubeta[3] * 3);
        if (this.cuatros == -1) DOM_mostrar_dato_score(this.jugador, "cuatros", this.cubeta[4] * 4);
        if (this.cincos == -1) DOM_mostrar_dato_score(this.jugador, "cincos", this.cubeta[5] * 5);
        if (this.seises == -1) DOM_mostrar_dato_score(this.jugador, "seises", this.cubeta[6] * 6);

        if (this.tres_tipo == -1) {
            let cumple = false, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 3) {
                    cumple = true;
                }

                acum += this.cubeta[i];
            }

            if (cumple) DOM_mostrar_dato_score(this.jugador, "trestipo", acum);
            else DOM_mostrar_dato_score(this.jugador, "trestipo", 0);
        }

        if (this.cuatro_tipo == -1) {
            let cumple = false, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 4) {
                    cumple = true;
                }

                acum += this.cubeta[i];
            }

            if (cumple) DOM_mostrar_dato_score(this.jugador, "cuatrotipo", acum);
            else DOM_mostrar_dato_score(this.jugador, "cuatrotipo", 0);
        }

        if (this.full_house == -1) {
            let cumple_triada = false, cumple_par = false, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 3) {
                    cumple_triada = true;
                }
                if (this.cubeta[i] == 2) {
                    cumple_par = true;
                }

                acum += this.cubeta[i];
            }

            if (cumple_triada && cumple_par) DOM_mostrar_dato_score(this.jugador, "fullhouse", acum);
            else DOM_mostrar_dato_score(this.jugador, "fullhouse", 0);
        }

        if (this.esc_corta == -1) {
            let esc_index1 = true, esc_index2 = true, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (i >= 1 && i <= 5) {
                    esc_index1 = esc_index1 & this.cubeta[i];
                }
                if (i >= 2 && i <= 6) {
                    esc_index2 = esc_index2 & this.cubeta[i];
                }

                acum += this.cubeta[i]
            }

            if (esc_index1 || esc_index2) DOM_mostrar_dato_score(this.jugador, "esccorta", acum);
            else DOM_mostrar_dato_score(this.jugador, "esccorta", 0);
        }

        if (this.esc_larga == -1) {
            let cumple = true, acum = 0;

            for (let i = 1; i <= 6; i++) {
                cumple = cumple & this.cubeta[i];
                acum += this.cubeta[i]
            }

            if (cumple) DOM_mostrar_dato_score(this.jugador, "esclarga", acum);
            else DOM_mostrar_dato_score(this.jugador, "esclarga", 0);
        }

        if (this.yhatzee == -1) {
            let cumple = false, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 5) {
                    cumple = true;
                    acum = i * 5;
                    break;
                }
            }

            if (cumple) DOM_mostrar_dato_score(this.jugador, "yahtzee", acum);
            else DOM_mostrar_dato_score(this.jugador, "yahtzee", 0);
        }

        if (this.chance == -1) {
            let acum = 0;

            for (let i = 1; i <= 6; i++) {
                acum += this.cubeta[i];
            }

            DOM_mostrar_dato_score(this.jugador, "chance", acum);
        }
    }

    calc_bonus_mitsuperior() {
        if (this.unos >= 0 && this.doses >= 0 && this.treses >= 0 && this.cuatros >= 0 && this.cincos >= 0 && this.seises >= 0 && this.bonus == -1) {
            let acum = this.unos + this.doses + this.treses + this.cuatros + this.cincos + this.seises;
            if (acum >= 63) this.bonus = 35;
            else this.bonus = 0;

            this.mit_superior = acum + this.bonus;

            DOM_mostrar_dato_score(this.jugador, "total_uno_seis", acum);
            DOM_mostrar_dato_score(this.jugador, "bonus", this.bonus);
            DOM_mostrar_dato_score(this.jugador, "total_mit_superior", this.mit_superior);
        }
    }

    calc_mitinferior() {
        if (this.tres_tipo >= 0 && this.cuatro_tipo >= 0 && this.full_house >= 0 && this.esc_corta >= 0 && this.esc_larga >= 0 && this.yhatzee >= 0 && this.chance) {
            this.mit_inferior = this.tres_tipo + this.cuatro_tipo + this.full_house + this.esc_corta + this.esc_larga + this.yhatzee + this.chance;

            DOM_mostrar_dato_score(this.jugador, "total_mit_inferior", this.mit_inferior);
        }
    }

    calc_total() {
        if (this.mit_superior >= 0 && this.mit_inferior >= 0) {
            this.tot_final = this.mit_superior + this.mit_inferior;

            DOM_mostrar_dato_score(this.jugador, "total_final", this.tot_final);
        }
    }

    asignar_valor(elemento, valor) {
        switch (elemento) {
            case "unos":
                this.unos = valor;
                break;

            case "doses":
                this.doses = valor;
                break;

            case "treses":
                this.treses = valor;
                break;

            case "cuatros":
                this.cuatros = valor;
                break;

            case "cincos":
                this.cincos = valor;
                break;

            case "seises":
                this.seises = valor;
                break;

            case "trestipo":
                this.tres_tipo = valor;
                break;

            case "cuatrotipo":
                this.cuatro_tipo = valor;
                break;

            case "fullhouse":
                this.full_house = valor;
                break;

            case "esccorta":
                this.esc_corta = valor;
                break;

            case "esclarga":
                this.esc_larga = valor;
                break;

            case "yahtzee":
                this.yhatzee = valor;
                break;

            case "chance":
                this.chance = valor;
                break;
        }
    }
}

class ControladorTurno {
    constructor() {
        this.num_jugadores = 2;

    }
}

var yahtzee_game = new Yhatzee;

//Modifican/utilizan el DOM
function DOM_cambiar_valor_dado(valor, id) {
    document.getElementById("check_dado" + id).style.cursor = "pointer";
    document.getElementById("check_dado" + id).disabled = false;
    document.getElementById("dado" + id).src = "Imagenes/dado_numero" + valor + ".svg";
}

function DOM_reservar_dados() {
    let fuente = document.getElementById("dado1").getAttribute("src");
    if (fuente != "Imagenes/signo_interr.svg") {
        var lista = [];
        for (let i = 1; i <= 5; i++) {
            let dado = document.getElementById("check_dado" + i);
            if (dado.checked) {
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

function DOM_aumentar_numero_tirada(jugador, tiro_num) {
    document.getElementById("tirada_j" + jugador).style.display = "block";
    document.getElementById("tirada_j" + jugador).innerHTML = "Tirada número " + tiro_num;
}

function DOM_desactivar_reserva() {
    document.getElementById("boton_reservar").style.opacity = 0;
    document.getElementById("boton_reservar").disabled = true;
    document.getElementById("boton_reservar").style.cursor = "default";
}

function DOM_desactivar_tirar() {
    document.getElementById("boton_tirar").style.opacity = 0;
    document.getElementById("boton_tirar").disabled = true;
    document.getElementById("boton_tirar").style.cursor = "default";
}

function DOM_des_reservar_dados() {
    for (let i = 1; i <= 5; i++) {
        let dado = document.getElementById("check_dado" + i);
        document.getElementById("dado" + i).style.opacity = 1;
        dado.style.cursor = "default";
        dado.disabled = true;
    }
}

var score_ya_seleccionado = null;

function DOM_seleccionar_score(label_id) {
    score_ya_seleccionado = document.getElementById(label_id);
}

function DOM_mostrar_dato_score(jugador, elemento, valor) {
    let input_id = "check_score_" + elemento + "_j" + jugador;
    let label_id = "score_" + elemento + "_j" + jugador;

    if(elemento == "total_uno_seis" || elemento == "bonus" || elemento == "total_mit_inferior" || elemento == "total_final"){
        document.getElementById(label_id).innerHTML = valor;
    }
    else{
        if(elemento == "total_mit_superior"){
        document.getElementsByClassName(label_id).innerHTML = valor;
        }
        else{
            document.getElementById(input_id).disabled = false;
            document.getElementById(label_id).innerHTML = valor;
            document.getElementById(label_id).style.color = "#15ff00";
        }
    }
}