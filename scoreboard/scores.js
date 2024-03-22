// Counter routine.
(() => {
    'use strict'

    // Define get/set routines.
    const getScore = (id) => Number(document.getElementById(`score-${id}-number`).innerText)
    const setScore = (id, value, doSave = true) => {
        document.getElementById(`score-${id}-number`).innerText = value
        if (doSave) saveScore(id)
    }
    
    // Define save/load routines.
    const saveScore = (id) => window.localStorage[`score${id.toUpperCase()}Value`] = getScore(id)
    const loadScore = (id) => setScore(id, window.localStorage[`score${id.toUpperCase()}Value`], false)

    // Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

        // Bind button click events.
        document.getElementById('score-a-down').addEventListener('click', () => setScore('a', getScore('a') - 1))
        document.getElementById('score-a-up').addEventListener('click', () => setScore('a', getScore('a') + 1))
        document.getElementById('score-a-nuke').addEventListener('click', () => setScore('a', 0))
        document.getElementById('score-b-down').addEventListener('click', () => setScore('b', getScore('b') - 1))
        document.getElementById('score-b-up').addEventListener('click', () => setScore('b', getScore('b') + 1))
        document.getElementById('score-b-nuke').addEventListener('click', () => setScore('b', 0))

        // Load last state.
        if (window.localStorage['scoreAValue']) loadScore('a')
        if (window.localStorage['scoreBValue']) loadScore('b')

    })

})()
