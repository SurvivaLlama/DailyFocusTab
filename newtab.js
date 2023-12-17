// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Grab the elements from the page
    var setFocusButton = document.getElementById('setFocusButton');
    var newFocusInput = document.getElementById('newFocusInput');
    var focusText = document.getElementById('focusText');

    // Event listener for the 'Set Focus' button click
    setFocusButton.addEventListener('click', function() {
        // Retrieve the focus from the input field
        var dailyFocus = newFocusInput.value;
        // Save the daily focus into local storage
        chrome.storage.local.set({ 'dailyFocus': dailyFocus }, function() {
            // Update the display with the new focus
            updateFocusDisplay();
        });
    });

    // Event listener for the 'Enter' key in the input field
    newFocusInput.addEventListener('keypress', function(event) {
        // Check if the Enter key was pressed
        if (event.key === 'Enter') {
            // Save the daily focus into local storage
            chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
                // Update the display with the new focus
                updateFocusDisplay();
            });
        }
    });

    // Initial call to display the current focus
    updateFocusDisplay();
});

// Function to update the focus display on the page
function updateFocusDisplay() {
    // Get the daily focus from local storage
    chrome.storage.local.get('dailyFocus', function(data) {
        // If there's a focus set, display it, otherwise show the default message
        focusText.textContent = data.dailyFocus || 'No daily focus set for today.';
    });
}
