// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Grab the 'Set Focus' button and input field elements
    var setFocusButton = document.getElementById('setFocusButton');
    var newFocusInput = document.getElementById('newFocusInput');
    var focusText = document.getElementById('focusText');

    // Automatically set the focus to the input field when the tab is opened
    newFocusInput.focus();

    // Add a click event listener to the 'Set Focus' button
    setFocusButton.addEventListener('click', function() {
        // Save the entered focus into local storage
        chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
            // Update the display with the new focus
            updateFocusDisplay();
        });
    });

    // Add a keypress event listener to trigger the focus set on 'Enter' press
    newFocusInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
                updateFocusDisplay();
            });
        }
    });

    // Function to update the focus display
    function updateFocusDisplay() {
        // Get the daily focus from local storage
        chrome.storage.local.get('dailyFocus', function(data) {
            // Display the focus or a default message if none is set
            focusText.textContent = data.dailyFocus || 'No daily focus set for today.';
        });
    }

    // Call updateFocusDisplay to display the focus when the tab is first opened
    updateFocusDisplay();
});
