'use strict';
// BANK DATA
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-09-27T17:01:17.194Z',
    '2021-10-26T23:36:17.929Z',
    '2021-10-27T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// ElEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const openPage = document.querySelector('.open-page');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const inputOwner = document.querySelector('.owner');
const ownerBalance = document.querySelector('.owner-balcance');
const ownerUsername = document.querySelector('.owner-username');
const logoutButton = document.querySelector('.logout-button');
const loginForm = document.querySelector('.login-form');
const changePasswordActual= document.querySelector('.password_actual');
const changePasswordNew = document.querySelector('.password_new');
const btnChangePassword = document.querySelector('.btnChangePassword');
const btnChangeName = document.querySelector('.btnChangeName');
const changeNamePin = document.querySelector('.name_actual_pin');
const changeNameNew= document.querySelector('.name_new');

// USER INFORMATION 
const displayUserInformation = function(user){

  user.balance = user.movements.reduce((user,mov)=> user + mov,0);
  console.log(user)
  ownerBalance.textContent = formatCur(user.balance,user.locale,user.currency);;
  ownerUsername.textContent = `User: ${user.userName}`;
  inputOwner.textContent = user.owner;
}

const formatCur = function(value,locale,currency){
  return new Intl.NumberFormat(locale, 
    {
      style: 'currency',
      currency: currency
    }
  ).format(value); 
} 

const formatMovementDate = function(date,locale){
  const calcDaysPassed = (date1,date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed =  calcDaysPassed(new Date(), date)

  if(daysPassed === 0) return 'Today'; 
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date)
}

// DISPLAY MOVEMENTS
const displayMovements = function(acc,sort=false){
  containerMovements.innerHTML = '';
  
  const movs = sort ? acc.movements.slice().sort((a,b)=>a-b) : acc.movements
   
  movs.forEach((mov,i) => {
    const type = mov>0? 'success' : 'danger';
    const typeDeposit = mov>0? 'Deposit' : 'Withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date,acc.locale);

    const formattedMov = formatCur(mov,acc.locale,acc.currency);

    const html = `
    <li class="list-group-item d-flex align-items-center">${formattedMov} <span class="movements__date ml-3"> ${displayDate}</span>
    <span class="badge badge-${type} badge-pill ml-auto">${
      i + 1
    } ${typeDeposit}</span>
    </li>
 `
  containerMovements.insertAdjacentHTML('afterbegin',html)
  });
} 
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// CREATE USERNAME
const createUserName = function(accs){
  accs.forEach(function(acc) {
  acc.userName = acc.owner.toLowerCase().split(' ').map(userName=>userName[0]).join('');  
  });
}
createUserName(accounts);
const userMovements = function(accs){
  accs.forEach(function(acc) {
   acc.deposits = acc.movements.filter((e)=>e>0);
   acc.withdrawls = acc.movements.filter((e)=>e<0);
 });
}
userMovements(accounts);

//TRANSFER MONEY
btnTransfer.addEventListener('click',function(e){

  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.userName === inputTransferTo.value) ;

  inputTransferAmount.value = inputTransferTo.value  = ''

  if(amount > 0 && reciverAcc && correntAccount.balance >= amount && reciverAcc?.userName !== correntAccount.userName){
    correntAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    correntAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());

    updateUI(correntAccount);
    clearInterval(timer)
    timer = startLogOutTimer();
  }
})

// DISPLAY BALANCE
const calcDisplayBalance = function(acc){
  acc.balance = acc.movements.reduce((acc,mov)=> acc + mov,0);
  labelBalance.textContent = formatCur(acc.balance,acc.locale,acc.currency);;
}

// DISPLAY SUMMARY
const calcDisplaySummary = function(acc){
  const inComes = acc.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0);
  labelSumIn.textContent = formatCur(inComes,acc.locale,acc.currency);

  const outComes = acc.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0);
  labelSumOut.textContent = formatCur(Math.abs(outComes),acc.locale,acc.currency);
  
  const interest = acc.movements
  .filter(mov=>mov>0)
  .map(deposit => deposit * acc.interestRate/100)
  .filter(interest=>interest>=1)
  .reduce((acc,int)=>acc+int,0)

  labelSumInterest.textContent = formatCur(interest ,acc.locale,acc.currency);
}

const shuttingDownAccount = function(){
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log In'
  logoutButton.style.display = 'none';
  loginForm.style.display = 'block';
  openPage.style.display = 'block'
  openPage.style.opacity = 1;
  clearInterval(timer)
  timer = startLogOutTimer();
}

// LOGOUT BUTTON
logoutButton.addEventListener('click', function(e){
  e.preventDefault(); 
  shuttingDownAccount();
});

// LGOIN ACCOUNT
let correntAccount, timer;
btnLogin.addEventListener('click', function(e){
  e.preventDefault(); 
  correntAccount = accounts.find(acc => acc.userName === inputLoginUsername.value );

  if( correntAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Hello ${correntAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    logoutButton.style.display = 'block';
    loginForm.style.display = 'none';
    openPage.style.opacity = 0;
    openPage.style.display = 'none';
    updateUI(correntAccount);

    //timer
    if(timer) clearInterval(timer)
    timer = startLogOutTimer();

    //REVER
    containerApp.style.opacity = 100;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }
    labelDate.textContent = new Intl.DateTimeFormat(correntAccount.locale ,options).format(now);

    inputLoginPin.value = inputLoginUsername.value = ''; 
    inputLoginPin.blur();
  }
});

// LOAN 
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value); 
  if(amount > 0 && correntAccount.movements.some(mov=> mov >= amount * 0.1)){
    
    setTimeout(function(){correntAccount.movements.push(amount)

    correntAccount.movementsDates.push(new Date().toISOString());
    updateUI(correntAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
    },2500)
    
  }
  inputLoanAmount.value = '';
   
})

// CHANGE PASSWORD 
btnChangePassword.addEventListener('click', function(e){
  e.preventDefault();
  if(Number(changePasswordActual.value) === correntAccount.pin){
    correntAccount.pin = changePasswordNew.value;
  }
})
// CHANGE NAME 
btnChangeName.addEventListener('click', function(e){
  e.preventDefault();
  
  if(Number(changeNamePin.value) === correntAccount.pin){
    correntAccount.owner = changeNameNew.value;
  }
  createUserName(accounts);
  updateUI(correntAccount);
})
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === correntAccount.userName &&
    Number(inputClosePin.value) === correntAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === correntAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// UPDATE UI
const updateUI = function(acc){
  displayMovements(acc); 
  calcDisplayBalance(acc)
  calcDisplaySummary(acc);
  displayUserInformation(acc)
}  

// LOGIN TIMER
const startLogOutTimer = function(){
  const tick = function(){
    const min = String (Math.trunc(time / 60)).padStart(2,0);
    const sec = String (time % 60).padStart(2,0 );
    labelTimer.textContent = `${min}: ${sec}`;
    
    if(time === 0){
      clearInterval(timer);
      shuttingDownAccount();
    } 
    time--
  }  
let time = 120;
tick();
const timer = setInterval(tick,1000);
return timer;
}

// SORT MOVEMENTS
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'),el => el.textContent.replace('€',''));  
})

// TRANSFORM TEXT
const transformText = function(title){
  const exceptions = ['a', 'e', 'ou',];
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const titleCase = title
  .toLowerCase()
  .split(' ')
  .map(word => exceptions.includes(word) ? word : capitalize(word)).join(' ')
  return capitalize(titleCase)
}
