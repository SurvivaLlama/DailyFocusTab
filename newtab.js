
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    let darkModeDebounceTimer;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const setFocusArea = document.getElementById('setFocusArea');
    const activeFocusArea = document.getElementById('activeFocusArea');
    const setFocusButton = document.getElementById('setFocusButton');
    const newFocusInput = document.getElementById('newFocusInput');
    const focusText = document.getElementById('focusText');
    const completeFocusButton = document.getElementById('completeFocusButton');
    const fireworks = document.getElementById('fireworks');

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
        activeFocusArea.style.display = 'flex';
        focusText.textContent = `Focus with all your power! ${focus}`;
    };

    // --- Storage Functions ---
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
                localStorage.setItem(key, value);
                resolve();
            }
        });
    };

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
            showSetFocusArea();
        }
    };

    // --- Event Listeners ---
    // Dark Mode Toggle
    darkModeToggle.addEventListener('change', async () => {
        clearTimeout(darkModeDebounceTimer);
        darkModeDebounceTimer = setTimeout(async () => {
            const isDarkMode = darkModeToggle.checked;
            document.body.classList.toggle('dark-mode', isDarkMode);
            try {
                await setToStorage('darkMode', isDarkMode);
            } catch (error) {
                console.error("Error saving dark mode preference:", error);
            }
        }, 300);
    });

    // Set Focus Button Click
    setFocusButton.addEventListener('click', async () => {
        const focus = newFocusInput.value.trim();
        if (focus) {
            try {
                await setToStorage('dailyFocus', focus);
                await updateFocusDisplay();
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
                    await updateFocusDisplay();
                } catch (error) {
                    console.error("Error saving focus:", error);
                }
            }
        }
    });

    // Complete Focus Button Click
    completeFocusButton.addEventListener('click', async () => {
        try {
            await setToStorage('dailyFocus', '');
            await updateFocusDisplay();
            showFireworks();
        } catch (error) {
            console.error("Error clearing focus:", error);
        }
    });

    // --- Initialization ---
    getFromStorage('darkMode')
        .then(darkMode => {
            if (darkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
        })
        .catch(error => console.error("Error loading dark mode preference:", error));

    updateFocusDisplay();
});
