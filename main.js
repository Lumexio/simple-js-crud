
const { get, create, update, remove } = require('./methods.js');
const readlineSync = require('readline-sync');

const readline = require('readline');

function pauseExecution() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Press Enter to continue...', () => {
      console.clear();
      rl.close();
      resolve();
    });
  });
}

async function main() {
  do {
    var key = readlineSync.questionInt('1. Get\n2. Create\n3. Edit\n4. Remove\n5. Salir\n Opcion:');
    switch (key) {
      case 1:
        get();
        await pauseExecution();
        break;
      case 2:
        create();
        await pauseExecution();
        break;
      case 3:
        update();
        await pauseExecution();
        break;
      case 4:
        remove();
        await pauseExecution();
        break;
      case 5:
        await pauseExecution();
        console.log("Adios");
        key = -1;
        break;
      default:
        console.log("Opcion no valida");
        break;
    }
  } while (key != -1);

}
main();