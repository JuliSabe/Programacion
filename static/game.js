// Datos básicos de las cartas para simular un mazo
const PALOS_JS = ['Espada', 'Basto', 'Oro', 'Copa'];
const NUMEROS_TRUCO_JS = ['1', '2', '3', '4', '5', '6', '7', '10', '11', '12'];

// Función para generar un mazo simple (solo para simulación de reparto)
function crearMazoSimulado() {
    const mazo = [];
    for (const palo of PALOS_JS) {
        for (const numero of NUMEROS_TRUCO_JS) {
            mazo.push({ numero: numero, palo: palo, id: `${numero} de ${palo}` }); // Guardamos número, palo y id
        }
    }
    return mazo;
}

// Función para barajar un array
function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio
    }
    return array;
}

// Función para simular repartir una mano de 3 cartas
function repartirManoSimulada() {
    const mazo = barajar(crearMazoSimulado());
    return mazo.slice(0, 3);
}

// Función auxiliar para crear el elemento div de una carta
function crearElementoCarta(cartaObj, isPlayed = false, isPlayerCard = false) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // Añadir clase por palo
    if (cartaObj && cartaObj.palo) {
        cardDiv.classList.add(`card-suit-${cartaObj.palo.toLowerCase()}`);
    } else {
         // Esto maneja el caso de cartas boca abajo o placeholders
         cardDiv.classList.add('back');
         if (!isPlayed && !isPlayerCard) { // Si es una carta de mano del oponente (no jugada)
             cardDiv.textContent = '?'; // Opcional: un símbolo en el dorso
         }
         return cardDiv; // Para cartas boca abajo solo necesitamos la clase 'back' y 'card'
    }


    // Añadir contenido si la carta no está boca abajo
    if (cartaObj && cartaObj.numero && cartaObj.palo) {
        cardDiv.innerHTML = `<span class="card-number">${cartaObj.numero}</span><span class="card-suit">${cartaObj.palo.substring(0, 3)}.</span>`;
    }


    if (isPlayed) {
        cardDiv.classList.add('played');
        cardDiv.style.cursor = 'default'; // No se puede hacer clic en cartas de la mesa
    }

    if (isPlayerCard) {
        cardDiv.classList.add('your-card');
        // Añadir un identificador para saber qué carta es si se hiciera clic
        // Usamos el id completo de la carta simulada
        cardDiv.dataset.cardId = cartaObj.id;
        // Simular que se puede hacer clic
        cardDiv.addEventListener('click', () => {
            // En una aplicación real, aquí enviarías la jugada al backend
            console.log(`Simulación: Clic en carta ${cartaObj.id}`);
            // Aquí podrías añadir lógica visual: mover la carta a la mesa, deshabilitar clics, etc.
            // Por ahora, solo mostramos en consola y cambiamos el estilo
            // Primero, desmarcar cualquier otra carta seleccionada
            document.querySelectorAll('.player-hand .card.selected').forEach(c => c.classList.remove('selected'));
            // Marcar la carta clicada
            cardDiv.classList.add('selected');

            // TODO: Habilitar un botón "Jugar Carta Seleccionada" aquí en lugar de jugar directo
        });
    }


    return cardDiv;
}


// Función para renderizar la mano del jugador en el HTML
function renderPlayerHand(hand) {
    const playerHandDiv = document.querySelector('.player-hand');
    playerHandDiv.innerHTML = ''; // Limpiar mano anterior
    hand.forEach((cardObj, index) => {
        const cardElement = crearElementoCarta(cardObj, false, true); // No jugada, es del jugador
        playerHandDiv.appendChild(cardElement);
    });
}

// Función para renderizar las cartas del oponente boca abajo
function renderOpponentHand(numCards) {
     const opponentHandDiv = document.querySelector('.opponent-hand');
     opponentHandDiv.innerHTML = ''; // Limpiar
     for(let i = 0; i < numCards; i++) {
         const backCardDiv = crearElementoCarta(null); // null porque no sabemos qué carta es
         opponentHandDiv.appendChild(backCardDiv);
     }
}

