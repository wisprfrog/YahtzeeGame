class Yahtzee {
    constructor(num_jugadores) {
        this.controlador_dados = new ControladorDados([new Dado(1), new Dado(2), new Dado(3), new Dado(4), new Dado(5)]);
        this.controlador_tiradas = new ControladorTiradas(num_jugadores);
        this.controlador_turnos = new ControladorTurno(num_jugadores);

        this.lista_jugadores = [null];
        for (let i = 1; i <= num_jugadores; i++) {
            this.lista_jugadores.push(new ControladorScoreJugador(i));
        }

        this.controlador_ganador = new ControladorGanador;
    }

    rellenar_score_jugadores(){
        for (let i = 1; i < this.lista_jugadores.length; i++) {
            this.lista_jugadores[i].llenar_ceros_score();
        }
    }

    ultimo_calculo_score_jugadores(){
        for (let i = 1; i < this.lista_jugadores.length; i++) {
            this.lista_jugadores[i].calc_bonus_mitsuperior();
            this.lista_jugadores[i].calc_mitinferior();
        }
    }

    retornar_lista_jugadores() {
        let lista_aux = [];

        for (let i = 1; i < this.lista_jugadores.length; i++) {
            lista_aux.push(this.lista_jugadores[i]);
        }

        return lista_aux;
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

    resetear_lista_reservados() {
        this.reservados = [];
    }

    verificar_todos_reservados() {
        if (this.reservados.length == 5) {
            alert("Ha reservado todos los dados, no puede hacer más tiradas.");
            DOM_desactivar_reserva();
            DOM_desactivar_tirar();
            DOM_des_reservar_dados();
        }
    }

    retornar_valores_actuales() {
        let enviar = [];

        this.lista.forEach(dado => {
            enviar.push(dado.valor);
        });

        return enviar;
    }
}

class ControladorTiradas {
    constructor() {
        this.num_tiradas = 0;
        this.turno_jugador = 1;
    }

    contar_tirada() {
        this.num_tiradas++;

        if (this.num_tiradas <= 3) {
            DOM_aumentar_numero_tirada(this.turno_jugador, this.num_tiradas);
        }
        if (this.num_tiradas >= 3) {
            DOM_desactivar_reserva();
            DOM_desactivar_tirar();
            DOM_des_reservar_dados();
        }

    }

    resetear_tiradas_turno_jug(jugador) {
        this.num_tiradas = 0;
        this.turno_jugador = jugador;
    }
}

class ControladorScoreJugador {
    constructor(jugador) {
        this.jugador = jugador;
        this.cubeta = [];
        this.unos = this.doses = this.treses = this.cuatros = this.cincos = this.seises = -1;
        this.bonus = this.tres_tipo = this.cuatro_tipo = this.full_house = -1;
        this.esc_corta = this.esc_larga = this.yahtzee = this.chance = -1;
        this.mit_superior = this.mit_inferior = this.tot_final = -1;
    }

    calc_cubeta(lista_valores) {
        this.cubeta = [null, 0, 0, 0, 0, 0, 0];
        lista_valores.forEach(valor => {
            this.cubeta[valor]++;
        });
    }

    calcular_score_mostrar() {
        let minimo_uno = false;

        if (this.unos == -1 && this.cubeta[1] > 0) {
            DOM_mostrar_dato_score(this.jugador, "unos", this.cubeta[1]);
            minimo_uno = true;
        }
        if (this.doses == -1 && this.cubeta[2] > 0) {
            DOM_mostrar_dato_score(this.jugador, "doses", this.cubeta[2] * 2);
            minimo_uno = true;
        }
        if (this.treses == -1 && this.cubeta[3] > 0) {
            DOM_mostrar_dato_score(this.jugador, "treses", this.cubeta[3] * 3);
            minimo_uno = true;
        }
        if (this.cuatros == -1 && this.cubeta[4] > 0) {
            DOM_mostrar_dato_score(this.jugador, "cuatros", this.cubeta[4] * 4);
            minimo_uno = true;
        }
        if (this.cincos == -1 && this.cubeta[5] > 0) {
            DOM_mostrar_dato_score(this.jugador, "cincos", this.cubeta[5] * 5);
            minimo_uno = true;
        }
        if (this.seises == -1 && this.cubeta[6] > 0) {
            DOM_mostrar_dato_score(this.jugador, "seises", this.cubeta[6] * 6);
            minimo_uno = true;
        }

        if (this.tres_tipo == -1) {
            let cumple = false, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 3) {
                    cumple = true;
                }

                acum += this.cubeta[i] * i;
            }

            if (cumple) {
                DOM_mostrar_dato_score(this.jugador, "trestipo", acum);
                minimo_uno = true;
            }
        }

        if (this.cuatro_tipo == -1) {
            let cumple = false, acum = 0;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 4) {
                    cumple = true;
                }

                acum += this.cubeta[i] * i;
            }

            if (cumple) {
                DOM_mostrar_dato_score(this.jugador, "cuatrotipo", acum);
                minimo_uno = true;
            }
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
            }

            if (cumple_triada && cumple_par) {
                DOM_mostrar_dato_score(this.jugador, "fullhouse", 25);
                minimo_uno = true;
            }
        }

        if (this.esc_corta == -1) {
            let esc_index1 = true, esc_index2 = true, esc_index3 = true;

            for (let i = 1; i <= 6; i++) {
                if (i >= 1 && i <= 4) {
                    if (i == 1 && this.cubeta[i] == 0) esc_index1 = false;
                    if (i == 2 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                    if (i == 3 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                    if (i == 4 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                }
                if (i >= 2 && i <= 5) {
                    if (i == 2 && this.cubeta[i] == 0) esc_index2 = false;
                    if (i == 3 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                    if (i == 4 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                    if (i == 5 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                }

                if (i >= 3 && i <= 6) {
                    if (i == 3 && this.cubeta[i] == 0) esc_index3 = false;
                    if (i == 4 && this.cubeta[i] == 0 && esc_index3) esc_index3 = false;
                    if (i == 5 && this.cubeta[i] == 0 && esc_index3) esc_index3 = false;
                    if (i == 6 && this.cubeta[i] == 0 && esc_index3) esc_index3 = false;
                }
            }

            if (esc_index1 || esc_index2 || esc_index3) {
                DOM_mostrar_dato_score(this.jugador, "esccorta", 30);
                minimo_uno = true;
            }
        }

        if (this.esc_larga == -1) {
            let esc_index1 = true, esc_index2 = true;

            for (let i = 1; i <= 6; i++) {
                if (i >= 1 && i <= 5) {
                    if (i == 1 && this.cubeta[i] == 0) esc_index1 = false;
                    if (i == 2 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                    if (i == 3 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                    if (i == 4 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                    if (i == 5 && this.cubeta[i] == 0 && esc_index1) esc_index1 = false;
                }
                if (i >= 2 && i <= 6) {
                    if (i == 2 && this.cubeta[i] == 0) esc_index2 = false;
                    if (i == 3 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                    if (i == 4 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                    if (i == 5 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                    if (i == 6 && this.cubeta[i] == 0 && esc_index2) esc_index2 = false;
                }
            }

            if (esc_index1 || esc_index2) {
                DOM_mostrar_dato_score(this.jugador, "esclarga", 40);
                minimo_uno = true;
            }
        }

        let cumple = false, acum = 0;

        for (let i = 1; i <= 6; i++) {
            if (this.cubeta[i] == 5) {
                cumple = true;
                break;
            }
        }
            
        if (cumple && this.yahtzee == -1) {
            DOM_mostrar_dato_score(this.jugador, "yahtzee", 50);
            minimo_uno = true;
        }
        if(cumple && this.yahtzee > 0){
            DOM_mostrar_dato_score(this.jugador, "yahtzee", this.yahtzee + 50);
            minimo_uno = true;
        }

        if (this.chance == -1) {
            let acum = 0;

            for (let i = 1; i <= 6; i++) {
                acum += this.cubeta[i] * i;
            }

            DOM_mostrar_dato_score(this.jugador, "chance", acum);
        }

        if (!minimo_uno) {
            this.calcular_score_mostrar_no_cumplen();
        }
    }

    calcular_score_mostrar_no_cumplen() {
        if (this.unos == -1 && this.cubeta[1] == 0) DOM_mostrar_dato_score(this.jugador, "unos", 0);
        if (this.doses == -1 && this.cubeta[2] == 0) DOM_mostrar_dato_score(this.jugador, "doses", 0);
        if (this.treses == -1 && this.cubeta[3] == 0) DOM_mostrar_dato_score(this.jugador, "treses", 0);
        if (this.cuatros == -1 && this.cubeta[4] == 0) DOM_mostrar_dato_score(this.jugador, "cuatros", 0);
        if (this.cincos == -1 && this.cubeta[5] == 0) DOM_mostrar_dato_score(this.jugador, "cincos", 0);
        if (this.seises == -1 && this.cubeta[6] == 0) DOM_mostrar_dato_score(this.jugador, "seises", 0);

        if (this.tres_tipo == -1) {
            let cumple = false;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 3) {
                    cumple = true;
                    break;
                }
            }

            if (!cumple) DOM_mostrar_dato_score(this.jugador, "trestipo", 0);
        }

        if (this.cuatro_tipo == -1) {
            let cumple = false;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 4) {
                    cumple = true;
                    break;
                }
            }

            if (!cumple) DOM_mostrar_dato_score(this.jugador, "cuatrotipo", 0);
        }

        if (this.full_house == -1) {
            let cumple_triada = false, cumple_par = false;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 3) {
                    cumple_triada = true;
                    break;
                }
                if (this.cubeta[i] == 2) {
                    cumple_par = true;
                    break;
                }
            }

            if (cumple_triada == false || cumple_par == false) DOM_mostrar_dato_score(this.jugador, "fullhouse", 0);
        }

        if (this.esc_corta == -1) {
            let esc_index1 = true, esc_index2 = true;

            for (let i = 1; i <= 6; i++) {
                if (i >= 1 && i <= 5) {
                    esc_index1 = esc_index1 & this.cubeta[i];
                }
                if (i >= 2 && i <= 6) {
                    esc_index2 = esc_index2 & this.cubeta[i];
                }
            }

            if (!esc_index1 && !esc_index2) DOM_mostrar_dato_score(this.jugador, "esccorta", 0);
        }

        if (this.esc_larga == -1) {
            let cumple = true;

            for (let i = 1; i <= 6; i++) {
                cumple = cumple & this.cubeta[i];
            }

            if (!cumple) DOM_mostrar_dato_score(this.jugador, "esclarga", 0);
        }

        if (this.yahtzee == -1) {
            let cumple = false;

            for (let i = 1; i <= 6; i++) {
                if (this.cubeta[i] == 5) {
                    cumple = true;
                    break;
                }
            }

            if (!cumple) DOM_mostrar_dato_score(this.jugador, "yahtzee", 0);
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
        if (this.tres_tipo >= 0 && this.cuatro_tipo >= 0 && this.full_house >= 0 && this.esc_corta >= 0 && this.esc_larga >= 0 && this.yahtzee >= 0 && this.chance >= 0) {
            this.mit_inferior = this.tres_tipo + this.cuatro_tipo + this.full_house + this.esc_corta + this.esc_larga + this.yahtzee + this.chance;

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
                this.yahtzee = valor;
                break;

            case "chance":
                this.chance = valor;
                break;
        }
    }

    resetear_score_mostrar() {
        if (this.unos == -1) DOM_resetear_score(this.jugador, "unos");
        if (this.doses == -1) DOM_resetear_score(this.jugador, "doses");
        if (this.treses == -1) DOM_resetear_score(this.jugador, "treses");
        if (this.cuatros == -1) DOM_resetear_score(this.jugador, "cuatros");
        if (this.cincos == -1) DOM_resetear_score(this.jugador, "cincos");
        if (this.seises == -1) DOM_resetear_score(this.jugador, "seises");

        if (this.tres_tipo == -1) DOM_resetear_score(this.jugador, "trestipo");
        if (this.cuatro_tipo == -1) DOM_resetear_score(this.jugador, "cuatrotipo");
        if (this.full_house == -1) DOM_resetear_score(this.jugador, "fullhouse");
        if (this.esc_corta == -1) DOM_resetear_score(this.jugador, "esccorta");
        if (this.esc_larga == -1) DOM_resetear_score(this.jugador, "esclarga");
        //Saque al yahtzee para hacer una funcion especifica para el
        if (this.chance == -1) DOM_resetear_score(this.jugador, "chance");
    }

    resetear_score_mostrar_yahtzee(id){
        //Significa que el valor seleccionado y ya asignado (funcion DOM_terminar_turno) no fue el del yahtzee
        if(this.yahtzee == -1){
            DOM_resetear_score(this.jugador, "yahtzee");
        }

        //significa que el valor asignado fue el del yahtzee
        //en ambos mandamos el valor de yahtzee para que lo deje establecido en la tabla 
        if(id == "yahtzee"){
            DOM_guardar_yahtzee(this.jugador, this.yahtzee); //En este caso el valor es el ya asignado
        }
        if(id != "yahtzee" && this.yahtzee > 0){
            DOM_guardar_yahtzee(this.jugador, this.yahtzee); //En este caso es el valor anterior al calculo
        }
    }

    llenar_ceros_score(){
        if (this.unos == -1){
            this.unos = 0;
            DOM_llenar_score_ceros(this.jugador, "unos");
        }
        if (this.doses == -1){
            this.doses = 0;
            DOM_llenar_score_ceros(this.jugador, "doses");
        }
        if (this.treses == -1){
            this.treses = 0;
            DOM_llenar_score_ceros(this.jugador, "treses");
        }
        if (this.cuatros == -1){
            this.cuatros = 0;
            DOM_llenar_score_ceros(this.jugador, "cuatros");
        }
        if (this.cincos == -1){
            this.cincos = 0;
            DOM_llenar_score_ceros(this.jugador, "cincos");
        }
        if (this.seises == -1){
            this.seises = 0;
            DOM_llenar_score_ceros(this.jugador, "seises");
        }

        if (this.tres_tipo == -1){
            this.tres_tipo = 0;
            DOM_llenar_score_ceros(this.jugador, "trestipo");
        }

        if (this.cuatro_tipo == -1) {
            this.cuatro_tipo = 0;
            DOM_llenar_score_ceros(this.jugador, "cuatrotipo");
        }

        if (this.full_house == -1) { 
            this.full_house = 0;
            DOM_llenar_score_ceros(this.jugador, "fullhouse");
        }

        if (this.esc_corta == -1) {
            this.esc_corta = 0;
            DOM_llenar_score_ceros(this.jugador, "esccorta");
        }

        if (this.esc_larga == -1) {
            this.esc_larga = 0;
            DOM_llenar_score_ceros(this.jugador, "esclarga");
        }

        if (this.yahtzee == -1) {
            this.yahtzee = 0;
            DOM_llenar_score_ceros(this.jugador, "yahtzee");
        }

        if (this.chance == -1){
            this.chance = 0;
            DOM_llenar_score_ceros(this.jugador, "chance");
        }
    }
}

class ControladorTurno {
    constructor(num_jugadores) {
        this.num_jugadores = num_jugadores;
        this.turno_jugador = 0;
        this.turnos_totales = num_jugadores * 13;
        // this.turno_actual = 1; 
        this.turno_actual = 1; 
    }

    retornar_turno_jugador() {
        return this.turno_jugador + 1;
    }

    mostrar_ronda_real() {
        if (this.turno_jugador == 0) {
            let ronda_real = Math.floor(this.turno_actual / this.num_jugadores) + this.turno_actual % this.num_jugadores;

            if (ronda_real <= 13) DOM_mostrar_ronda(ronda_real);
        }
    }

    mostrar_turno_jugador() {
        if (this.turno_actual <= this.turnos_totales) DOM_mostrar_turno_jugador(this.turno_jugador + 1);
    }

    finalizar_turno() {
        this.turno_jugador = (this.turno_jugador + 1) % this.num_jugadores;
        this.turno_actual++;
    }

    finalizar_juego() {
        return this.turno_actual > this.turnos_totales;
    }
}

class ControladorGanador {
    constructor() {
        this.lista = [];
    }

    recibir_lista_jugadores(lista_jugadores) {
        this.lista = lista_jugadores;
    }

    calcular_ganador() {
        let ganador = null, mayor_puntaje = 0;
        //Considerar empate

        this.lista.forEach(jugador_actual => {
            jugador_actual.calc_total();
            if (jugador_actual.tot_final > mayor_puntaje) {
                mayor_puntaje = jugador_actual.tot_final;
                ganador = jugador_actual;
            }

            DOM_terminar_juego(ganador);
        });
    }
}

var yahtzee_game = new Yahtzee(2);

//Modifican/utilizan el DOM
function DOM_terminar_tirada() {
    let jugador = yahtzee_game.controlador_turnos.retornar_turno_jugador();
    yahtzee_game.controlador_dados.tirar_dados();

    let lista_valores = yahtzee_game.controlador_dados.retornar_valores_actuales();

    yahtzee_game.lista_jugadores[jugador].calc_cubeta(lista_valores);

    //Si el usuario selecciono un puntaje pero tira, regresamos a la normalidad dicho puntaje
    if (score_ya_seleccionado) {
        score_ya_seleccionado.style.fontSize = '15px';
        score_ya_seleccionado = null;
        id_score_ya_seleccionado = null;
    }

    //Desmarcamos los dados seleccionados para devolverlos a su estado original
    for (let i = 1; i <= 5; i++) {
        document.getElementById('check_dado' + i).checked = false;
    }

    yahtzee_game.lista_jugadores[jugador].resetear_score_mostrar();
    yahtzee_game.lista_jugadores[jugador].calcular_score_mostrar();

    let term_turn = document.getElementById('boton_terminar_turno_j' + jugador);
    let turn_jug = document.getElementById('turno_jugador');

    term_turn.style.display = 'block';
    boton_reservar.style.display = 'block';
    turn_jug.style.color = 'white';

    yahtzee_game.controlador_tiradas.contar_tirada();
}

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
    document.getElementById("boton_reservar").style.display = "none";
}

function DOM_desactivar_tirar() {
    document.getElementById("boton_tirar").style.display = "none";
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
var id_score_ya_seleccionado = null;

function DOM_seleccionar_score(label_id) {
    if (score_ya_seleccionado) {
        score_ya_seleccionado.style.transition = "0.2s";
        score_ya_seleccionado.style.color = "#fffa68";
        score_ya_seleccionado.style.fontSize = "15px";
    }

    score_ya_seleccionado = document.getElementById(label_id);
    id_score_ya_seleccionado = label_id;

    score_ya_seleccionado.style.transition = "0.2s";
    score_ya_seleccionado.style.color = "#da73bd";
    score_ya_seleccionado.style.fontSize = "22px";
}

function DOM_mostrar_dato_score(jugador, elemento, valor) {
    let input_id = "check_score_" + elemento + "_j" + jugador;
    let label_id = "score_" + elemento + "_j" + jugador;

    if (elemento == "total_uno_seis" || elemento == "bonus" || elemento == "total_mit_inferior" || elemento == "total_final") {
        document.getElementById(label_id).innerHTML = valor;
    }
    else {
        if (elemento == "total_mit_superior") {
            let lista = document.getElementsByClassName(label_id);
            for (let i = 0; i < lista.length; i++) {
                lista[i].innerHTML = valor;
            }
        }
        else {
            document.getElementById(input_id).disabled = false;
            document.getElementById(label_id).innerHTML = valor;
            document.getElementById(label_id).style.color = "#fffa68";
        }
    }
}

function DOM_llenar_score_ceros(jugador, elemento){
    let input_id = "check_score_" + elemento + "_j" + jugador;
    let label_id = "score_" + elemento + "_j" + jugador;

    document.getElementById(label_id).innerHTML = "0";
    document.getElementById(input_id).disabled = true;
    document.getElementById(label_id).style.color = "white";
}

function DOM_mostrar_ronda(ronda_real) {
    document.getElementById("num_ronda").innerHTML = "número" + ronda_real;
}

function DOM_mostrar_turno_jugador(turno_jugador) {
    document.getElementById("turno_jugador").innerHTML = "jugador" + turno_jugador;
    document.getElementById("turno_jugador").style.color = "#fffa68";
}

function DOM_set_elementos_siguiente_jugador(jugador_anterior, jugador_actual) {
    for (let i = 1; i <= 5; i++) {
        document.getElementById("check_dado" + i).style.cursor = "default";
        document.getElementById("check_dado" + i).disabled = true;
        document.getElementById("check_dado" + i).checked = false;
        document.getElementById("dado" + i).src = "Imagenes/signo_interr.svg";
    }

    document.getElementById("boton_reservar").style.display = "none";

    document.getElementById("tirada_j" + jugador_anterior).innerHTML = "Tirada número ?";
    document.getElementById("tirada_j" + jugador_anterior).style.display = "none";
    document.getElementById("tirada_j" + jugador_actual).innerHTML = "Tirada número ?";
    document.getElementById("tirada_j" + jugador_actual).style.display = "block";

    document.getElementById("boton_terminar_turno_j" + jugador_anterior).style.display = "none";

    document.getElementById("boton_tirar").style.display = "block";
}

function DOM_resetear_score(jugador, id) {
    document.getElementById("check_score_" + id + "_j" + jugador).disabled = true;
    document.getElementById("score_" + id + "_j" + jugador).innerHTML = '';
}

function DOM_guardar_yahtzee(jugador, valor){
    document.getElementById("check_score_yahtzee_j" + jugador).disabled = true;
    document.getElementById("score_yahtzee_j" + jugador).innerHTML = valor;
    document.getElementById("score_yahtzee_j" + jugador).style.color = 'white';
}

function DOM_terminar_turno() {
    let jugador_anterior = yahtzee_game.controlador_turnos.retornar_turno_jugador();
    yahtzee_game.controlador_turnos.finalizar_turno();
    let jugador_actual = yahtzee_game.controlador_turnos.retornar_turno_jugador();

    //Manipulamos el id para que sea correctamente leido por nuestra funcion miembro asignar_valor()
    let id_enviar = id_score_ya_seleccionado.substring(6, id_score_ya_seleccionado.length - 3);
    yahtzee_game.lista_jugadores[jugador_anterior].asignar_valor(id_enviar, Number(score_ya_seleccionado.innerHTML));
    yahtzee_game.lista_jugadores[jugador_anterior].calc_bonus_mitsuperior();
    yahtzee_game.lista_jugadores[jugador_anterior].calc_mitinferior();

    //Regresamos a la normalidad el puntaje seleccionado
    score_ya_seleccionado.style.fontSize = '15px';
    score_ya_seleccionado.style.color = 'white';
    let check_score_seleccionado = document.getElementById('check_' + id_score_ya_seleccionado);
    check_score_seleccionado.disabled = true;

    yahtzee_game.controlador_dados.resetear_lista_reservados();
    DOM_set_elementos_siguiente_jugador(jugador_anterior, jugador_actual);
    DOM_des_reservar_dados();

    yahtzee_game.lista_jugadores[jugador_anterior].resetear_score_mostrar();
    yahtzee_game.lista_jugadores[jugador_anterior].resetear_score_mostrar_yahtzee(id_enviar);
    yahtzee_game.controlador_tiradas.resetear_tiradas_turno_jug(jugador_actual);
    document.getElementById('score_form_j' + jugador_anterior).reset();

    yahtzee_game.controlador_turnos.mostrar_ronda_real();
    yahtzee_game.controlador_turnos.mostrar_turno_jugador();

    if (yahtzee_game.controlador_turnos.finalizar_juego()) {
        yahtzee_game.rellenar_score_jugadores();
        yahtzee_game.ultimo_calculo_score_jugadores();
        yahtzee_game.controlador_ganador.recibir_lista_jugadores(yahtzee_game.retornar_lista_jugadores());
        yahtzee_game.controlador_ganador.calcular_ganador();
    }
}

function DOM_terminar_juego(ganador) {
    let mensaje = "El ganador es" + "<br>" + "el JUGADOR " + ganador.jugador + " con " + ganador.tot_final + " puntos";

    document.getElementById("recuadro_ganador").innerHTML = mensaje;
    document.getElementById("sombra_recuadro_ganador").style.display = "block";
    document.getElementById("recuadro_ganador").style.display = "block";

}