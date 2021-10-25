//Declaración de variable. Determinará de quien es el turno
let turnoX;

//Función de inicio
$(document).ready(function () {
	Empezar(); //Función Empezar
	$('[data-cell]').one('click', CeldaClick); // Se añade la función CeldaClick que se ejecuta una vez por celda
	$('#reiniciar').click(Reiniciar); //Se añade la función Reiniciar al botón de reinicio
});

/*Función Empezar()
Se ejecuta al principio y determina quien tiene el primer turno*/
function Empezar() {
	if (Math.random() * 2 > 1) {
		turnoX = true; //Empieza X
	} else {
		turnoX = false; //Empieza O
		TurnoO();  //Función para que O haga el mejor movimiento
	}
	CambioTablero();
}

/*Función CeldaClick()
Se ejecuta cuando se hace click en una celda*/
function CeldaClick() {
	if ($(this).hasClass('x') || $(this).hasClass('o')) {
		alert('Movimiento no permitido');
	} else {
		Colocar($(this)); //Se dibuja la marca en la casilla seleccionada	

		TurnoO(); //Se ejecuta el turno de O
	}
}

/*Función Colocar
Recibe como parametro una casilla o cuadro en la cual se dibujará la marca*/
function Colocar(cuadro) {
	//Dependiendo del turno se coloca una X o una O añadiendo al clase al div
	cuadro.addClass(turnoX ? 'x' : 'o');
	//Se evalua si hay un ganador con el movimiento efectuado
	if (Ganador(turnoX ? 'x' : 'o')) {
		$('.data-mensaje-ganador-text').text('Ganador ' + (turnoX ? 'x' : 'o') + '!!'); // Se coloca el mensaje de ganador
		$('.mensaje-ganador').addClass('show'); // Se añade la clase para mostrar el mensaje
	} else if (Empate()) {
		//Se evalua si hay un empate
		$('.data-mensaje-ganador-text').text('Empate'); //Se coloca el texto de empate
		$('.mensaje-ganador').addClass('show'); //Se añade la clase para mostrar el mensaje
	} else {
		// Si no hay ganador ni empate se hace el cambió de turno
		CambioTurno();
		CambioTablero();
	}
}

/*Función TurnoO
Determina el mejor movimiento de la IA a través del algoritmo MiniMax*/
function TurnoO() {
	//Solo se ejecutará si turnoX es false
	if (!turnoX) {
		let mejorPun = -Infinity; //Se declara el mejor puntaje
		let Movimiento; //Variable que guardará el mejor movimiento
		let copia = Copia(); //Se guarda una copia del tablero para evaluar los movimientos
		let Puntaje; //Variable que guardará el puntaje del algoritmo y se comparará con el mejor puntaje
		//Bucle para evaluar todas las casillas
		for (let i = 0; i < 9; i++) {
			//Si la casilla está vacía se aplicará el algoritmo para evaluar el mejor movimiento
			if (copia[i] == '') {
				copia[i] = 'o'; //Se coloca la o en la casilla vacía
				//Se aplica el algoritmo MiniMax y se guarda el puntaje
				Puntaje = MiniMax(copia, 0, false);
				copia[i] = ''; //Se borra la o
				//Si el puntaje obtenido es mejor que el mejor puntaje anterior se guarda el movimiendo
				if (Puntaje > mejorPun) {
					mejorPun = Puntaje;
					Movimiento = i;
				}
			}
		}
		Colocar($('[data-cell]').eq(Movimiento)); //Se ejecuta el mejor movimiento
	}
	/*
	let turno = true;
	while (turno) {
		let index = Math.round(Math.random()*8);
		console.log(index);
		if (!$('[data-cell]').eq(index).hasClass('x') && !$('[data-cell]').eq(index).hasClass('o')){
			Colocar($('[data-cell]').eq(index));
			turno = false;
		}
	}*/
}

/*Función Ganador()
Se evalua si se cumple la condición para ganar
Recibe como parametro una x o una o dependiendo del turno*/
function Ganador(turno) {
	if ($('[data-cell]').eq(0).hasClass(turno) && $('[data-cell]').eq(1).hasClass(turno)
		&& $('[data-cell]').eq(2).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(3).hasClass(turno) && $('[data-cell]').eq(4).hasClass(turno)
		&& $('[data-cell]').eq(5).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(6).hasClass(turno) && $('[data-cell]').eq(7).hasClass(turno)
		&& $('[data-cell]').eq(8).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(0).hasClass(turno) && $('[data-cell]').eq(3).hasClass(turno)
		&& $('[data-cell]').eq(6).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(1).hasClass(turno) && $('[data-cell]').eq(4).hasClass(turno)
		&& $('[data-cell]').eq(7).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(2).hasClass(turno) && $('[data-cell]').eq(5).hasClass(turno)
		&& $('[data-cell]').eq(8).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(0).hasClass(turno) && $('[data-cell]').eq(4).hasClass(turno)
		&& $('[data-cell]').eq(8).hasClass(turno)) {
		return true;
	}
	if ($('[data-cell]').eq(2).hasClass(turno) && $('[data-cell]').eq(4).hasClass(turno)
		&& $('[data-cell]').eq(6).hasClass(turno)) {
		return true;
	}
}

/*Función Empate()
Evalua si todas las celdas tienen alguna marca pero no hay ganador*/
function Empate() {
	let empate = true;
	$('[data-cell]').each(function (indexInArray, valueOfElement) {
		if (!$(this).hasClass('x') && !$(this).hasClass('o')) {
			empate = false;
		}
	});
	return empate;
}

