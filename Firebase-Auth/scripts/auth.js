//listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('guides').onSnapshot(snapshot => {
            setupGuides(snapshot.docs)
            setupUI(user);
        }, err =>{
            console.log(err.message);
        });
    } else {
        setupUI();
        setupGuides([]);
    }
});

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    db.collection('guides').add({
        item: createForm['item'].value,
        amount: createForm['amount'].value,
        urgency: createForm['urgency'].value,
        department: createForm['department'].value
    }).then(() =>{
        //close the modal and reset form
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    }).catch(err => {
        console.log(err.message);
    })

})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    console.log(email, password)

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            Hospital_Name: signupForm['signup-Hospital-name'].value,
            Registry_Link: signupForm['signup-link-worker-registry'].value,
            Hospital_Department: signupForm['signup-Hospital-Department'].value,
            Phone_Number: signupForm['signup-phone-number'].value,
            Doc_Name: signupForm['signup-link-doc-name'].value
        });
    }).then(() =>{
         // close the signup modal & reset form
         const modal = document.querySelector('#modal-signup');
         M.Modal.getInstance(modal).close();
         signupForm.reset();
    });


});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) =>{
    e.preventDefault();
    auth.signOut();
});


// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred.user);
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});