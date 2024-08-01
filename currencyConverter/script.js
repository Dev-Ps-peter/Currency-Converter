document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '4d8dea029505cac303391d4c';
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    const amountInput = document.getElementById('amount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const convertButton = document.getElementById('convert');
    const resultDiv = document.getElementById('result');

    let currencyNames = {};

    // Fetch currency names
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                if (country.currencies) {
                    Object.keys(country.currencies).forEach(code => {
                        currencyNames[code] = country.currencies[code].name;
                    });
                }
            });

            return fetch(apiUrl);
        })
        .then(response => response.json())
        .then(data => {
            const currencies = Object.keys(data.conversion_rates);
            populateCurrencyOptions(currencies, fromCurrency);
            populateCurrencyOptions(currencies, toCurrency);
        })
        .catch(error => console.error('Error fetching data:', error));

    convertButton.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (isNaN(amount)) {
            resultDiv.textContent = 'Please enter a valid amount.';
            return;
        }

        fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`)
            .then(response => response.json())
            .then(data => {
                const rate = data.conversion_rate;
                const convertedAmount = (amount * rate).toFixed(2);
                resultDiv.textContent = `${amount} ${currencyNames[from] || from} (${from}) = ${convertedAmount} ${currencyNames[to] || to} (${to})`;
            })
            .catch(error => console.error('Error converting currency:', error));
    });

    function populateCurrencyOptions(currencies, selectElement) {
        currencies.forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = `${currencyNames[currency] || currency} (${currency})`;
            selectElement.appendChild(option);
        });
    }
});