/*Función CambioTurno()
Cambia la variable turnoX a su valor contrario*/
function CambioTurno() {
	turnoX = !turnoX;
}

/*Función CambioTablero()
Borra cualquier clase del tablero y añade la del turno que toque*/
function CambioTablero() {
	$('#board').removeClass('x');
	$('#board').removeClass('o');
	$('#board').addClass(turnoX ? 'x' : 'o');
}

/*Función Reiniciar()
Se utiliza para reiniciar el tablero. Remueve todas las clases y textos del tablero y casillas
Vuelve a ejecutar la función Empezar()*/
function Reiniciar() {
	$('[data-cell]').removeClass('x');
	$('[data-cell]').removeClass('o');
	$('.data-mensaje-ganador-text').text('');
	$('.mensaje-ganador').removeClass('show');
	Empezar();
	$('[data-cell]').unbind();
	$('[data-cell]').one('click', CeldaClick);
}

/*Función Copia()
Hace una copia del estado actual del tablero y lo devuelve un array*/
function Copia() {
	let tablero = [];
	for (let i = 0; i < 9; i++) {
		if ($('[data-cell]').eq(i).hasClass('x')) {
			tablero.push('x');
		} else if ($('[data-cell]').eq(i).hasClass('o')) {
			tablero.push('o');
		} else {
			tablero.push('');
		}
	}
	return tablero;
}

/*Función VerificaCopia()
Verifica si en la copia del tablero hay un ganador o un empate. Regresa un texto con 
el ganador, empate o vacío en caso de que no haya nada*/
function VerificaCopia(Tablero) {
	if (Tablero[0] == Tablero[1] && Tablero[0] == Tablero[2] && Tablero[0] != '') {
		return Tablero[0];
	}
	if (Tablero[3] == Tablero[4] && Tablero[3] == Tablero[5] && Tablero[3] != '') {
		return Tablero[3];
	}
	if (Tablero[6] == Tablero[7] && Tablero[6] == Tablero[8] && Tablero[6] != '') {
		return Tablero[6];
	}
	if (Tablero[0] == Tablero[3] && Tablero[0] == Tablero[6] && Tablero[0] != '') {
		return Tablero[0];
	}
	if (Tablero[1] == Tablero[4] && Tablero[1] == Tablero[7] && Tablero[1] != '') {
		return Tablero[1];
	}
	if (Tablero[2] == Tablero[5] && Tablero[2] == Tablero[8] && Tablero[2] != '') {
		return Tablero[2];
	}
	if (Tablero[0] == Tablero[4] && Tablero[0] == Tablero[8] && Tablero[0] != '') {
		return Tablero[0];
	}
	if (Tablero[2] == Tablero[4] && Tablero[2] == Tablero[6] && Tablero[2] != '') {
		return Tablero[2];
	}
	let empate = true;
	for (let i = 0; i < 9; i++) {
		if (Tablero[i] == '') {
			empate = false;
		};
	}
	if (empate) return 'Empate';
	return '';
}

/*Función MiniMax()
Algoritmo recursivo que determina el mejor movimiendo de la IA.
Recibe como parámetros el tablero actual, la profundidad (no usada en este algoritmo) y 
si se debe buscar el mejor movimiento de la X o de la O
Referencia: https://en.wikipedia.org/wiki/Minimax*/
function MiniMax(Tablero, Prof, Max) {
	//Verifica si en el tablero hay un ganador
	let Resultado = VerificaCopia(Tablero);
	//Si hay ganador se regresará un valor
	if (Resultado != '') {
		if (Resultado == 'x') return -1; //Si gana X se regresa -1
		if (Resultado == 'o') return 1; //Si gana O se regresa 1
		if (Resultado == 'Empate') return 0; //Si hay empate se regresa =
	}
	//Se declaran las variables de mejor y peor puntaje
	let max = -Infinity;
	let min = Infinity;

	if (Max) {
		//Bucle para evaluar todas las casillas
		for (let i = 0; i < 9; i++) {
			//Si la casilla está vacía se aplicará el algoritmo para evaluar el mejor movimiento
			if (Tablero[i] == '') {
				Tablero[i] = 'o'; //Se coloca la o en la casilla vacía
				//Se aplica el algoritmo MiniMax y se guarda el puntaje
				let puntajeMax = MiniMax(Tablero, Prof + 1, false);
				Tablero[i] = ''; //Se borra el movimiento
				//Si el puntaje obtenido es mejor que el mejor puntaje anterior se guarda el movimiendo
				max = Math.max(max, puntajeMax);
			}
		}
		return max; //se regresa el mejor puntaje
	} else {
		//Bucle para evaluar todas las casillas
		for (let i = 0; i < 9; i++) {
			//Si la casilla está vacía se aplicará el algoritmo para evaluar el mejor movimiento
			if (Tablero[i] == '') {
				Tablero[i] = 'x'; //Se coloca la o en la casilla vacía
				//Se aplica el algoritmo MiniMax y se guarda el puntaje
				let puntajeMin = MiniMax(Tablero, Prof + 1, true);
				Tablero[i] = ''; //Se borra el movimiento
				//Si el puntaje obtenido es peor que el peor puntaje anterior se guarda el movimiendo
				min = Math.min(min, puntajeMin);
			}
		}
		return min; //Se regresa el peor puntaje
	}
}