import { firebaseConfig } from "/js/environment.js";


let currentUser = null 

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()
const auth = firebase.auth()


// Funciones para login y logout con Google 
loginBtn.addEventListener('click', async () =>
{
    const provider = new firebase.auth.GoogleAuthProvider()
    await auth.signInWithPopup(provider)
})

logoutBtn.addEventListener('click', async () =>
{
    await auth.signOut()
})


// Evento que escucha cuando cambia de estado la autenticación 
auth.onAuthStateChanged(user =>
{
    //console.log('@@@ user => ', user)
    if(user)
    {
        currentUser = user
        userInfo.textContent = user.email
        loginBtn.style.display = 'none'
        logoutBtn.style.display = 'block'
        console.log('Usuario autenticado')
        

    }
    else
    {
        currentUser = null
        userInfo.textContent = 'No autenticado'
        //loginBtn.style.display = 'block'
        logoutBtn.style.display = 'none'
        console.log('Usuario NO autenticado')

    }
})
