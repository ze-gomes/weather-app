let input = document.querySelector('.input-effect');
let inputLoc = document.getElementById('loc-input');
let labelLoc = document.getElementById('loc-label');

input.addEventListener('focusin', (e) => {
	console.log('focus Effect');
	if (inputLoc.value != '') {
		labelLoc.style.visibility = 'visible';
		input.classList.add('has-content');
	} else {
		labelLoc.style.visibility = 'visible';
		input.classList.remove('has-content');
	}
});

input.addEventListener('focusout', (e) => {
	console.log(inputLoc.value);
	if (inputLoc.value != '') {
		labelLoc.style.visibility = 'hidden';
	} else {
		labelLoc.style.visibility = 'visible';
	}
});

inputLoc.addEventListener(
	'keydown',
	function (e) {
		if (!e) {
			var e = window.event;
		}
		e.preventDefault();
		// Enter is pressed
		if (e.code == 'Enter') {
			submitFunction();
		}
	},
	false
);


const response = fetch()