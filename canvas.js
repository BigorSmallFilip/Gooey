
const backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--col-panel');

const canvasTest1 = document.getElementById("canvas-test1");
const ctx1 = canvasTest1.getContext("2d", { alpha: false, willReadFrequently: true });
const canvasTest2 = document.getElementById("canvas-test2");
const ctx2 = canvasTest2.getContext("2d", { alpha: false, willReadFrequently: true });

function canvasRender(ctx) {
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	//ctx.translate(0.5, 0.5);

	for (let i = 0; i < 30; i++) {
		ctx.strokeStyle = "rgb(" + (Math.random() * 255) + " " + (Math.random() * 255) + " " + (Math.random() * 255) + ")";
		ctx.lineWidth = 1;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
		ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
		ctx.stroke();
	}
}

new ResizeObserver(() => {
	ctx2.canvas.width = canvasTest2.parentNode.clientWidth;
	ctx2.canvas.height = canvasTest2.parentNode.clientHeight - 36;
	canvasRender(ctx2);
}).observe(canvasTest2.parentNode);



function frameLoop() {
	requestAnimationFrame(frameLoop);

	canvasRender(ctx1);
	canvasRender(ctx2);
}

frameLoop();
