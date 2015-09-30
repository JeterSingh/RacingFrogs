var app = angular.module('racingFrogs', []);
app.controller('MainController', MainController);
//No need to change anything above this line.

function MainController() {
    var vm = this; //instead of using this when refering to the controller, let's use vm. It will make things easier.
    vm.frogs = [];
    function Frog(name, posx) {
        var thisFrog = {
            name: name,
            pos: posx
        };
        vm.frogs.push(thisFrog);
    }
    vm.jimmy = new Frog('Jimmy', 0);
    vm.peter = new Frog('Peter', 0);
    vm.peter = new Frog('Hulk', 0);
    vm.tomtom = new Frog('TomTom', 0);
    //console.log(vm.frogs);
    vm.winnerFlag = 0;
    vm.race = function () {
        //console.log('inside race function');
        
        for (var i = 0; i < vm.frogs.length; i++) {
            var randomStep = Math.floor((Math.random() * 1000) + 1);
            var currentPos = vm.frogs[i].pos;
            var newPos = currentPos + randomStep / 100;

            vm.frogs[i].pos = Math.min(newPos, 100);
            console.log(vm.frogs[i].name, vm.frogs[i].pos);
            if (vm.frogs[i].pos >= 100 && vm.winnerFlag === 0) {
                console.log('winner flag is ' + vm.winnerFlag);
                vm.winnerFlag = 1;
                alert('We have a winner ' + vm.frogs[i].name + ' at ' + vm.frogs[i].pos);

            }
        }
        //if (vm.winnerFlag === 0) {vm.race();}
    }
    vm.joe = new Guy("Joe", 100)
    vm.bob = new Guy("Bob", 150)
    vm.bank = new Guy("Bank", 200);

    vm.reset = function () {
        //console.log('inside race function');
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