/* global angular */
var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);
//No need to change anything above this line.

function MainController(BettingService, $timeout) {
    var vm = this; 
    vm.winnerFlag = false;
    vm.racing = false;
    vm.frogs = [];
    vm.currentRace = {};
    vm.arrayOfIds = [];
    vm.arrayOfBets = [];
    vm.maxFrogs = 8; // max number of frogs
    vm.cashOnHand = 300;
    vm.maxBetsPerRace = 2; // cant bet more than twice per race
    
    vm.newRace = function () {
        if (!vm.currentRace.open) {  // want to prevent new race registered before current race is completed
        vm.raceId = BettingService.registerRace();
        vm.arrayOfIds.push(vm.raceId);
        vm.currentRace = BettingService.getRace(vm.raceId);
        vm.frogs=[];
        vm.winnerFlag = false;
        vm.racing = false;
        vm.arrayOfBets = [];
        } else {
            alert('Please complete current race before a new race can be registered');}
    }
    
    vm.changeRace = function(id) {
        if (!vm.racing) {
        vm.currentRace = BettingService.getRace(id);
        vm.raceId = id;
        vm.frogs = BettingService.getContestants(id);
        vm.winnerFlag = true;
        vm.racing = false; 
        vm.arrayOfBets = vm.currentRace.bets;} 
    }
    
vm.printRace = function() {
    console.log(vm.currentRace);}
    
vm.newBet = function(name, bet) {
    if (BettingService.isValidBet(bet, vm.cashOnHand, vm.frogs.length, vm.racing)) {
             var thisBet = {
            name: name,
            wager: bet
        };
    $('#wagerInput').val(''); // clear wager input box
    if (vm.arrayOfBets.length < vm.maxBetsPerRace) {
        BettingService.placeBet(vm.raceId, name, bet);
        vm.cashOnHand -= bet;
        vm.arrayOfBets.push(thisBet);}       
    else {alert('No more than 2 bets per race');}
    
    } 
}
    
    vm.createFrogObj = function (name, posx) {
        var thisFrog = {
            name: name,
            pos: posx
        };
        vm.frogs.push(thisFrog);
        return thisFrog;
    }

    vm.addFrog = function () {
        if (vm.raceId != undefined) {
            if (!vm.racing) {
                if (vm.frogs.length < vm.maxFrogs) {
                var thisFr = vm.createFrogObj('Frog' + ' ' + (vm.frogs.length + 1), 0);
                BettingService.addContestant(vm.raceId, thisFr); }
                else {alert('max of eight contestants reached');}
            } else {alert("Cant add frogs after race has started");}
        }
        else { alert("must register a race by hitting new race before adding frogs"); }
    }

     vm.settleBets = function (winningFrog) {
         var betPaidOff = false;
         var winningWager = 0;
         vm.currentRace = BettingService.getRace(vm.raceId);
        for (var i = 0; i<vm.currentRace.bets.length; i++) {
            var betObj = vm.currentRace.bets[i];
            if (betObj.name === winningFrog.name) {
                betPaidOff = true;
                winningWager = betObj.wager; }
        }
        if (betPaidOff) {
            alert('Congrats. You picked the winning frog '+winningFrog.name+ ' and won twice your bet of '+winningWager);
            //console.log(vm.cashOnHand, winningWager);
            vm.cashOnHand = vm.cashOnHand + winningWager*2;
            
        } else {alert('sorry. your frog(s) didnt win');}
     }


    vm.race = function () {
        if (vm.frogs.length <= 0) {
            alert('Please add a contestant to race');}
        for (var i = 0; i < vm.frogs.length; i++) {
              vm.racing = true;
            if (vm.frogs[i].pos < 100) {
                var randomStep = Math.floor((Math.random() * 1000) + 1);
                var currentPos = vm.frogs[i].pos;
                var newPos = currentPos + randomStep / 100;
                vm.frogs[i].pos = Math.min(newPos, 100);
            }
            if (vm.frogs[i].pos >= 100 && !vm.winnerFlag) {
                vm.winnerFlag = true;
                vm.racing = false;
                BettingService.closeRace(vm.raceId);
                alert('We have a winner ' + vm.frogs[i].name + ' at ' + vm.frogs[i].pos);
                BettingService.setWinner(vm.raceId, vm.frogs[i]);
                vm.settleBets(vm.frogs[i]);
                break;
            }

        }
        if (!vm.winnerFlag && vm.racing) { $timeout(vm.race, 200) };
    }



    vm.joe = new Guy("Joe", 100)
    vm.bob = new Guy("Bob", 150)
    vm.bank = new Guy("Bank", 200);


    function Guy(name, startingCash) {
        this.name = name;
        this.cash = startingCash;
        this.giveCash = function (amount) {
            if (this.cash >= amount && amount > 0) {
                this.cash = this.cash - amount;
                return amount;
            } else {
                console.log("I don't have enough cash to give you " + amount + ". " + this.name + " says...");
                return 0;
            }
        };
        this.receiveCash = function (amount) {
            if (amount > 0) {
                this.cash = this.cash + amount;
                return amount;
            } else {
                console.log(amount + " isn't an amount I'll take " + this.name + " says...");
                return 0;
            }
        }
    }

    vm.giveMoneyToJoe = function (amount) {
        if (vm.bank.cash >= amount) {
            vm.bank.cash -= vm.joe.receiveCash(amount);
        } else {
            alert("The bank is out of money.");
        }
    }

    vm.receiveMoneyFromBob = function (amount) {
        vm.bank.cash += vm.bob.giveCash(amount);
    }

}

app.service('BettingService', BettingService);
function BettingService() {
    var _races = {}; // global variable within BS
    var _raceId = 0; // global variable within BS
    
    this.registerRace = function () {
        var race = new Race();
        return race.id;
    }
    this.getRace = function (raceId) {
        return _races[raceId];
    }

    this.addContestant = function (raceId, contestant) {
        _races[raceId].contestants.push(contestant);
    }
    
    this.closeRace = function (raceId) {
        _races[raceId].open = false;  //No more bets please the race has started
    }

    this.getContestants = function (raceId) {
        return _races[raceId].contestants; // an array of contestants for the current race
    }
   
   this.setWinner = function (id, winner){
      _races[id].winner = winner;
   }
   
 this.isValidBet = function(bet, cash, len, racing) {
   if (racing) {
       alert('Cant bet after the race has started');
       return false;
   }
   else if (bet <=0) {
       alert('Bets need to be gerater than zero');
       return false;
   }
   else if (bet > cash) {
       alert('You cant bet more than your cash on hand. Try again');
       return false;
   } else if (len <=1) {
       alert('need at lest two players to bet');
       return false;
   }
    else {
        return true;
    }     
 }
   
 this.placeBet = function (raceId, bettingOn, wager) {
         
        var thisRace = this.getRace(raceId);
        if (thisRace != undefined) {
        var thisBet = {
            name: bettingOn,
            wager: wager
        };
      
        thisRace.bets.push(thisBet);
        thisRace.tickets+=wager;
        }
    }

    var Race = function () {
        this.id = _raceId;
        this.tickets = 0;
        this.contestants = [];
        this.open = true;
        this.bets = [];     // was {}
        this.winner = {};                       
        _races[this.id] = this;
        _raceId++;
    }
}