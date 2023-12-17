document.addEventListener('DOMContentLoaded', function() {
    var setButton = document.getElementById('setFocusButton');
    var inputField = document.getElementById('newFocusInput');

    // Event listener for the button click
    setButton.addEventListener('click', setDailyFocus);

    // Event listener for pressing the Enter key in the input field
    inputField.addEventListener('keypress', function(event) {
        // Check if the Enter key is pressed
        if (event.key === 'Enter') {
            setDailyFocus();
        }
    });

    updateDailyFocusDisplay();
});

function setDailyFocus() {
    var dailyFocusText = document.getElementById('newFocusInput').value;
    chrome.storage.local.set({ 'dailyFocus': dailyFocusText }, function() {
        updateDailyFocusDisplay();
    });
}

function updateDailyFocusDisplay() {
    chrome.storage.local.get('dailyFocus', function(data) {
        document.getElementById('focusText').textContent = data.dailyFocus || 'No daily focus set for today.';
    });
}
