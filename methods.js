const readlineSync = require('readline-sync');
var fs = require('fs');

// Define ANSI escape codes for styling
const styles = {
 reset: '\x1b[0m',
 bright: '\x1b[1m',
 dim: '\x1b[2m',
 underscore: '\x1b[4m',
 blink: '\x1b[5m',
 reverse: '\x1b[7m',
 hidden: '\x1b[8m',
 fgBlack: '\x1b[30m',
 fgRed: '\x1b[31m',
 fgGreen: '\x1b[32m',
 fgYellow: '\x1b[33m',
 fgBlue: '\x1b[34m',
 fgMagenta: '\x1b[35m',
 fgCyan: '\x1b[36m',
 fgWhite: '\x1b[37m',
 bgBlack: '\x1b[40m',
 bgRed: '\x1b[41m',
 bgGreen: '\x1b[42m',
 bgYellow: '\x1b[43m',
 bgBlue: '\x1b[44m',
 bgMagenta: '\x1b[45m',
 bgCyan: '\x1b[46m',
 bgWhite: '\x1b[47m'
};
var BoxArr = [];
class Pokemon {
 constructor(nombre, tipo, vida, ataque, defensa) {
  this.nombre = nombre;
  this.tipo = tipo;
  this.vida = vida;
  this.ataque = ataque;
  this.defensa = defensa;

 }
}
function create() {
 console.clear();
 console.log(styles.bgYellow + styles.fgBlack + '||Create Pokemon||\n' + styles.reset);
 let nombre = readlineSync.question('Nombre:');
 let tipo = readlineSync.question('Tipo:');
 let vida = readlineSync.questionInt('Vida:');
 let ataque = readlineSync.questionInt('Ataque:');
 let defensa = readlineSync.questionInt('Defensa:');

 let newPokemon = new Pokemon(nombre, tipo, vida, ataque, defensa);

 // Read existing data from JSON file
 fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) {
   console.log(err);
   return;
  }
  let existingData = JSON.parse(data);

  // Check if the new Pokemon already exists in the data
  let pokemonExists = existingData.some(p => p.nombre === newPokemon.nombre);

  if (!pokemonExists) {
   // Add the new Pokemon to the existing data
   existingData.push(newPokemon);

   // Write the updated data back to the JSON file
   fs.writeFile('data.json', JSON.stringify(existingData), function (err) {
    if (err) {
     console.log(err);
     return;
    }
    console.log('Pokemon added successfully.');
   });
  } else {
   console.log('Pokemon already exists.');
  }
 });
}
function get() {

 fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) {
   console.log(err);
   return;
  }
  BoxArr = JSON.parse(data);
  console.clear();
  BoxArr.length > 0 ? formatTable(BoxArr) : console.log("No hay datos");
 });

}
function formatTable(BoxArr) {
 console.log(styles.bgYellow + styles.fgBlack + 'Pokemon list' + styles.reset);
 console.log("Nombre | Tipo | Vida | Ataque | Defensa");
 BoxArr.forEach(element => {
  console.log(` |${element.nombre}|  |${element.tipo}|    |${element.vida}|      |${element.ataque}|      |${element.defensa}|`);
 });
}
function remove() {

 fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) {
   console.log(err);
   return;
  }
  let pokemon = {
   nombre: ''
  };
  BoxArr = JSON.parse(data);
  console.clear();
  console.log(styles.bgYellow + styles.fgBlack + 'Que pokemon quieres emiliminar?\n' + styles.reset);
  pokemon.nombre = readlineSync.question('Nombre:');
  let param = BoxArr.find((element) => element.nombre == pokemon.nombre);
  if (param) {
   BoxArr.splice(BoxArr.indexOf(param), 1);
   fs.writeFile('data.json', JSON.stringify(BoxArr), function (err) {
    if (err) {
     console.log(err);
     return;
    }
    console.log('Pokémon eliminado correctamente.');
   });
  }
  else {
   console.log("No se encontró un Pokémon con ese nombre.");
  }
 });
}
function clear() {

 BoxArr = [];
}
function update() {
 console.clear();
 console.log(styles.bgYellow + styles.fgBlack + '¿Qué pokemon quieres editar?\n' + styles.reset);
 let pokemonNombre = readlineSync.question('Nombre:');

 // Read existing data from JSON file
 fs.readFile('data.json', 'utf8', function (err, data) {
  if (err) {
   console.log(err);
   return;
  }

  let existingData = JSON.parse(data);

  // Find the pokemon to update
  let pokemonToUpdate = existingData.find(p => p.nombre === pokemonNombre);

  if (pokemonToUpdate) {

   let newNombre = readlineSync.question('Nuevo nombre:');
   let newTipo = readlineSync.question('Nuevo tipo:');
   let newVida = readlineSync.question('Nueva vida:');
   let newAtaque = readlineSync.question('Nuevo ataque:');
   let newDefensa = readlineSync.question('Nueva defensa:');


   // Update properties if new values are provided
   pokemonToUpdate.nombre = newNombre || pokemonToUpdate.nombre;
   pokemonToUpdate.tipo = newTipo || pokemonToUpdate.tipo;
   pokemonToUpdate.vida = newVida !== '' ? parseInt(newVida) : pokemonToUpdate.vida;
   pokemonToUpdate.ataque = newAtaque !== '' ? parseInt(newAtaque) : pokemonToUpdate.ataque;
   pokemonToUpdate.defensa = newDefensa !== '' ? parseInt(newDefensa) : pokemonToUpdate.defensa;

   // Write the updated data back to the JSON file
   fs.writeFile('data.json', JSON.stringify(existingData), function (err) {
    if (err) {
     console.log(err);
     return;
    }
    console.log('Pokémon actualizado correctamente.');
   });
  } else {
   console.log("No se encontró un Pokémon con ese nombre.");
  }
 });
}

module.exports = {
 create: create,
 get: get,
 remove: remove,
 clear: clear,
 update: update
};



