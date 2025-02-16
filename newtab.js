document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    let darkModeDebounceTimer;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const setFocusArea = document.getElementById('setFocusArea');
    const activeFocusArea = document.getElementById('activeFocusArea');
    const setFocusButton = document.getElementById('setFocusButton');
    const newFocusInput = document.getElementById('newFocusInput');
    const focusText = document.getElementById('focusText');
    const completeFocusButton = document.getElementById('completeFocusButton'); // Renamed for consistency
    const fireworks = document.getElementById('fireworks'); // Assuming you still have fireworks


    // --- Helper Functions ---

    const showFireworks = () => {
        fireworks.style.display = 'block';
        setTimeout(() => {
            fireworks.style.display = 'none';
        }, 3000);
    };

    const showSetFocusArea = () => {
        setFocusArea.style.display = 'block';
        activeFocusArea.style.display = 'none';
        newFocusInput.value = '';
        newFocusInput.focus();
    };

    const showActiveFocusArea = (focus) => {
        setFocusArea.style.display = 'none';
        activeFocusArea.style.display = 'flex'; // Assuming you want flex display
        focusText.textContent = `Focus with all your power! ${focus}`;
    };

    // --- Chrome Storage Functions (using Promises for better async handling) ---

    const getFromStorage = (key) => {
        return new Promise((resolve, reject) => {
            try {
                const storage = browser?.storage || chrome.storage;
                storage.local.get(key, (data) => {
                    const error = browser?.runtime?.lastError || chrome.runtime?.lastError;
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data[key]);
                    }
                });
            } catch (e) {
                // Fallback to localStorage if browser storage APIs are unavailable
                resolve(localStorage.getItem(key));
            }
        });
    };

    const setToStorage = (key, value) => {
        return new Promise((resolve, reject) => {
            try {
                const storage = browser?.storage || chrome.storage;
                storage.local.set({ [key]: value }, () => {
                    const error = browser?.runtime?.lastError || chrome.runtime?.lastError;
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } catch (e) {
                // Fallback to localStorage if browser storage APIs are unavailable
                localStorage.setItem(key, value);
                resolve();
            }
        });
    };

    // --- Update Focus Display Function ---
    const updateFocusDisplay = async () => {
        try {
            const dailyFocus = await getFromStorage('dailyFocus');
            if (dailyFocus) {
                showActiveFocusArea(dailyFocus);
            } else {
                showSetFocusArea();
            }
        } catch (error) {
            console.error("Error getting focus from storage:", error);
            // Handle the error appropriately (e.g., show a default state, display an error message)
            showSetFocusArea(); // Fallback to the set focus area
        }
    };


    // --- Event Listeners ---

    // Load and apply dark mode preference
    getFromStorage('darkMode')
        .then(darkMode => {
            if (darkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
        })
        .catch(error => {
            console.error("Error loading dark mode preference:", error);
            // Handle error, perhaps set a default
        });

    // Dark Mode Toggle
    darkModeToggle.addEventListener('change', async () => {
        clearTimeout(darkModeDebounceTimer);
        darkModeDebounceTimer = setTimeout(async () => {
            const isDarkMode = darkModeToggle.checked; // Use the checked state directly
        document.body.classList.toggle('dark-mode', isDarkMode); // Use toggle with a boolean
        try {
            await setToStorage('darkMode', isDarkMode);
        } catch (error) {
            console.error("Error saving dark mode preference:", error);
            // Handle the error (e.g., show a message to the user)
        }
    });


    // Set Focus Button Click
    setFocusButton.addEventListener('click', async () => {
        const focus = newFocusInput.value.trim();
        if (focus) {
            try {
                await setToStorage('dailyFocus', focus);
                updateFocusDisplay();
            } catch (error) {
                console.error("Error saving focus:", error);
            }
        }
    });

    // Handle Enter Key in Input
    newFocusInput.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            const focus = newFocusInput.value.trim();
            if (focus) {
                try {
                    await setToStorage('dailyFocus', focus);
                    updateFocusDisplay();
                } catch (error) {
                    console.error("Error saving focus:", error);
                }
            }
        }
    });
    // Complete Focus Button Click
      completeFocusButton.addEventListener('click', async () => { //Use the renamed button
        try {
            await setToStorage('dailyFocus', ''); // Clear the focus
            updateFocusDisplay();
            showFireworks();  // Add fireworks back
        } catch (error) {
            console.error("Error clearing focus:", error);
        }
    });



    // --- Initialization ---
    updateFocusDisplay(); // Initial display update
});
