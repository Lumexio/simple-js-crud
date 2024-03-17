const readlineSync = require('readline-sync');
var fs = require('fs');
var mariadb = require('mariadb');
// MariaDB connection configuration
const pool = mariadb.createPool({
 host: 'localhost',
 user: 'root',
 password: 'pass',
 database: 'pokemon_db',
 connectionLimit: 5 // adjust as needed
});
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
function insertIntoJson(newPokemon) {
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
// Function to insert data into MariaDB database
async function insertIntoMariaDB(pokemon) {
 let conn;
 try {
  conn = await pool.getConnection();
  const sql = 'INSERT INTO pokemons (nombre, tipo, vida, ataque, defensa) VALUES (?, ?, ?, ?, ?)';
  const values = [pokemon.nombre, pokemon.tipo, pokemon.vida, pokemon.ataque, pokemon.defensa];
  const result = await conn.query(sql, values);
  console.log('Pokemon inserted into MariaDB:', result);
 } catch (err) {
  console.log('Error inserting data into MariaDB:', err);
 } finally {
  if (conn) conn.release();
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

 // Prompt the user to choose insertion method
 const options = ['MySQL', 'JSON'];
 const index = readlineSync.keyInSelect(options, 'Choose insertion method:');

 if (index === 0) {
  insertIntoMariaDB(newPokemon);
 } else if (index === 1) {
  insertIntoJson(newPokemon);
 } else {
  console.log('Operation canceled.');
 }
}
function getFromJson() {

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
async function getFromMariadb() {
 let conn
 pool.getConnection()
  .then(connection => {
   conn = connection;
   return conn.query('SELECT * FROM pokemons');
  })
  .then(rows => {
   BoxArr = rows;
   console.clear();
   BoxArr.length > 0 ? formatTable(BoxArr) : console.log("No hay datos");
  })
  .catch(err => {
   console.log('Error retrieving data from MariaDB:', err);
  })
  .finally(() => {
   if (conn) conn.release();
  });
}
function get() {
 console.clear();
 // Prompt the user to choose insertion method
 const options = ['MySQL', 'JSON'];
 const index = readlineSync.keyInSelect(options, 'Choose where to retrieve data from:');

 if (index === 0) {
  getFromMariadb();
 } else if (index === 1) {
  getFromJson();
 } else {
  console.log('Operation canceled.');
 }
}
function formatTable(BoxArr) {
 console.log(styles.bgYellow + styles.fgBlack + 'Pokemon list' + styles.reset);
 console.log("Nombre | Tipo | Vida | Ataque | Defensa");
 BoxArr.forEach(element => {
  console.log(` |${element.nombre}|  |${element.tipo}|    |${element.vida}|      |${element.ataque}|      |${element.defensa}|`);
 });
}
async function removeOnMariadb() {
 let conn;
 try {
  conn = await pool.getConnection();
  const pokemons = await conn.query('SELECT nombre FROM pokemons');
  console.clear();
  console.log(styles.bgYellow + styles.fgBlack + 'Which pokemon do you want to remove?\n' + styles.reset);
  const pokemonNames = pokemons.map(p => p.nombre);
  const index = readlineSync.keyInSelect(pokemonNames, 'Choose a pokemon to remove:');
  if (index !== -1) {
   const result = await conn.query('DELETE FROM pokemons WHERE nombre = ?', [pokemonNames[index]]);
   console.log('Pokemon removed from MariaDB:', result);
  }
 } catch (err) {
  console.log('Error removing data from MariaDB:', err);
 } finally {
  if (conn) conn.release();
 }
}
function removeOnJson() {
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
function remove() {
 console.clear();
 // Prompt the user to choose insertion method
 const options = ['MySQL', 'JSON'];
 const index = readlineSync.keyInSelect(options, 'Choose where to remove data from:');

 if (index === 0) {
  removeOnMariadb();
 } else if (index === 1) {
  removeOnJson();
 } else {
  console.log('Operation canceled.');
 }
}
function clear() {

 BoxArr = [];
}
async function updateFromMariadb() {
 let conn;
 pool.getConnection()
  .then(connection => {
   conn = connection;
   return conn.query('SELECT nombre FROM pokemons');
  })
  .then(pokemons => {
   console.clear();
   console.log(styles.bgYellow + styles.fgBlack + '¿Qué pokemon quieres editar?\n' + styles.reset);
   const pokemonNames = pokemons.map(p => p.nombre);
   const index = readlineSync.keyInSelect(pokemonNames, 'Choose a pokemon to update:');
   if (index !== -1) {
    const pokemon = pokemons[index];
    const newNombre = readlineSync.question('Nuevo nombre:');
    const newTipo = readlineSync.question('Nuevo tipo:');
    const newVida = readlineSync.question('Nueva vida:');
    const newAtaque = readlineSync.question('Nuevo ataque:');
    const newDefensa = readlineSync.question('Nueva defensa:');

    const sql = 'UPDATE pokemons SET nombre = ?, tipo = ?, vida = ?, ataque = ?, defensa = ? WHERE nombre = ?';
    const values = [newNombre, newTipo, newVida, newAtaque, newDefensa, pokemon.nombre];
    return conn.query(sql, values);
   }
  })
  .then(result => {
   console.log('Pokemon updated in MariaDB:', result);
  })
  .catch(err => {
   console.log('Error updating data in MariaDB:', err);
  })
  .finally(() => {
   if (conn) conn.release();
  });
}
function updateFromJson() {
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
function update() {
 console.clear();
 // Prompt the user to choose insertion method
 const options = ['MySQL', 'JSON'];
 const index = readlineSync.keyInSelect(options, 'Choose where to update data from:');

 if (index === 0) {
  updateFromMariadb();
 } else if (index === 1) {
  updateFromJson();
 } else {
  console.log('Operation canceled.');
 }
}

module.exports = {
 create: create,
 get: get,
 remove: remove,
 clear: clear,
 update: update
};



