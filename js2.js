var field = document.querySelector("#field");
var ScoreBoard = document.querySelector("#score");

var cells = [];
var feed = [];
var direction = 'stop';
var commandBuffer = [];
var record = 0;
var score = 0;
var prTimer;
var speed = 90;
var borderType = true; //true -transparent, false - non-transparent


function startGame(){
	field.width = 28;
	field.height = 20;
	direction = 'stop';
	score = 0;
	cells = [];
	feed = [];
	commandBuffer = [];
	score = 0;
	cells.push(createElement('cell'));
	feed.push(createElement('food'));
	prTimer = setInterval(process,speed);
}

var process = function (){

	if (commandBuffer.length > 0 )
		if(	direction == 'left' && commandBuffer[0] == 'right' ||
			direction == 'right' && commandBuffer[0] == 'left' ||
			direction == 'up' && commandBuffer[0] == 'down' ||
			direction == 'down' && commandBuffer[0] == 'up') commandBuffer.shift();
		else	direction = commandBuffer.shift();
	
	if(direction!='stop')
		for(var i=cells.length-1;i>0;i--){
			cells[i].x = cells[i-1].x;
			cells[i].y = cells[i-1].y;
		}
	switch(direction){
		case 'left': 
			cells[0].x--;
			break;
		case 'right': 
			cells[0].x++;
			break;
		case 'up': 
			cells[0].y--;
			break;
		case 'down': 
			cells[0].y++;
			break;
	}


	if(cells[0].x < 0)	
		if(!borderType) GameOver(cells[0]);
		else cells[0].x = field.width - 1;
	if(cells[0].y < 0)
		if(!borderType) GameOver();	
		else cells[0].y = field.height - 1;
	if(cells[0].x > field.width - 1)
		if(!borderType) GameOver(); 
		else cells[0].x = 0;
	if(cells[0].y > field.height - 1)
		if(!borderType) GameOver(); 
		else cells[0].y = 0;

	// проверка и действия при съедании еды
	for(var i=0;i<feed.length;i++)
		if(feed[i].x == cells[0].x &&feed[i].y == cells[0].y)
			{	
				cells.push(createElement('cell', feed[i].x, feed[i].y));
				field.removeChild(feed[i]);
				feed.splice(i,1);
				if(score == field.width*field.height) GameOver();
				var newFood = createElement('food');
				var flag = true;
				while(flag){
					flag = false;
					for(var j = 0 ; j < cells.length;j++)
						if(intersects(newFood,cells[j])){
							flag = true;
							newFood.x = Math.floor(Math.random()*field.width);
							newFood.y = Math.floor(Math.random()*field.height);
							break;
						}
				}
				feed.push(newFood);
				score++;
			}

	// проверка на самопересечение
	for(var i = 1 ; i < cells.length;i++)
		if(intersects(cells[0],cells[i]))
				GameOver(cells[i]);
			
	updateField();
}

function GameOver(obj){
	console.log('GameOver');
	record = (score>record)?score:record;
	clearInterval(prTimer);
	if(obj != undefined)
	obj.style.background= '#c00';
}

function createElement(_className,x,y){
	var node = document.createElement("div");
	node.className = _className;

	if(isNaN(x))
		node.x = Math.floor(Math.random()*field.width);
	if(isNaN(y))
		node.y = Math.floor(Math.random()*field.height);

	field.appendChild(node);
	return node;
}

function updateField(){
	for(var i=0;i<cells.length;i++)
		draw(cells[i]);

	for(var i=0;i<feed.length;i++)
		draw(feed[i]);

	ScoreBoard.innerHTML = score;


}

function draw(obj){
	// Функция обновляет стиль объекта (рисует объект)
	var l = obj.x * obj.offsetWidth;
	var t = obj.y * obj.offsetHeight;
	obj.style.left = l + 'px';
	obj.style.top = t + 'px';
}

function intersects(obj1,obj2){
	if(obj1.x == obj2.x && obj1.y==obj2.y)
		return true;
	else return false;
}

startGame();

addEventListener("keydown",function(e){
	// console.log(e.keyCode);
	if(commandBuffer.length > 2) return;
	if(e.keyCode==37||e.keyCode==65) commandBuffer.push('left');
	if(e.keyCode==38||e.keyCode==87) commandBuffer.push('up');
	if(e.keyCode==39||e.keyCode==68) commandBuffer.push('right');
	if(e.keyCode==40||e.keyCode==83) commandBuffer.push('down');
	if(e.keyCode==32) commandBuffer.push('stop');
	if(e.keyCode==82) {
		GameOver();
		for(var i=0;i<cells.length;i++)
			field.removeChild(cells[i]);
		for(var i=0;i<feed.length;i++)
			field.removeChild(feed[i]);
		startGame();}
})

document.querySelector('#transparent').addEventListener("click",function(e){
		borderType = !borderType;
		if(borderType)
			this.innerHTML = "transparent";
		else this.innerHTML = "non-transparent";
})

document.querySelector('#start').addEventListener("click",function(e){
	GameOver();
		for(var i=0;i<cells.length;i++)
			field.removeChild(cells[i]);
		for(var i=0;i<feed.length;i++)
			field.removeChild(feed[i]);
	startGame();
})

document.querySelector("#stop").addEventListener("click",function(e){
	direction = 'stop';
})

document.querySelector("#hard").addEventListener("click",function(e){
	document.querySelector("#normal").style.background = "rgba(0,0,0,0.05)";
	document.querySelector("#easy").style.background = "rgba(0,0,0,0.05)";
	this.style.background = "rgba(0,100,0,0.1)";

	speed = 70;
})

document.querySelector("#normal").addEventListener("click",function(e){
	document.querySelector("#hard").style.background = "rgba(0,0,0,0.05)";
	document.querySelector("#easy").style.background = "rgba(0,0,0,0.05)";
	this.style.background = "rgba(0,100,0,0.1)";

	speed = 90;
})

document.querySelector("#easy").addEventListener("click",function(e){
	document.querySelector("#hard").style.background = "rgba(0,0,0,0.05)";
	document.querySelector("#normal").style.background = "rgba(0,0,0,0.05)";
	this.style.background = "rgba(0,100,0,0.1)";

	speed = 140;
})

