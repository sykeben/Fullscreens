// Counter routine.
(() => {
    'use strict'

    // Define get/set routines.
    const getCounter = () => Number(document.getElementById('counter-number').innerText)
    const setCounter = (value, doSave = true) => {
        document.getElementById('counter-number').innerText = value
        if (doSave) saveCounter()
    }
    
    // Define save/load routines.
    const saveCounter = () => window.localStorage['counterValue'] = getCounter()
    const loadCounter = () => setCounter(window.localStorage['counterValue'], false)

    // Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

        // Bind button click events.
        document.getElementById('counter-down').addEventListener('click', () => setCounter(getCounter() - 1))
        document.getElementById('counter-up').addEventListener('click', () => setCounter(getCounter() + 1))
        document.getElementById('counter-nuke').addEventListener('click', () => setCounter(0))

        // Load last state.
        if (window.localStorage['counterValue']) loadCounter()

    })

})()
