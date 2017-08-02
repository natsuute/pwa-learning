// 1) 新增立即函式，放 To-Do List 的邏輯
(function () {
	// 3) 抓取會用到的 DOM 物件
	const todoListDOM = document.getElementById('todoList');

	// 4) 建立 render 函式
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
	// 預期 todoList 的資料會長像這樣
	// [
	//     {
	//          "isComplete": false,
	//          "desc": "..."
	//     },
	//     ...
	// ]

	// 5) 透過 AJAX 抓取後端資料，並 render
	let todoList = [];
	// 取得待辦事項清單（GET）
	fetch('http://localhost:3000/todolist')
	.then(res => res.json())
	.then(json => {
			todoList = todoList.concat(json);
			renderTodoList(todoList); // render todoList
	})
	.catch(err => {
			console.log(err);
	})
	// 拿到待辦事項資料之後，再抓取 todoList 的 DOM，將資料塞入 list 裡面。

}(window, document)) // 2) 傳入 window 和 document
