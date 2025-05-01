document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const resultAmount = document.getElementById('resultAmount');
    const conversionRate = document.getElementById('conversionRate');
    const swapBtn = document.getElementById('swapCurrencies');
    const convertBtn = document.getElementById('convertBtn');
    const fromFlag = document.getElementById('fromFlag');
    const toFlag = document.getElementById('toFlag');
    const lastUpdated = document.getElementById('lastUpdated');

    // Exchange rates data
    let exchangeRates = {};
    let currencies = [];
    let lastUpdateTime = '';

    // Initialize the app
    init();

    async function init() {
        // Load currencies from local storage if available
        const savedCurrencies = localStorage.getItem('currencies');
        const savedRates = localStorage.getItem('exchangeRates');
        const savedTime = localStorage.getItem('lastUpdateTime');
        
        if (savedCurrencies && savedRates && savedTime) {
            currencies = JSON.parse(savedCurrencies);
            exchangeRates = JSON.parse(savedRates);
            lastUpdateTime = savedTime;
            populateCurrencyDropdowns();
            updateLastUpdatedDisplay();
            convert();
        } else {
            // Show loading state
            convertBtn.innerHTML = '<span class="loading"></span> Loading...';
            convertBtn.disabled = true;
        }

        try {
            // Fetch currencies first
            await fetchCurrencies();
            
            // Then fetch exchange rates
            await fetchExchangeRates();
            
            // Populate dropdowns and set default values
            populateCurrencyDropdowns();
            setDefaultCurrencies();
            
            // Update UI
            updateLastUpdatedDisplay();
            convert();
            
            // Enable convert button
            convertBtn.textContent = 'Convert';
            convertBtn.disabled = false;
        } catch (error) {
            console.error('Error initializing currency converter:', error);
            convertBtn.textContent = 'Error Loading Data';
            showError('Failed to load currency data. Please try again later.');
        }
    }

    async function fetchCurrencies() {
        // In a real app, you would fetch this from your API
        // For this example, we'll use a comprehensive list of currencies with country codes
        
        currencies = [
            { code: 'USD', name: 'United States Dollar', countryCode: 'us' },
            { code: 'EUR', name: 'Euro', countryCode: 'eu' },
            { code: 'GBP', name: 'British Pound Sterling', countryCode: 'gb' },
            { code: 'JPY', name: 'Japanese Yen', countryCode: 'jp' },
            { code: 'AUD', name: 'Australian Dollar', countryCode: 'au' },
            { code: 'CAD', name: 'Canadian Dollar', countryCode: 'ca' },
            { code: 'CHF', name: 'Swiss Franc', countryCode: 'ch' },
            { code: 'CNY', name: 'Chinese Yuan', countryCode: 'cn' },
            { code: 'INR', name: 'Indian Rupee', countryCode: 'in' },
            { code: 'SGD', name: 'Singapore Dollar', countryCode: 'sg' },
            { code: 'NZD', name: 'New Zealand Dollar', countryCode: 'nz' },
            { code: 'MXN', name: 'Mexican Peso', countryCode: 'mx' },
            { code: 'BRL', name: 'Brazilian Real', countryCode: 'br' },
            { code: 'ZAR', name: 'South African Rand', countryCode: 'za' },
            { code: 'AED', name: 'United Arab Emirates Dirham', countryCode: 'ae' },
            { code: 'KRW', name: 'South Korean Won', countryCode: 'kr' },
            { code: 'TRY', name: 'Turkish Lira', countryCode: 'tr' },
            { code: 'RUB', name: 'Russian Ruble', countryCode: 'ru' },
            { code: 'SEK', name: 'Swedish Krona', countryCode: 'se' },
            { code: 'NOK', name: 'Norwegian Krone', countryCode: 'no' },
            { code: 'DKK', name: 'Danish Krone', countryCode: 'dk' },
            { code: 'HKD', name: 'Hong Kong Dollar', countryCode: 'hk' },
            { code: 'MYR', name: 'Malaysian Ringgit', countryCode: 'my' },
            { code: 'THB', name: 'Thai Baht', countryCode: 'th' },
            { code: 'IDR', name: 'Indonesian Rupiah', countryCode: 'id' },
            { code: 'PHP', name: 'Philippine Peso', countryCode: 'ph' },
            { code: 'SAR', name: 'Saudi Riyal', countryCode: 'sa' },
            { code: 'PLN', name: 'Polish Zloty', countryCode: 'pl' },
            { code: 'CZK', name: 'Czech Koruna', countryCode: 'cz' },
            { code: 'HUF', name: 'Hungarian Forint', countryCode: 'hu' }
        ];
        
        // Save to local storage
        localStorage.setItem('currencies', JSON.stringify(currencies));
    }

    async function fetchExchangeRates() {
        // In a real app, you would fetch this from an API like ExchangeRate-API
        // For this example, we'll simulate fetching data with some hardcoded rates
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Base currency is USD
        exchangeRates = {
            "USD": 1,
            "EUR": 0.85,
            "GBP": 0.73,
            "JPY": 110.25,
            "AUD": 1.35,
            "CAD": 1.26,
            "CHF": 0.92,
            "CNY": 6.45,
            "INR": 74.50,
            "SGD": 1.34,
            "NZD": 1.42,
            "MXN": 20.15,
            "BRL": 5.25,
            "ZAR": 14.60,
            "AED": 3.67,
            "KRW": 1150.75,
            "TRY": 8.45,
            "RUB": 73.80,
            "SEK": 8.55,
            "NOK": 8.75,
            "DKK": 6.30,
            "HKD": 7.78,
            "MYR": 4.15,
            "THB": 32.50,
            "IDR": 14325.00,
            "PHP": 50.30,
            "SAR": 3.75,
            "PLN": 3.85,
            "CZK": 21.65,
            "HUF": 300.50
        };
        
        lastUpdateTime = new Date().toISOString();
        
        // Save to local storage
        localStorage.setItem('exchangeRates', JSON.stringify(exchangeRates));
        localStorage.setItem('lastUpdateTime', lastUpdateTime);
    }

    function populateCurrencyDropdowns() {
        // Clear existing options
        fromCurrencySelect.innerHTML = '';
        toCurrencySelect.innerHTML = '';
        
        // Add options for each currency
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency.code;
            option1.textContent = `${currency.code} - ${currency.name}`;
            fromCurrencySelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = currency.code;
            option2.textContent = `${currency.code} - ${currency.name}`;
            toCurrencySelect.appendChild(option2);
        });
        
        // Update flags when selection changes
        fromCurrencySelect.addEventListener('change', updateFromFlag);
        toCurrencySelect.addEventListener('change', updateToFlag);
    }

    function setDefaultCurrencies() {
        // Try to get user's location from browser
        // This is just for demo purposes - in a real app you'd need proper geolocation
        const userLanguage = navigator.language || 'en-US';
        const region = userLanguage.split('-')[1] || 'US';
        
        // Find a currency for this region
        const userCurrency = currencies.find(c => c.countryCode === region.toLowerCase()) || 
                            currencies.find(c => c.code === 'USD');
        
        if (userCurrency) {
            fromCurrencySelect.value = userCurrency.code;
            updateFromFlag();
        }
        
        // Default to EUR as target
        toCurrencySelect.value = 'EUR';
        updateToFlag();
    }

    function updateFromFlag() {
        const selectedCurrency = fromCurrencySelect.value;
        const currency = currencies.find(c => c.code === selectedCurrency);
        
        if (currency) {
            fromFlag.innerHTML = `<span class="flag-icon flag-icon-${currency.countryCode}"></span>`;
        } else {
            fromFlag.innerHTML = '';
        }
    }

    function updateToFlag() {
        const selectedCurrency = toCurrencySelect.value;
        const currency = currencies.find(c => c.code === selectedCurrency);
        
        if (currency) {
            toFlag.innerHTML = `<span class="flag-icon flag-icon-${currency.countryCode}"></span>`;
        } else {
            toFlag.innerHTML = '';
        }
    }

    function updateLastUpdatedDisplay() {
        if (lastUpdateTime) {
            const date = new Date(lastUpdateTime);
            lastUpdated.textContent = `Updated: ${date.toLocaleString()}`;
        } else {
            lastUpdated.textContent = 'Rates not loaded';
        }
    }

    function convert() {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount)) {
            showError('Please enter a valid amount');
            return;
        }
        
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (!fromCurrency || !toCurrency) {
            showError('Please select both currencies');
            return;
        }
        
        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
            showError('Exchange rate data not available for selected currencies');
            return;
        }
        
        // Convert via USD as base currency
        const amountInUSD = amount / exchangeRates[fromCurrency];
        const convertedAmount = amountInUSD * exchangeRates[toCurrency];
        
        // Display result
        resultAmount.textContent = convertedAmount.toFixed(2);
        
        // Display conversion rate
        const rate = (exchangeRates[toCurrency] / exchangeRates[fromCurrency]).toFixed(6);
        conversionRate.textContent = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
    }

    function showError(message) {
        resultAmount.textContent = 'Error';
        conversionRate.textContent = message;
        conversionRate.style.color = 'var(--warning-color)';
        
        // Reset after 3 seconds
        setTimeout(() => {
            conversionRate.textContent = '';
            conversionRate.style.color = '';
        }, 3000);
    }

    // Event Listeners
    amountInput.addEventListener('input', convert);
    fromCurrencySelect.addEventListener('change', convert);
    toCurrencySelect.addEventListener('change', convert);
    convertBtn.addEventListener('click', convert);
    
    swapBtn.addEventListener('click', function() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        
        updateFromFlag();
        updateToFlag();
        convert();
    });

    // Update flags on initial load
    updateFromFlag();
    updateToFlag();
});