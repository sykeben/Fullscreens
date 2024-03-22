// Counter routine.
(() => {
    'use strict'

    // Define number padder.
    const padN2 = (n) => ((n < 10) ? `0${n}` : `${n}`)
    const padN3 = (n) => ((n < 100) ? `0${padN2(n)}` : `${n}`)

    // Define running get/set routines.
    let isRunning = false
    let startTime = null
    const getRunning = () => document.getElementById('watch-start').classList.contains('d-none')
    const setRunning = (value, customStartTime = null, doSave = true) => {
        if (value) {

            // Update start/stop buttons.
            document.getElementById('watch-start').classList.add('d-none')
            document.getElementById('watch-stop').classList.remove('d-none')

            // Make display thicker.
            for (const display of document.getElementsByClassName('watch-display')) {
                display.classList.add('fw-normal')
            }

            // Initialize start time.
            if (customStartTime) {
                startTime = customStartTime
            } else {
                startTime = new Date()
            }
            startT = startTime.getTime()

            // Display message.
            const startStr = startTime.toLocaleString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                weekday: 'short', month: '2-digit', day: '2-digit', year: '2-digit'
            })
            document.getElementById('statusbar').innerText = `Started ${startStr}.`

            // Set running.
            isRunning = true

            // Trigger fast display update.
            if (diffIntervalFast) clearInterval(diffIntervalFast)
            updateDiffFast()
            updateDiffSlow()
            diffIntervalFast = setInterval(updateDiffFast, 15)

        } else {

            // Unset running.
            isRunning = false

            // Stop inverval.
            if (diffIntervalFast) clearInterval(diffIntervalFast)

            // Update start/stop buttons.
            document.getElementById('watch-start').classList.remove('d-none')
            document.getElementById('watch-stop').classList.add('d-none')

            // Make display thinner.
            for (const display of document.getElementsByClassName('watch-display')) {
                display.classList.remove('fw-normal')
            }

            // Clear message.
            document.getElementById('statusbar').innerText = ''

            // Clear times.
            startTime = null
            startT = 0
            nowT = 0
            diffT = 0

        }

        // Save state.
        if (doSave) saveRunning()
    }

    // Define display get/set routines.
    const setXNum = (x, value) => {
        document.getElementById(`watch-${x.toLowerCase()}`).innerText = value
    }
    const setDNum = (value) => setXNum('d', padN2(value))
    const setHNum = (value) => setXNum('h', padN2(value))
    const setMNum = (value) => setXNum('m', padN2(value))
    const setSNum = (value) => setXNum('s', padN2(value))
    const setFNum = (value) => setXNum('f', padN3(value))

    // Define running save/load routines.
    const saveRunning = () => {
        window.localStorage['watchRunS'] = String(getRunning())
        if (startTime) {
            window.localStorage['watchRunT'] = String(startTime.getTime())
        } else {
            window.localStorage['watchRunT'] = ''
        }
    }
    const loadRunning = () => {
        const isRunning = window.localStorage['watchRunS'] == String(true)
        if (window.localStorage['watchRunT'] == '') {
            setRunning(isRunning, null, false)
        } else {
            setRunning(isRunning, new Date(Number.parseInt(window.localStorage['watchRunT'])), false)
        }
    }

    // Global current and differential time (polled by fast routine).
    let startT = 0
    let nowT = 0
    let diffT = 0

    // Define slow display update routine.
    const updateDiffSlow = () => {

        // Quit if not running.
        if (!isRunning) return

        // Display differences.
        setSNum(Math.floor((diffT / 1000) % 60))
        setMNum(Math.floor((diffT / 1000 / 60) % 60))
        setHNum(Math.floor((diffT / 1000 / 60 / 60) % 24))
        setDNum(Math.floor((diffT / 1000 / 60 / 60 / 24) % 100))

    }

    // Define fast display update routine.
    let diffIntervalFast = null
    let lastF = 0
    const updateDiffFast = () => {

        // Quit if not running.
        if (!isRunning) return

        // Get time.
        nowT = (new Date()).getTime()

        // Display difference.
        diffT = Math.abs(nowT - startT)
        const thisF = Math.floor(diffT % 1000)
        setFNum(thisF)

        // Trigger slow if needed.
        if (lastF > thisF) updateDiffSlow()
        lastF = thisF

    }

    // Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

        // Bind start/stop buttons.
        document.getElementById('watch-start').addEventListener('click', () => setRunning(true))
        document.getElementById('watch-stop').addEventListener('click', () => setRunning(false))

        // Load previous state.
        if (window.localStorage['watchRunS']) loadRunning()

    })

})()
