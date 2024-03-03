const canvas = document.getElementsByTagName('canvas')[0];
const [width, height] = [window.innerWidth, window.innerHeight - 4];
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

let mouseX = mouseY = prevX = prevY = 0;
let isMouseDown = false;
let circles = [];
let delaySum = 0;
let prevTime = getTime();
let frame = 0;
let clicks = 0;
let rcps = 0;
let cps = 0;

/*const cpsWin = new cheatgui.Window({
	title: "Settings",
	x: 10,
	y: 10,
	collapsed: true
});*/

function getTime() {
	return performance.now();
}

/*document.addEventListener('pointermove', e => {
	e.preventDefault();
	if (e.touches) e = e.touches[0];
	[prevX, prevY, mouseX, mouseY] = [mouseX, mouseY, e.clientX, e.clientY];
});*/

document.addEventListener('pointerdown', e => {
	if (e.touches) e = e.touches[0];
	[prevX, prevY] = [mouseX, mouseY];
	[mouseX, mouseY] = [e.clientX, e.clientY];
	circles.push({ x: mouseX, y: mouseY, life: 100 });
	isMouseDown = true;
	clicks++;
	const t = getTime();
	delaySum += t - prevTime;
	prevTime = t;
	for (let i = 0; i < history.length - 1; i++) {
		history[i] = history[i + 1];
	}
	history[10] = {
		x: mouseX,
		y: mouseY,
		time: getTime()
	};
});

document.addEventListener('pointerup', e => {
	if (e.touches) e = e.touches[0];
	[mouseX, mouseY] = [e.clientX, e.clientY];
	isMouseDown = false;
});

ctx.strokeStyle = '#fff';
ctx.lineWidth = 1;

function tick() {
	ctx.clearRect(0, 0, width, height);

	ctx.globalAlpha = 1;
	cps = (1000 / (delaySum / clicks) || rcps).toFixed(2);

	ctx.font = '25px Arial';
	ctx.fillStyle = '#fff';
	const m = ctx.measureText(cps + " CPS");
	ctx.fillText(cps + ' CPS', width / 2 - m.width / 2, height / 2 + m.hangingBaseline / 2);
	
	ctx.font = '15px Arial';
	const lines = [
		'CPS: ' + cps,
		'Real CPS: ' + rcps,
		'Average Delay: ' + (Math.round(delaySum / clicks) || '0') + 'ms'
	];
	const h = Math.round(ctx.measureText('A').hangingBaseline);
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], 10, 10 + ((h + 5) * (i + 1)));
	}

	ctx.strokeStyle = `hsl(${frame % 360}deg 50% 50%)`;
	for (let i = 0; i < circles.length; i++) {
		const circle = circles[i];
		ctx.globalAlpha = circle.life / 100;
		ctx.beginPath();
		ctx.arc(circle.x, circle.y, Math.round(100 - circle.life), 0, Math.PI * 2, false);
		ctx.stroke();
		circles[i].life -= 2.3;
		if (circles[i].life <= 0) circles.splice(i, 1);
	}

	frame = requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

setInterval(() => {
	rcps = clicks;
	cps = rcps;
	clicks = 0;
	delaySum = 0;
}, 1000);