// Función para renderizar las cartas en la mesa para la ronda actual
// Recibe un array con 0, 1 o 2 cartas (primero la del jugador mano de la ronda, luego la del otro)
function renderCardsOnTable(playedCardsInRound) {
    const opponentSlot = document.getElementById('opponent-played-card');
    const playerSlot = document.getElementById('player-played-card');

    // Limpiar slots
    opponentSlot.innerHTML = '';
    playerSlot.innerHTML = '';

    // Asumimos que el primer elemento de playedCardsInRound es la carta del "mano" de la ronda
    // Y el segundo elemento es la carta del "pie" de la ronda
    // En un juego real, necesitarías saber quién jugó qué carta para ponerla en el slot correcto (oponente vs tu mano)
    // Por ahora, simulamos que la primera carta es del oponente y la segunda tuya
    if (playedCardsInRound[0]) {
         const opponentCardElement = crearElementoCarta(playedCardsInRound[0], true, false); // Jugada, no es tu carta
         opponentSlot.appendChild(opponentCardElement);
    }

    if (playedCardsInRound[1]) {
         const playerCardElement = crearElementoCarta(playedCardsInRound[1], true, false); // Jugada, no es tu carta (es la del otro)
         playerSlot.appendChild(playerCardElement);
    }
}


// Función para añadir mensajes al log
function addMessageToLog(message) {
    const logDiv = document.getElementById('game-messages');
    const messageP = document.createElement('p');
    messageP.classList.add('message');
    // Si el mensaje empieza con "> ", usar solo eso. Si no, añadirlo.
    messageP.textContent = message.startsWith('> ') ? message : `> ${message}`;
    logDiv.appendChild(messageP);
    // Hacer scroll hacia abajo automáticamente
    logDiv.scrollTop = logDiv.scrollHeight;
}


// --- Lógica que se ejecuta al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Página de juego cargada. Simulando mano.");

    // --- Simulación de una mano y estado de juego inicial ---
    const playerHand = repartirManoSimulada();
    // No necesitamos la mano del oponente, solo cuántas cartas tiene
    const opponentCardCount = 3;

    // Renderizar las manos
    renderPlayerHand(playerHand);
    renderOpponentHand(opponentCardCount);


    // Simular que se han jugado algunas cartas en la ronda actual (ej: 2 cartas)
    // Estas NO vienen de las manos repartidas arriba, son solo para demostración visual
    const simulatedPlayedCardsInRound = [
         crearMazoSimulado()[Math.floor(Math.random()*40)], // Simula 1ra carta jugada (ej: por oponente)
         crearMazoSimulado()[Math.floor(Math.random()*40)]  // Simula 2da carta jugada (ej: por ti)
    ];
    renderCardsOnTable(simulatedPlayedCardsInRound);


    // Simular puntajes
    document.getElementById('your-points').textContent = Math.floor(Math.random() * 10);
    document.getElementById('opponent-points').textContent = Math.floor(Math.random() * 10);

    // Simular turno y ronda
    document.getElementById('current-round').textContent = "1"; // Siempre empieza en ronda 1 simulada
    document.getElementById('current-turn').textContent = "Tu Nombre"; // O "Nombre Oponente" dependiendo de quién sea mano

    // Añadir mensajes iniciales de simulación
    addMessageToLog("Partida Simulada Iniciada.");
    addMessageToLog("Mano repartida.");
    // Aquí añadirías mensajes sobre envido/flor si se simularan
    addMessageToLog(`Ronda ${document.getElementById('current-round').textContent}.`);
    addMessageToLog(`Turno de ${document.getElementById('current-turn').textContent}.`);


    // Simular acciones disponibles (lista estática por ahora)
    // Se actualiza dinámicamente en un juego real
    const actionsList = document.getElementById('available-actions');
     // Limpiar lista estática inicial (si hay acciones que no son enlaces)
     actionsList.innerHTML = '';
     // Añadir acciones como enlaces clicables (ejemplo)
     actionsList.innerHTML = `
         <li><a href="#" data-action="play_card">Jugar Carta Seleccionada</a></li>
         <li><a href="#" data-action="sing_envido">Cantar Envido</a></li>
         <li><a href="#" data-action="sing_truco">Cantar Truco</a></li>
         <li><a href="#" data-action="go_to_deck">Ir al Mazo</a></li>
     `;
     // Nota: 'Jugar Carta Seleccionada' debería estar deshabilitada hasta que se seleccione una carta
     // Y las otras acciones dependen del turno, envido/truco ya cantado, etc.

     // Ejemplo: Deshabilitar "Jugar Carta Seleccionada" inicialmente
     const playCardAction = actionsList.querySelector('a[data-action="play_card"]');
     if (playCardAction) {
         playCardAction.classList.add('disabled-action'); // Añade una clase para estilo
         playCardAction.style.pointerEvents = 'none'; // Deshabilita el clic
         playCardAction.style.opacity = 0.5; // Apariencia deshabilitada
     }

     // TODO: Al hacer clic en una carta de la mano, habilitar el botón 'Jugar Carta Seleccionada'
     // Y al hacer clic en 'Jugar Carta Seleccionada', simular mover la carta a la mesa.

});