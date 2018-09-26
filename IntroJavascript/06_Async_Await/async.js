function scaryClown() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('🤡');
      }, 2000);
    });
  }
  
  async function msg() {
    const msg = await scaryClown();
    console.log('Message:', msg);
  }
  
msg(); // Message: 🤡 <-- after 2 seconds
  



async function getBlogAndPhoto(userId) {
  try {
     let utente = await fetch("/utente/" + userId);
     let blog = await fetch("/blog/" + utente.blogId);
     let foto = await fetch("/photo/" + utente.albumId);
     return {
        utente,
        blog,
        foto
     };
  } catch (e) {
     console.log("Si è verificato un errore!");
  }
}

//Approccio interessante il promise.ALL perchè permette di aspettare una info 
async function getBlogAndPhoto(userId) {
  try {
     let utente = await fetch("/utente/" + userId);
     let result = await Promise.all([
        fetch("/blog/" + utente.blogId),
        fetch("/photo/" + utente.albumId)
     ]);
     return {
        utente,
        blog: result[0],
        foto: result[1]
     };
  } catch (e) {
     console.log("Si è verificato un errore!")
  }
}


const getFirstUserData = async () => {
  const response = await fetch('/users.json') // get users list
  const users = await response.json() // parse JSON
  const user = users[0] // pick first user
  const userResponse = await fetch(`/users/${user.name}`) // get user data
  const userData = await user.json() // parse JSON
  return userData
}


let done = true

const isItDoneYet = new Promise(
  (resolve, reject) => {
    if (done) {
      const workDone = 'Here is the thing I built'
      resolve(workDone)
    } else {
      const why = 'Still working on something else'
      reject(why)
    }
  }
)

const checkIfItsDone = () => {
  isItDoneYet
    .then((ok) => {
      console.log(ok)
    })
    .catch((err) => {
      console.error(err)
    })
}


const promiseToDoSomething = () => {
  return new Promise(resolve => {
      setTimeout(() => resolve('I did something'), 10000)
  })
}

const watchOverSomeoneDoingSomething = async () => {
  const something = await promiseToDoSomething()
  return something + ' and I watched'
}

const watchOverSomeoneWatchingSomeoneDoingSomething = async () => {
  const something = await watchOverSomeoneDoingSomething()
  return something + ' and I watched as well'
}

watchOverSomeoneWatchingSomeoneDoingSomething().then((res) => {
  console.log(res)
})


const fs = require('fs')

// promisify is a neat tool in the util module that transforms a callback function into a promise one
const { promisify } = require('util')
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

const writeAndRead = async () => {
  await writeFile('./test.txt', 'Hello World')
  const content = await readFile('./test.txt', 'utf-8')

  return content
}

writeAndRead()
  .then(content => console.log(content)) // Hello World