document.addEventListener('DOMContentLoaded', function() {
    var setButton = document.getElementById('setReminderButton');
    var inputField = document.getElementById('newReminderInput');

    // Event listener for the button click
    setButton.addEventListener('click', setReminder);

    // Event listener for pressing the Enter key in the input field
    inputField.addEventListener('keypress', function(event) {
        // Check if the Enter key is pressed
        if (event.key === 'Enter') {
            setReminder();
        }
    });

    updateReminderDisplay();
});

function setReminder() {
    var reminderText = document.getElementById('newReminderInput').value;
    chrome.storage.local.set({ 'dailyReminder': reminderText }, function() {
        updateReminderDisplay();
    });
}

function updateReminderDisplay() {
    chrome.storage.local.get('dailyReminder', function(data) {
        document.getElementById('reminderText').textContent = data.dailyReminder || 'No reminder set for today.';
    });
}
