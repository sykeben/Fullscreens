// Counter routine.
(() => {
    'use strict'

    // Define number padder.
    const padN = (n) => ((n < 10) ? `0${n}` : `${n}`)

    // Define running get/set routines.
    let isRunning = false
    let endTime = null
    const getRunning = () => document.getElementById('timer-start').classList.contains('d-none')
    const setRunning = (value, customEndTime = null, doSave = true) => {
        if (value) {

            // Hide adjusters.
            for (const adjuster of document.getElementsByClassName('timer-adjusters')) {
                adjuster.classList.add('d-none')
            }

            // Show set time.
            document.getElementById('timer-setpoint').classList.remove('d-none')

            // Make display thicker.
            for (const display of document.getElementsByClassName('timer-display')) {
                display.classList.add('fw-normal')
            }

            // Update start/stop buttons.
            document.getElementById('timer-start').classList.add('d-none')
            document.getElementById('timer-stop').classList.remove('d-none')

            // Initialize end time.
            if (customEndTime) {

                // Set custom end time.
                endTime = customEndTime
                
            } else {

                // Calculate end time.
                endTime = new Date()
                endTime.setDate(endTime.getDate() + getDSet())
                endTime.setHours(endTime.getHours() + getHSet())
                endTime.setMinutes(endTime.getMinutes() + getMSet())
                endTime.setSeconds(endTime.getSeconds() + getSSet())

            }
            endT = endTime.getTime() + 1000

            // Display message.
            const endStr = endTime.toLocaleString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                weekday: 'short', month: '2-digit', day: '2-digit', year: '2-digit'
            })
            document.getElementById('statusbar').innerText = `Will finish ${endStr}.`

            // Set running.
            isRunning = true

            // Trigger display update.
            if (diffInterval) clearInterval(diffInterval)
            updateDiff()
            diffInterval = setInterval(updateDiff, 1000)

        } else {

            // Unset running.
            isRunning = false

            // Stop inverval.
            if (diffInterval) clearInterval(diffInterval)

            // Show adjusters.
            for (const adjuster of document.getElementsByClassName('timer-adjusters')) {
                adjuster.classList.remove('d-none')
            }

            // Hide set time.
            document.getElementById('timer-setpoint').classList.add('d-none')

            // Make display thinner.
            for (const display of document.getElementsByClassName('timer-display')) {
                display.classList.remove('fw-normal')
            }

            // Update start/stop buttons.
            document.getElementById('timer-start').classList.remove('d-none')
            document.getElementById('timer-stop').classList.add('d-none')

            // Display message.
            if (endTime) {
                const endStr = endTime.toLocaleString('en-US', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                    weekday: 'short', month: '2-digit', day: '2-digit', year: '2-digit'
                })
                document.getElementById('statusbar').innerText = `Finished ${endStr}.`
            }

            // Clear end time.
            endTime = null
            endT = 0

            // Show set point.
            for (const x of ['d', 'h', 'm', 's']) {
                setXNum(x, getXSet(x))
            }

        }

        // Save state.
        if (doSave) saveRunning()
    }

    // Define setpoint get/set routines.
    let setpoint = { 'd': 0, 'h': 0, 'm': 0, 's': 0 }
    const getXSet = (x) => {
        return Number.parseInt(document.getElementById(`timer-${x.toLowerCase()}-set`).innerText)
    }
    const getDSet = () => getXSet('d')
    const getHSet = () => getXSet('h')
    const getMSet = () => getXSet('m')
    const getSSet = () => getXSet('s')
    const setXSet = (x, value, maxValue, doSave = true) => {
        
        // Get value.
        value = Math.min(Math.max(value, 0), maxValue)

        // Update displays.
        document.getElementById(`timer-${x.toLowerCase()}-set`).innerText = padN(value)
        if (!isRunning) {
            setXNum(x, value)
            document.getElementById('statusbar').innerText = ''
        }

        // Store.
        setpoint[x.toLowerCase()] = value
        if (doSave) saveXSet(x)

    }
    const setDSet = (value, doSave = true) => setXSet('d', value, 99, doSave)
    const setHSet = (value, doSave = true) => setXSet('h', value, 23, doSave)
    const setMSet = (value, doSave = true) => setXSet('m', value, 59, doSave)
    const setSSet = (value, doSave = true) => setXSet('s', value, 59, doSave)

    // Define display get/set routines.
    const getXNum = (x) => {
        return Number.parseInt(document.getElementById(`timer-${x.toLowerCase()}-num`).innerText)
    }
    const getDNum = () => getXNum('d')
    const getHNum = () => getXNum('h')
    const getMNum = () => getXNum('m')
    const getSNum = () => getXNum('s')
    const setXNum = (x, value) => {
        document.getElementById(`timer-${x.toLowerCase()}-num`).innerText = padN(value)
    }
    const setDNum = (value) => setXNum('d', value)
    const setHNum = (value) => setXNum('h', value)
    const setMNum = (value) => setXNum('m', value)
    const setSNum = (value) => setXNum('s', value)

    // Define running save/load routines.
    const saveRunning = () => {
        window.localStorage['timerRunS'] = String(getRunning())
        if (endTime) {
            window.localStorage['timerRunT'] = String(endTime.getTime())
        } else {
            window.localStorage['timerRunT'] = ''
        }
    }
    const loadRunning = () => {
        const isRunning = window.localStorage['timerRunS'] == String(true)
        if (window.localStorage['timerRunT'] == '') {
            setRunning(isRunning, null, false)
        } else {
            setRunning(isRunning, new Date(Number.parseInt(window.localStorage['timerRunT'])), false)
        }
    }

    // Define setpoint save/load routines.
    const saveXSet = (x) => {
        window.localStorage[`timerSet${x.toUpperCase()}`] = String(getXSet(x))
    }
    const saveDSet = () => saveXSet('d')
    const saveHSet = () => saveXSet('h')
    const saveMSet = () => saveXSet('m')
    const saveSSet = () => saveXSet('s')
    const loadXSet = (x, maxValue) => {
        setXSet(x, Number.parseInt(window.localStorage[`timerSet${x.toUpperCase()}`]), maxValue, false)
    }
    const loadDSet = () => loadXSet('d', 99)
    const loadHSet = () => loadXSet('h', 23)
    const loadMSet = () => loadXSet('m', 59)
    const loadSSet = () => loadXSet('s', 59)

    // Define display update routine.
    let endT = 0
    let diffInterval = null
    const updateDiff = () => {

        // Quit if not running.
        if (!isRunning) return

        // Get time.
        const nowT = (new Date()).getTime()

        // Stop if past end time.
        if (nowT > endT) {
            setRunning(false)
            return
        }

        // Display differences.
        const diffT = Math.abs(endT - nowT)
        setSNum(Math.floor((diffT / 1000) % 60))
        setMNum(Math.floor((diffT / 1000 / 60) % 60))
        setHNum(Math.floor((diffT / 1000 / 60 / 60) % 24))
        setDNum(Math.floor((diffT / 1000 / 60 / 60 / 24) % 100))

    }

    // Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

        // Bind adjustment buttons.
        document.getElementById('timer-d-dec').addEventListener('click', () => setDSet(getDSet() - 1))
        document.getElementById('timer-d-inc').addEventListener('click', () => setDSet(getDSet() + 1))
        document.getElementById('timer-h-dec').addEventListener('click', () => setHSet(getHSet() - 1))
        document.getElementById('timer-h-inc').addEventListener('click', () => setHSet(getHSet() + 1))
        document.getElementById('timer-m-dec').addEventListener('click', () => setMSet(getMSet() - 1))
        document.getElementById('timer-m-inc').addEventListener('click', () => setMSet(getMSet() + 1))
        document.getElementById('timer-s-dec').addEventListener('click', () => setSSet(getSSet() - 1))
        document.getElementById('timer-s-inc').addEventListener('click', () => setSSet(getSSet() + 1))

        // Bind start/stop buttons.
        document.getElementById('timer-start').addEventListener('click', () => setRunning(true))
        document.getElementById('timer-stop').addEventListener('click', () => setRunning(false))

        // Bind clear button.
        document.getElementById('timer-nuke').addEventListener('click', () => {
            setRunning(false)
            for (const x of ['d', 'h', 'm', 's']) {
                setXSet(x, 0, 0)
            }
        })

        // Load previous state.
        if (window.localStorage['timerSetD']) loadDSet()
        if (window.localStorage['timerSetH']) loadHSet()
        if (window.localStorage['timerSetM']) loadMSet()
        if (window.localStorage['timerSetS']) loadSSet()
        if (window.localStorage['timerRunS']) loadRunning()

    })

})()
