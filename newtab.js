document.addEventListener('DOMContentLoaded', function() {
    var setButton = document.getElementById('setReminderButton');
    setButton.addEventListener('click', function() {
        var reminderText = document.getElementById('newReminderInput').value;
        chrome.storage.local.set({ 'dailyReminder': reminderText }, function() {
            updateReminderDisplay();
        });
    });
    updateReminderDisplay();
});

function updateReminderDisplay() {
    chrome.storage.local.get('dailyReminder', function(data) {
        document.getElementById('reminderText').textContent = data.dailyReminder || 'No reminder set for today.';
    });
}
