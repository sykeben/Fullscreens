/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Modified for use by Benjamin Sykes in 2024
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

// Theme routine.
(() => {
	'use strict'

	// Define storage handlers.
	const getStoredTheme = () => localStorage.getItem('theme')
	const setStoredTheme = theme => localStorage.setItem('theme', theme)

	// Define icon translator.
	const translateIcon = (theme, invert = false) => {
		if (theme == 'dark') {
			return invert ? 'bi-sun' : 'bi-moon'
		} else {
			return invert ? 'bi-moon' : 'bi-sun'
		}
	}

	// Define preferred theme routine.
	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme()
		if (storedTheme) return storedTheme
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}

	// Define theme set routine.
	const setTheme = theme => {
		document.documentElement.setAttribute('data-bs-theme', theme)
	}

	// Execute it now with the preferred option.
	setTheme(getPreferredTheme())

	// Define theme display routine.
	const showActiveTheme = (theme) => {
		const themeButton = document.querySelector('#theme-button')

		if (!themeButton) {
			return
		}

		const themeIcon = document.querySelector('#theme-icon')

		themeIcon.classList.remove(translateIcon(theme, true))
		themeIcon.classList.add(translateIcon(theme))
	}

	// Bind update event.
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		const storedTheme = getStoredTheme()
		if (storedTheme !== 'light' && storedTheme !== 'dark') {
			setTheme(getPreferredTheme())
		}
	})

	// Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

		// Show active theme.
		showActiveTheme(getPreferredTheme())

		// Bind switcher.
		document.querySelector('#theme-button').addEventListener('click', () => {
			const theme = getPreferredTheme() == 'dark' ? 'light' : 'dark'
			setStoredTheme(theme)
			setTheme(theme)
			showActiveTheme(theme)
		})

	})
	
})()
