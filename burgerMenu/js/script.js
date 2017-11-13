/**
 * Burger Menu 1.0
 * A Remi A Olsen Production :D
 * remi@remiolsen.info / https://remiolsen.info
 * 
 * This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
 * https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

var burgerMenu = {
	ieVersion: 0,
	allowMultipleMenus: false,

	// Creates a unique ID.
	createID: function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},

	// Generic multiple attribute setter.
	setAttributes: function (element, attributes) {
		if(attributes) {
			for (var a in attributes) {
				element.setAttribute(a, attributes[a]);
			}
		}
	},

	// Loops through all expanded menus and closes them.
	closeAllMenus: function (ignoreID) {
		var displayMenus = document.querySelectorAll('.burgerMenu[aria-expanded=true]');
		for (var i = 0; i < displayMenus.length; i++) {
			var displayMenu = displayMenus[i],
				navButton = document.getElementById(displayMenu.getAttribute('aria-labelledby')),
				buttonClass = navButton.className.replace(/ bActive/, ' bInactive');
			if (displayMenu.getAttribute('id') !== ignoreID) {
				this.setAttributes(displayMenu, { 'aria-expanded': 'false', 'aria-hidden': 'true', 'class': 'burgerMenu burgerMenuInactive' });
				navButton.className = buttonClass;
				if (this.ieVersion === 9) {
					var ieStyle = displayMenu.getAttribute('style') + ' display: none;';
					displayMenu.setAttribute('style', ieStyle);
				}
			}
		}
	},

	/**
	 * Fold an unfold menu. 
	 * @navButton: Button that opens and closes menu.
	 */
	displayMenu: function (navButton, m) {
		if (this.allowMultipleMenus === false) {
			var ignoreID = m.querySelector('.burgerMenu').getAttribute('id');
			this.closeAllMenus(ignoreID);
		}
		var displayMenu = m.querySelector('.burgerMenu'),
			buttonClass = navButton.className;
		displayMenu.className = displayMenu.className.indexOf('burgerMenuInactive') > -1 ? 'burgerMenu' : 'burgerMenu burgerMenuInactive';
		if (displayMenu.getAttribute('aria-expanded') === 'true') {
			this.setAttributes(displayMenu, { 'aria-expanded': 'false', 'aria-hidden': 'true', 'class': 'burgerMenu burgerMenuInactive' });
			buttonClass = buttonClass.replace(/ bActive/, '') + ' bInactive';
		} else {
			this.setAttributes(displayMenu, { 'aria-expanded': 'true', 'aria-hidden': 'false', 'class': 'burgerMenu' });
			buttonClass = buttonClass.replace(/ bInactive/, '') + ' bActive';;
		}
		if (this.ieVersion === 9) {
			var ieStyle;
			if (displayMenu.className.indexOf('burgerMenuInactive') > -1) {
				ieStyle = displayMenu.getAttribute('style') + ' display: none;';
			} else {
				ieStyle = displayMenu.getAttribute('style') + ' display: block;';
			}
			displayMenu.setAttribute('style', ieStyle);
		}
		navButton.className = buttonClass;
	},

	/**
	 * Creates the nav button that opens and closes the menu. 
	 * @m: Menu.
	 * @buttonID: ID of button that will open the menu.
	 * @buttonTitle: Text that will be used to label the button.
	 */
	setNavButton: function (m, buttonID, buttonTitle) {
		var navButton = document.createElement('button'),
			t = this,
			buttonClass = 'bButton';
		this.setAttributes(navButton, { 'id': buttonID, 'aria-haspopout': 'true' });
		navButton.className = buttonClass;
		navButton.innerHTML = '<span class="bButtonBurger">' + buttonTitle + '</span>';
		navButton.addEventListener('click', function (e) { e.preventDefault(); t.displayMenu(navButton, m); }, true);
		m.insertBefore(navButton, m.firstChild);
		return m;
	},

	/**
	 * Adds "burgerMenuChild" class name to every child item. Used for listeners; in this script
	 * it ensures the menu will not close when a child element is clicked or focused on.
	 * @p: Parent item.
	 */
	setMenuItemClasses: function(p) {
		if(p.childNodes.length > 0) {
			for(var i = 0; i < p.childNodes.length; i++) {
				var item = p.childNodes[i];
				item.className += ' burgerMenuChild';
				if(item.childNodes.length > 0) {
					this.setMenuItemClasses(item);
				}
			}
		}
	},
	
	/**
	 * Adds the proper menu and menu item attributes to make sure everything is ARIA compliant.
	 * @m: Menu.
	 * @buttonID: ID of button that will open the menu.
	 */
	setMenuItemAttributes: function (m, buttonID) {
		var listItems = m.querySelectorAll('li');
		for(var i = 0; i < listItems.length; i++) {
			var l = listItems[i],
				links = l.querySelectorAll('a');
			this.setAttributes(l, { 'class': 'burgerMenuItem', 'role': 'presentation' });
			for (var j = 0; j < links.length; j++) {
				this.setAttributes(links[j], { 'role': 'menuitem', 'class': 'burgerMenuLink' });
			}
		}
		m.setAttribute('aria-labelledby', buttonID);
		m.removeAttribute('title');
		this.setMenuItemClasses(m);
		return m;
	},

	/**
	 * Creates the menu container, and sets the menu as a child of it. 
	 * @m: Menu.
	 */
	createMenu: function (m, isWhite) {
		var holderElement = document.createElement('div'),
			buttonID = this.createID(),
			buttonTitle = m.getAttribute('title'),
			textButton = m.className.indexOf('burgerMenuText') > -1 ? 1 : 0;
		m = this.setMenuItemAttributes(m, buttonID);
		holderElement.className = 'burgerMenuHolder';
		if(isWhite) {
			holderElement.className += ' burgerMenuHolderWhite';	
		}
		this.setAttributes(holderElement, { 'role': 'navigation' });
		holderElement.appendChild(m);
		holderElement = this.setNavButton(holderElement, buttonID, buttonTitle, textButton);
		return holderElement;
	},

	/**
	 * Changes transformation for menus that would horizontally go off-screen. 
	 * @m: Menu.
	 */
	repositionMenu: function (m) {
		var positions = m.getBoundingClientRect(),
			windowWidth = window.innerWidth,
			menuWidth = m.offsetWidth,
			checkWidth = this.ieVersion > 0 ? ((menuWidth + 100) / 2) : (menuWidth / 2),
			checkRightWidth = checkWidth + positions.left,
			checkLeftWidth = positions.left - checkWidth;
		if (checkLeftWidth < 10) {
			this.setAttributes(m, { 'style': 'margin-left: 0; transform-origin: top left; display: inline-block;' });
		} else if (checkRightWidth > (windowWidth - 10)) {
			this.setAttributes(m, { 'style': 'margin-left: -' + menuWidth + 'px; transform-origin: top right; display: inline-block;' });
		}
		if (this.ieVersion === 9) {
			var ieStyle = m.getAttribute('style') + ' display: none;';
			m.setAttribute('style', ieStyle);
		}
		return m;
	},

	// Close all menus when escape key is clicked.
	keyboardNavigation: function (e) {
		if (e.keyCode === 27) {
			this.closeAllMenus();
		}
	},

	// Close all menus when anything in window (minus burgerMenu elements) is clicked. 
	windowClick: function (e) {
		var parentElement = e.target.parentNode.className ? e.target.parentNode.className : '';
		if ((parentElement.indexOf('burgerMenuHolder') === -1 && parentElement.indexOf('bButton ') === -1) &&  (e.target.className.indexOf('burgerMenuChild') === -1) ) {
			this.closeAllMenus();
		}
	},
	
	// Checks if browser is IE.
	checkIE: function () {
		if (navigator.userAgent.indexOf('MSIE 9') > -1) {
			this.ieVersion = 9;
		} else if (navigator.userAgent.indexOf('MSIE 10') > -1) {
			this.ieVersion = 10;
		} else if (navigator.userAgent.indexOf('Trident') > -1) {
			this.ieVersion = 11;
		} else if (navigator.userAgent.indexOf('Edge') > -1) {
			this.ieVersion = 14;
		}
	},

	/**
	 * Kicks it off, most likely looking for .burgerMenu as the menus you want to use.
	 * Notes on IE/Edge: For whatever reason it consistently reports offsetWidth 100px smaller than
	 * any other browser. Therefore we need to flag IE. Functions affected: repositionMenu.
	 * Additionally IE9 has issues with transforms, so a display: none/block toggle 
	 * is set in repositionMenu and displayMenu.
	 * @xClass: Class of menus to transform.
	 */
	setup: function (xClass) {
		this.checkIE();
		var menus = document.querySelectorAll(xClass);
		for (var i = 0; i < menus.length; i++) {
			var originalMenu = menus[i],
				newMenu = originalMenu.cloneNode(true),
				id = newMenu.getAttribute('id') ? newMenu.getAttribute('id') : this.createID(),
				leftMargin = 'margin-left:' + (-1 * (originalMenu.offsetWidth / 2)) + 'px',
				title = newMenu.getAttribute('title') ? newMenu.getAttribute('title') : 'Open menu',
				isWhite = menus[i].className.indexOf('burgerMenuWhite') > 0 ? true : false;
			this.setAttributes(newMenu, { 'id': id, 'aria-expanded': 'false', 'aria-hidden': 'true', 'class': newMenu.className + ' burgerMenuInactive', 'role': 'menu', 'style': leftMargin + '; display: inline-block;', 'title': title });
			originalMenu.parentNode.replaceChild(this.createMenu(newMenu, isWhite), originalMenu);
			newMenu = this.repositionMenu(newMenu);
		}
		document.addEventListener('keydown', this.keyboardNavigation.bind(this), false);
		document.addEventListener('click', this.windowClick.bind(this), false);
	}
};
