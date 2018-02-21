# BurgerMenu

> An animated, automated dropdown, (literal) hamburger menu script. Uses pure JavaScript, no frameworks required.
> 
> A Remi A Olsen Production :D
> remi@remiolsen.info / https://remiolsen.info
>
> Demo: https://remiolsen.info/BurgerMenu/
> 
> This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
> https://creativecommons.org/licenses/by-nc/4.0/

To run, simply add these lines within the head tag:

	<link rel="stylesheet" type="text/css" href="BurgerMenu/css/styles.css">
	<script type="text/javascript" src="BurgerMenu/js/script.js"></script>
	<script type="text/javascript">
		window.onload = function() {
			var burger = Object.create(burgerMenu);
			burger.setup('.burgerMenu');
		}
	</script>
    
For the HTML, something like this:

	<ul class="burgerMenu" title="My burger menu" id="mainNavMenu">
		<li><a href="/">Home</a></li>
		<li><a href="http://www.ddir.com/">Dick’s Drive-in</a></li>
		<li><a href="https://duckduck.go">DuckDuckGo</a></li>
	</ul>
	
If you want a white icon/menu, add `burgerMenuWhite`.
	<ul class="burgerMenu burgerMenuWhite" title="My burger menu" id="mainNavMenu">

Check the CSS file for information on which classes to include in a custom stylesheet for different colors. You can also copy the SVG icon from the `img` folder, and edit colors, etc. from there.
