(function () {

	const todoListDOM = document.getElementById('todoList');

	function renderTodoList(todoList) {
      const html = todoList.map((item, index) => `<li class="list">
              <a class="${item.isComplete ? 'finish' : 'unfinish'}" data-id=${item.id}></a>
              <p class="desc" data-id=${item.id}>
                  ${item.desc}
              </p>
              <a class="del" data-id=${item.id}></a>
          </li>`).join('')
      todoListDOM.innerHTML = html;
  }

	let todoList = [];

	fetch('http://localhost:3000/todolist')
	.then(res => res.json())
	.then(json => {
			todoList = todoList.concat(json);
			renderTodoList(todoList);
	})
	.catch(err => {
			console.log(err);
	})
	// -----------------------------新增待辦事項-----------------------------
	// 1) 抓取需要的 DOM 物件(input)
	const todoInputDOM = document.getElementById('todoInput');

	// 2) 監聽 input 的 keydown(enter) 事件
	todoInputDOM.addEventListener('keydown', event => {
	    if (event.keyCode === 13 && event.target.value) { // keyCode 13 = keydown
	        // 在這裡新增待辦項目...
	        event.target.value = '';
	    }
	});

	// 3) 建立待辦項目的方法
	const newItem = value => ({ desc: value, isComplete: false});
	// 補充：
	// const newItem = value => { return {name: value, isComplete: false} };
	// 可以簡化為：
	// const newItem = value => ({ desc: value, isComplete: false});


	// 4) 建立新增待辦事項的方法（POST）
	/* http://localhost:3000/todolist/${id}
	 * 建立一個函式，名稱為 addItem，我們傳入待辦事項的物件，
	 * 之後藉由 fetch 發送 POST request，新增資料到後端。
	 */
	const addItem = item => {
			fetch('http://localhost:3000/todolist', {
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
	// 在資料成功返回後，我們就將待辦事項的物件加到 todoList 裡，並繪製畫面。

	// -----------------------------修改待辦事項清單-----------------------------
	// 5) 抓取需要的 DOM 物件(ul#todoList)
	const todoListDOM = document.getElementById('todoList');

	// 6) 監聽 ul#todoList 的 click 事件
	todoListDOM.addEventListener('click', event => {
	    const currentTarget = event.target;

	    if (currentTarget && (currentTarget.matches('a.unfinished') || currentTarget.matches('a.finish') || currentTarget.matches('.desc'))) {
	        // 點擊待辦事項內的項目icon及項目文字，執行修改待辦事項的方法
	        toggleItem(parseInt(currentTarget.dataset.id, 10))
	    }
	});
	/* toggleItem 為修改待辦事項的方法，會傳入當前修改的 id後透過，
	 * 會傳入當前修改的 id後透過 Array.prototype.find() 去找到當前選擇項目，
	 * 再去切換待辦事項裡『已完成』和『未完成』的狀態，最後發出 HTTP Request(PUT)傳送修改內容。
	 */
	const toggleItem = id => {
			const currentSelectItem = todoList.find(item => item.id === id);
			// 切換『已完成』和『未完成』狀態
			currentSelectItem.isComplete = !currentSelectItem.isComplete;
			fetch(`http://localhost:3000/todolist/${id}`, {
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

	// -----------------------------刪除待辦事項-----------------------------
	// 7) 抓取需要的 DOM 物件(ul#todoList)
	const todoListDOM = document.getElementById('todoList');

	// 8) 監聽 ul#todoList 的 click 事件
	todoListDOM.addEventListener('click', event => {
	    const currentTarget = event.target;
	    if (currentTarget && (currentTarget.matches('a.unfinished') || currentTarget.matches('a.finish') || currentTarget.matches('.desc'))) {
			    // 點擊待辦事項內項目icon及項目文字，執行修改待辦事項的方法
	        toggleItem(parseInt(currentTarget.dataset.id, 10))
	    } else if (currentTarget && currentTarget.matches('a.del')) {
	        // 點擊待辦事項內的刪除 icon，觸發刪除待辦事項的行為
	        removeItem(parseInt(currentTarget.dataset.id, 10))
	    }
	});
	/* 之前有判斷過修改區塊包括項目 icon (.finish 跟 .unfinished) 及項目文字 (.desc)，
	 * 這次再加上刪除按鈕（a.del）。
	 */

	// removeItem 為刪除待辦事項的方法，會傳入當前修改的 id後，發出 HTTP Request(DELETE)。
	const removeItem = id => {
	    fetch(`http://localhost:3000/todolist/${id}`, {
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

	// 最後再透過 render(todoList); 更新畫面
	function render (todoList) {
	    renderTodoList(todoList);
	}

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

}(window, document))
