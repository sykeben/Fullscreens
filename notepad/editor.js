// Notepad routine.
(() => {
    'use strict'

    // Define get/set routines.
    const getEditor = () => document.getElementById('editor-text').value
    const setEditor = (contents, doSave = true) => {
        document.getElementById('editor-text').value = contents
        if (doSave) saveEditor()
    }
    
    // Define save/load routines.
    const saveEditor = () => window.localStorage['notepadText'] = getEditor()
    const loadEditor = () => setEditor(window.localStorage['notepadText'], false)

    // Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

        // Bind nuke button click event.
        document.getElementById('editor-nuke').addEventListener('click', () => setEditor(''))

        // Bind editor keyup event.
        document.getElementById('editor-text').addEventListener('keyup', saveEditor)

        // Load last state.
        if (window.localStorage['notepadText']) loadEditor()

    })

})()
