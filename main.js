
const g_root = document.getRootNode();
const g_body = document.getElementsByTagName("body")[0];
let g_bodyWidth = Math.floor(getViewportRect().width);
let g_bodyHeight = Math.floor(getViewportRect().height);
const g_paneContainer = document.getElementById("pane-container");
const g_minPaneSize = 36;
let g_spacing = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--spacing'));

function getPaneContainerRect() {
	return g_paneContainer.getBoundingClientRect();
}

function getViewportRect() {
	return { "width": window.innerWidth, "height": window.innerHeight };
}

function getClosestParent(element, parentClassName) {
	for (let i = 0; i < 100; i++) {
		if (!element) return undefined;
		if (element.classList && element.classList.contains(parentClassName)) return element;
		element = element.parentNode;
	}
	console.error("Reached maximum search depth");
	return undefined;
}





let g_currentSash = undefined;

function sashResize(sash, event) {
	let parent = sash.parentNode;
	let direction = parent.getAttribute("dir");
	let prev = sash.previousElementSibling;
	let next = sash.nextElementSibling;
	let prevSize = prev.getBoundingClientRect()[direction == "horizontal" ? "width" : "height"];
	let nextSize = next.getBoundingClientRect()[direction == "horizontal" ? "width" : "height"];
	let prevPos = prev.getBoundingClientRect()[direction == "horizontal" ? "x" : "y"];
	let nextPos = next.getBoundingClientRect()[direction == "horizontal" ? "right" : "bottom"];
	
	let nextAdjustingChildren = [next];
	let nextChildren = next.getElementsByClassName("pane-split");
	for (let i = 0; i < nextChildren.length; i++) {
		let child = nextChildren[i];
		if (child.getAttribute("dir") != direction) continue;
		if (child.getBoundingClientRect()[direction == "horizontal" ? "x" : "y"] !=
			next.getBoundingClientRect()[direction == "horizontal" ? "x" : "y"]) continue;
		let childNodes = child.childNodes;
		let pane = childNodes[1];
		if (!pane.className || !pane.className.includes("pane")) continue;
		nextAdjustingChildren.push(pane);
	}
	let nextResizeMin = next.getBoundingClientRect()[direction == "horizontal" ? "right" : "bottom"];
	for (let i = 0; i < nextAdjustingChildren.length; i++) {
		let nextChild = nextAdjustingChildren[i];
		let nextChildMin = nextChild.getBoundingClientRect()[direction == "horizontal" ? "right" : "bottom"];
		if (nextChildMin < nextResizeMin) nextResizeMin = Math.floor(nextChildMin);
	}

	let prevAdjustingChildren = [prev];
	let prevChildren = prev.getElementsByClassName("pane-split");
	for (let i = 0; i < prevChildren.length; i++) {
		let child = prevChildren[i];
		if (child.getAttribute("dir") != direction) continue;
		if (child.getBoundingClientRect()[direction == "horizontal" ? "right" : "bottom"] !=
			prev.getBoundingClientRect()[direction == "horizontal" ? "right" : "bottom"]) continue;
		let childNodes = child.childNodes;
		let pane = childNodes[childNodes.length - 2];
		if (!pane.className || !pane.className.includes("pane")) continue;
		prevAdjustingChildren.push(pane);
	}
	let prevResizeMax = 0;
	for (let i = 0; i < prevAdjustingChildren.length; i++) {
		let prevChild = prevAdjustingChildren[i];
		let prevChildMax = prevChild.getBoundingClientRect()[direction == "horizontal" ? "x" : "y"];
		if (prevChildMax > prevResizeMax) prevResizeMax = Math.floor(prevChildMax);
	}
	
	let mousePos = event[direction == "horizontal" ? "clientX" : "clientY"] - g_spacing / 2 + 1;
	nextResizeMin -= g_minPaneSize + g_spacing;
	prevResizeMax += g_minPaneSize;
	if (mousePos > nextResizeMin) mousePos = nextResizeMin;
	if (mousePos < prevResizeMax) mousePos = prevResizeMax;

	let styleChanges = [];
	for (let i = 0; i < prevAdjustingChildren.length; i++) {
		let child = prevAdjustingChildren[i];
		let pos = child.getBoundingClientRect()[direction == "horizontal" ? "x" : "y"];
		let size = Math.floor(mousePos - pos);
		styleChanges.push({node: child, style: size + "px"});
	}
	for (let i = 0; i < nextAdjustingChildren.length; i++) {
		let child = nextAdjustingChildren[i];
		let pos = child.getBoundingClientRect()[direction == "horizontal" ? "right" : "bottom"];
		let size = Math.floor(pos - mousePos - g_spacing);
		styleChanges.push({node: child, style: size + "px"});
	}
	styleChanges.forEach((styleChange) => {
		styleChange.node.style.setProperty("--size", styleChange.style);
	});
	
	//prev.style.setProperty("--size", prevSize + "px");
	//next.style.setProperty("--size", nextSize + "px");
}

