var countdownClock = { 
    wrapper: '',
    eventDateTime: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
    timer: '',
    refreshRate: 1000 * 60,
    loop: function () {
    	countdownClock.updateClock();
        countdownClock.timer = setTimeout(countdownClock.loop, countdownClock.refreshRate);
    },
    updateClock: function () {
    	// get total seconds between the times
		var delta = Math.abs(countdownClock.eventDateTime - new Date) / 1000;

		// calculate (and subtract) whole days
		countdownClock.days = Math.floor(delta / 86400);
		delta -= countdownClock.days * 86400;

		// calculate (and subtract) whole hours
		countdownClock.hours = Math.floor(delta / 3600) % 24;
		delta -= countdownClock.hours * 3600;

		// calculate (and subtract) whole minutes
		countdownClock.minutes = Math.floor(delta / 60) % 60;
		delta -= countdownClock.minutes * 60;

		// what's left is seconds
		countdownClock.seconds = Math.floor(delta % 60);

    	countdownClock.renderClock();
    },
    renderClock: function(){
    	document.getElementById('days').innerHTML = countdownClock.days;
    	document.getElementById('hours').innerHTML = countdownClock.hours;;
    	document.getElementById('minutes').innerHTML = countdownClock.minutes;;
    },
    init: function (elementId) {
        this.wrapper = document.querySelector(elementId);
        this.eventDateTime = new Date(this.wrapper.dataset.eventDateTime);
        this.loop();
    }
};