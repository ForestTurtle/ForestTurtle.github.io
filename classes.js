class Card {
	constructor(color, number){
		this.color = color;
		this.number = number;
	}
}

class HitArea {
	constructor(x, y, w, h, action){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.action = action;
	}
}

class DynamicDrawable {
	constructor(draw){
		this.draw = draw;
	}
}

class User {
	constructor(name){
		this.name = name;
	}
}