// Clock routine.
(() => {
    'use strict'

    // Define clock update routine.
    const updateClock = () => {

        // Get current moment.
        const now = new Date();

        // Update time.
        document.getElementById('clock-time').innerText = now.toLocaleString('en-US', {
            hour:   '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })

        // Update date.
        document.getElementById('clock-date').innerText = now.toLocaleString('en-US', {
            weekday: 'short',
            month:   '2-digit',
            day:     '2-digit',
            year:    '2-digit'
        })

    }

    // Bind ready event.
	window.addEventListener('DOMContentLoaded', () => {

        // Perform initial update.
        updateClock()

        // Kick off clock update interval.
        setInterval(updateClock, 1000)

    })

})()
