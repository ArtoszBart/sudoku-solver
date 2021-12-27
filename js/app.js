const puzzleBoard = document.querySelector('#puzzle');
const solveBtn = document.querySelector('#solve-btn');
const solutionInfoDisplay = document.querySelector('#solution-info');
const fieldsNo = 81;

for (let i = 0; i < fieldsNo; i++) {
	const inputElement = document.createElement('input');
	inputElement.setAttribute('type', 'number');
	inputElement.setAttribute('min', '1');
	inputElement.setAttribute('max', '9');
	if (
		((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
		((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
		((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && (i > 27 && i < 53)) ||
		((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
		((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
	) {
		inputElement.classList.add('odd-section');
	}
	puzzleBoard.appendChild(inputElement);
}

function joinValues() {
	const submission = [];
	const fields = document.querySelectorAll('input');
	fields.forEach(field => {
		if (field.value) {
			submission.push(field.value);
		} else {
			submission.push('.');
		}
	});
	return submission.join('');
}

function populateValues(isSolvable, solution) {
	const inputs = document.querySelectorAll('input');
	solutionInfoDisplay.classList.value = '';
	if (!isSolvable) {
		solutionInfoDisplay.innerHTML = 'This is not solvable!';
		solutionInfoDisplay.classList.add('unsolvable');
	} else if (!solution) {
		solutionInfoDisplay.innerHTML = 'Unknown error occured.';
		solutionInfoDisplay.classList.add('error');
	} else {
		inputs.forEach((input, i) => {
			input.value = solution[i];
		});
		solutionInfoDisplay.innerHTML = 'Solved!'
		solutionInfoDisplay.classList.add('solved');
	}
}

function solve() {
	const data = joinValues();
	console.log('data', data);
	var options = {
		method: 'POST',
		url: 'https://solve-sudoku.p.rapidapi.com/',
		headers: {
			'content-type': 'application/json',
			'x-rapidapi-host': 'solve-sudoku.p.rapidapi.com',
			'x-rapidapi-key': process.env.RAPID_API_KEY
		},
		data: {
			puzzle: data
		}
	};

	axios.request(options).then(response => {
		console.log(response.data);
		populateValues(response.data.solvable, response.data.solution);
	}).catch(err => {
		console.error(err);
	});
}

solveBtn.addEventListener('click', solve);