function setSashEventHandler(sash) {
	sash.addEventListener("mousedown", (event) => {
		if (!sash.contains(event.target)) return;
		if (g_currentSash) {
			alert("How are you clicking on a new sash while there is already one active?");
		}
		if (sash != event.target) {
			alert("Why?");
		}
		g_currentSash = event.target;
	});
}

function setAllSashEventHandlers() {
	sashes = document.getElementsByClassName("pane-sash");
	for (let i = 0; i < sashes.length; i++) {
		let sash = sashes[i];
		setSashEventHandler(sash);
	}

	window.addEventListener("mouseup", (event) => {
		g_currentSash = undefined;
	});

	document.addEventListener("mousemove", (event) => {
		if (!g_currentSash) return;
		sashResize(g_currentSash, event);
	});
}



function resizeScalePanes(scaleX, scaleY) {
	let panes = document.getElementsByClassName("pane");
	let paneSplits = document.getElementsByClassName("pane-split");
	for (let i = 0; i < panes.length; i++) {
		let pane = panes[i];
		let size = getComputedStyle(pane).getPropertyValue("--size");
		if (!size) continue;
		size = parseInt(size);
		let dir = pane.parentNode.getAttribute("dir");
		size *= (dir == "horizontal") ? scaleX : scaleY;
		size = Math.round(size);
		if (size < g_minPaneSize) size = g_minPaneSize;
		pane.style.setProperty("--size", size + "px");
	}
	for (let i = 0; i < paneSplits.length; i++) {
		let pane = paneSplits[i];
		let size = getComputedStyle(pane).getPropertyValue("--size");
		if (!size) continue;
		size = parseInt(size);
		let dir = pane.getAttribute("dir");
		size *= (dir == "vertical") ? scaleX : scaleY;
		size = Math.round(size);
		let childPaneCount = (pane.children.length - 1) / 2 + 1;
		size = Math.max(size, g_minPaneSize * childPaneCount + g_spacing * (childPaneCount - 1));
		pane.style.setProperty("--size", size + "px");
	}
}





let g_bodyResizeX = 0;
let g_bodyResizeY = 0;
let g_bodyResizeMulX = 1;
let g_bodyResizeMulY = 1;
window.onresize = function() {
	let windowSize = getViewportRect();
	g_bodyResizeX = Math.floor(windowSize.width) - g_bodyWidth;
	g_bodyResizeY = Math.floor(windowSize.height) - g_bodyHeight;
	g_bodyResizeMulX = Math.floor(windowSize.width) / g_bodyWidth;
	g_bodyResizeMulY = Math.floor(windowSize.height) / g_bodyHeight;
	g_bodyWidth = Math.floor(windowSize.width);
	g_bodyHeight = Math.floor(windowSize.height);
	g_body.style.width = g_bodyWidth + "px";
	g_body.style.height = g_bodyHeight + "px";
	//console.log(windowSize.width + "px");
	resizeScalePanes(g_bodyResizeMulX, g_bodyResizeMulY);
}





let g_currentMenubar = undefined;
let g_currentMenu = undefined;

function getMenuFromButton(button) {
	if (button == undefined) return undefined;
	let menu = button.children;
	for (let i = 0; i < menu.length; i++) {
		if (menu[i].className == "menu") {
			return menu[i];
		}
	}
	alert("Oh no");
	return undefined;
}

function activateMenu(menu) {
	let button = menu.parentNode;
	menu.setAttribute("active", "true");
	let buttonPosX = button.getBoundingClientRect().x;
	let buttonPosY = button.getBoundingClientRect().bottom;
	menu.style.setProperty("left", buttonPosX + "px");
	menu.style.setProperty("top", buttonPosY + "px");
}

function setMenubarEventHandler(menubar) {
	menubar.addEventListener("mousedown", (event) => {
		if (g_currentMenu && g_currentMenu.contains(event.target)) {
			// Clicked inside menu
			return;
		}
		if (g_currentMenubar) {
			// Deactivate old menubar
			if (g_currentMenu)
				g_currentMenu.removeAttribute("active");
			g_currentMenu = undefined;
			g_currentMenubar = undefined;
			return;
		}
		g_currentMenubar = menubar;
		g_currentMenu = getMenuFromButton(getClosestParent(event.target, "menu-button"));
		activateMenu(g_currentMenu);
	});

	menubar.addEventListener("mouseover", (event) => {
		if (menubar != g_currentMenubar) return;
		let newMenu = getMenuFromButton(getClosestParent(event.target, "menu-button"));
		if (!newMenu) return;
		g_currentMenu.removeAttribute("active");
		g_currentMenu = newMenu;
		activateMenu(g_currentMenu);
	});
}

function setAllMenubarEventHandlers() {
	window.addEventListener("mousedown", (event) => {
		if (g_currentMenubar && g_currentMenubar.contains(event.target))
			return;
		g_currentMenubar = undefined;
		if (g_currentMenu)
			g_currentMenu.removeAttribute("active");
		g_currentMenu = undefined;
	});

	menubars = document.getElementsByClassName("menubar");
	for (let i = 0; i < menubars.length; i++) {
		let menubar = menubars[i];
		setMenubarEventHandler(menubar);
	}
}
