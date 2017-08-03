(function () {

	const todoListDOM = document.getElementById('todoList');

	let todoList = [];

	// -----------------------------更新畫面-----------------------------

	function renderTodoList (todoList) {
			const html = todoList.map((item, index) => `<li class="list">
							<a class="${item.isComplete ? 'finish' : 'unfinished'}" data-id=${item.id}></a>
							<p class="desc" data-id=${item.id}>
									${item.desc}
							</p>
							<a class="del" data-id=${item.id}></a>
					</li>`).join('')
			todoListDOM.innerHTML = html;
	}

	// -----------------------------首次同步-----------------------------

	fetch('https://kelly-pwa-api.herokuapp.com/todolist')
	.then(res => res.json())
	.then(json => {
			todoList = todoList.concat(json);
			render(todoList);
	})
	.catch(err => {
			console.log(err);
	})

	// -----------------------------新增待辦事項-----------------------------

	const todoInputDOM = document.getElementById('todoInput');

	todoInputDOM.addEventListener('keydown', event => {
	    if (event.keyCode === 13 && event.target.value) { // keyCode 13 = keydown
					addItem(newItem(event.target.value));
	        event.target.value = '';
	    }
	});

	const newItem = value => ({ desc: value, isComplete: false});

	const addItem = item => {
			fetch('https://kelly-pwa-api.herokuapp.com/todolist', {
					method: 'POST',
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify(item)
			})
			.then(res => res.json())
			.then(json => {
					todoList.push(json);
					render(todoList);
			})
	}

	// -----------------------------修改待辦事項清單-----------------------------

	const toggleItem = id => {
			const currentSelectItem = todoList.find(item => item.id === id);
			currentSelectItem.isComplete = !currentSelectItem.isComplete;
			fetch(`https://kelly-pwa-api.herokuapp.com/todolist/${id}`, {
					method: 'PUT',
					headers: {
							'Content-Type': 'application/json'
					},
					body: JSON.stringify(currentSelectItem)
			})
			.then(res => res.json())
			.then(json => {
					render(todoList);
			})
	}

	// -------------------------------刪除待辦事項-------------------------------

	const removeItem = id => {
	    fetch(`https://kelly-pwa-api.herokuapp.com/todolist/${id}`, {
	        method: 'DELETE',
	        headers: {
	            'Content-Type': 'application/json'
	        }
	    })
	    .then(res => res.json())
	    .then(json => {
	        todoList = todoList.filter(item => item.id !== id);
	        render(todoList);
	    })
	}

	// ----------------------------監聽 todoListDOM----------------------------

	todoListDOM.addEventListener('click', event => {
			const currentTarget = event.target;
			if (currentTarget && (currentTarget.matches('a.unfinished') || currentTarget.matches('a.finish') || currentTarget.matches('.desc'))) {
					toggleItem(parseInt(currentTarget.dataset.id, 10))
			} else if (currentTarget && currentTarget.matches('a.del')) {
					removeItem(parseInt(currentTarget.dataset.id, 10))
			}
	});

	// ---------------------透過 render(todoList); 更新畫面---------------------

	function render (todoList) {
			renderTodoList(todoList);
	}

}(window, document))
