const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");

exports.helpCmd = rl => {
	log("Comandos:");
	log("	h|help - Muestra esta ayuda.");
	log("	list - Listar los quizzes existentes.");
	log("	show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
	log("	add - Añadir un nuevo quiz interactivamente.");
	log("	delete <id> - Borrar el quiz indicado.");
	log("	edit <id> - Editar el quiz indicado.");
	log("	test <id> - Probar el quiz indicado.");
	log("	p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	log("	credits - Créditos.");
	log("	q|quit - Salir del programa.");
	rl.prompt();
};

exports.addCmd = rl => {

	rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

		rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
	
			model.add(question, answer);
			log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
			rl.prompt();
		});
	});
		
};

exports.listCmd = rl => {
	
	model.getAll().forEach((quiz, id) => {
		log(`	[${colorize(id, 'magenta')}]: ${quiz.question}`);
	});

	rl.prompt();
};

exports.showCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {		
		try {
			const quiz = model.getByIndex(id);
			log(`	[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.testCmd = (rl, id) => {

	if (typeof id === "undefined") {

		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else { 

		try {

		const quiz = model.getByIndex(id);

		rl.question(colorize(`${quiz.question} `, 'red'), respuesta => {
			
			if ((respuesta || "").toLowerCase().trim() === (quiz.answer || "").toLowerCase().trim()) {
				log(`Su respuesta es: correcta`);
				biglog('correcta', 'green');
				rl.prompt();
			} else {
				log(`Su respuesta es: incorrecta`);
				biglog('incorrecta', 'red');
				rl.prompt();
			}
		});


		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
};
			



		/* rl.question  quiz.question	resp => {
			if (respuesta === quiz.answer)	correcto/incorrecto

				prompt

		}

		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}	
	}
};*/

exports.playCmd = rl => {
	
	let score = 0;

	let toBeResolved = []; //id de las preguntas sin responder
	
	let i = 0;
	let length = 0;

	model.getAll().forEach(() => {
		length++;
	});

	for(i; i<length; i++) {
		toBeResolved.push(i);
	};

	const playOne = () => {

		if (toBeResolved.length === 0) {

			log(`No hay nada más que preguntar.`); 
			log(`Fin del examen. Aciertos:`);
			biglog(`${score}`, 'red'); //resultado por pantalla
			score = 0;
			rl.prompt();

		} else {

			let index1 = parseInt(Math.random()*(toBeResolved.length-1));
			let id = toBeResolved[index1];
			
			toBeResolved.splice(index1, 1);

			let quiz = model.getByIndex(id);

			rl.question(colorize(`${quiz.question}? `, 'red'), respuesta => {
			
				if ((respuesta || "").toLowerCase().trim() === (quiz.answer || "").toLowerCase().trim()) {				

					score++
					log(`CORRECTO - Lleva ${score} aciertos`);
					playOne();
				} else {
					log(`INCORRECTO`);
					log(`Fin del examen. Aciertos:`);
					biglog(`${score}`, 'red');
					score = 0;
					rl.prompt();
				}
			});
		}
	};

			/*rl.question(quiz.question, respuesta => {
				respu === quiz.answer //quitar espacios 

				bien -> mensaje + score+1, 
					llamada a playOne recursiva
				else mal -> mensaje, sacar score, prompt 
			})

		}*/
	

	playOne(); //llamada para la primera vez*/


};

exports.deleteCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
	} else {		
		try {
			model.deleteByIndex(id);			
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.editCmd = (rl, id) => {

	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

		    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {

				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);


				rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {

				   model.update(id, question, answer);
				   log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
				   rl.prompt();
				});
		   });
		} catch(error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
};

exports.quitCmd = rl => {
	rl.close();
};

exports.creditsCmd = rl => {
	log('Autor de la práctica:');
	log('Sergio Ávalos Legaz');
	rl.prompt();  		
};
