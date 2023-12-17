// Listen for DOMContentLoaded event to ensure HTML is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the 'Set Reminder' button and add click event listener
    var setButton = document.getElementById('setReminderButton');
    setButton.addEventListener('click', function() {
        // Get the value from the input field
        var reminderText = document.getElementById('newReminderInput').value;
        // Save the reminder text in local storage
        chrome.storage.local.set({ 'dailyReminder': reminderText }, function() {
            // Update the display with the new reminder
            updateReminderDisplay();
        });
    });
    // Update the display when the page loads
    updateReminderDisplay();
});

// Function to update the reminder display
function updateReminderDisplay() {
    // Retrieve the stored reminder text
    chrome.storage.local.get('dailyReminder', function(data) {
        // Display the reminder text or a default message
        document.getElementById('reminderText').textContent = data.dailyReminder || 'No reminder set for today.';
    });
}
