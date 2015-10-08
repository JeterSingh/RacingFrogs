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
    vm.maxLength = 8; // max number of frogs
    vm.cashOnHand = 300;
    vm.newRace = function () {
        if (!vm.currentRace.open) {  // want to prevent new race registered before current race is completed
        vm.raceId = BettingService.registerRace();
        vm.arrayOfIds.push(vm.raceId);
        vm.currentRace = BettingService.getRace(vm.raceId);
        vm.frogs=[];
        vm.winnerFlag = false;
        vm.racing = false;
        vm.arrayOfBets = [];
        } else {alert('please complete current race before a new race can be registered');}
    }
    
    vm.changeRace = function(id) {
        if (!vm.racing) {
        vm.currentRace = BettingService.getRace(id);
        vm.raceId = id;
        vm.frogs = BettingService.getContestants(id);
        vm.winnerFlag = true;
        vm.racing = false; } 
    }
    
vm.printRace = function() {
    console.log(vm.currentRace);}
    
vm.newBet = function(name, bet) {
    if (!vm.racing) {
        if (bet > 0) {
             var thisBet = {
            name: name,
            wager: bet
        };
    alert('you want to bet '+bet + ' on ' +name);
    BettingService.placeBet(vm.raceId, name, bet);
    vm.cashOnHand -= bet;
    vm.arrayOfBets.push(thisBet);
    }
    else {alert("bets need to be greater than zero");}
    }
    else {alert('cant bet after the race has started');}
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
                if (vm.frogs.length <=7) {
                var thisFr = vm.createFrogObj('Frog' + ' ' + (vm.frogs.length + 1), 0);
                BettingService.addContestant(vm.raceId, thisFr); }
                else {alert('max of eight contestants reached');}
            } else {alert("Cant add frogs after race has started");}
        }
        else { alert("must register a race by hitting new race before adding frogs"); }
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
                console.log(vm.currentRace, vm.raceId);
                alert('We have a winner ' + vm.frogs[i].name + ' at ' + vm.frogs[i].pos);
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
        //No more bets please the race has started
        _races[raceId].open = false;
    }

    this.getContestants = function (raceId) {
        //just returns the contestants for a specified race
        return _races[raceId].contestants; // an array of contestants for the current race
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
        this.bets = [];                       // was {}
        _races[this.id] = this;
        _raceId++;
    }
}