var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);
//No need to change anything above this line.

function MainController(BettingService, $timeout) {
    var vm = this; //instead of using this when refering to the controller, let's use vm. It will make things easier.
    vm.frogs = [];
    vm.winnerFlag = 0;
    vm.racing = false;
   vm.currentRace = BettingService.getRace(vm.raceId); 
    vm.newRace = function () {
        //vm.frogs=[];
        vm.raceId = BettingService.registerRace();
    }
    
vm.printRace = function() {
    console.log(vm.currentRace);}
    
    
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
                var thisFr = vm.createFrogObj('Frog' + ' ' + (vm.frogs.length + 1), 0);
                BettingService.addContestant(vm.raceId, thisFr);
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
            if (vm.frogs[i].pos >= 100 && vm.winnerFlag === 0) {
                vm.winnerFlag = 1;
                vm.racing = false;
                //BettingService.closeRace(vm.raceId);
                alert('We have a winner ' + vm.frogs[i].name + ' at ' + vm.frogs[i].pos);
                break;
            }

        }
        if (!vm.winnerFlag && vm.racing) { $timeout(vm.race, 200) };
    }



    vm.joe = new Guy("Joe", 100)
    vm.bob = new Guy("Bob", 150)
    vm.bank = new Guy("Bank", 200);

    vm.reset = function () {
        vm.winnerFlag = 0;
        //console.log('entering reset function');
        for (var i = 0; i < vm.frogs.length; i++) {
            vm.frogs[i].pos = 0;
        }
    }



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
        //Adds a frog to the race object remember to get the race first
        //Also dont let frogs be added after the race has started.
        _races[raceId].contestants.push(contestant);
    }
    
    // this.closeRace = function (raceId) {
    //     //No more bets please the race has started
    //     _races[raceId].open = false;
    // }

    var Race = function () {
        this.id = _raceId;
        this.tickets = 1300;
        this.contestants = [];
        this.open = true;
        this.bets = {};
        _races[this.id] = this;
        _raceId++;
    }
}