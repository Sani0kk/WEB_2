document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі необхідні елементи
    const calculateBtn = document.getElementById('calculateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Додаємо обробники подій
    calculateBtn.addEventListener('click', calculateEmissions);
    resetBtn.addEventListener('click', resetForm);
    
    // Функція для розрахунку викидів
    function calculateEmissions() {
        // Отримуємо значення параметрів котла
        const a_vip = parseFloat(document.getElementById('boilerType').value);
        const n_zu = parseFloat(document.getElementById('filterEfficiency').value);
        
        // Розрахунок для вугілля
        const coalAmount = parseFloat(document.getElementById('coalAmount').value);
        const coalAshContent = parseFloat(document.getElementById('coalAshContent').value);
        const coalCombustibles = parseFloat(document.getElementById('coalCombustibles').value);
        const coalHeatValue = parseFloat(document.getElementById('coalHeatValue').value);
        
        const coalEmissionFactor = calculateEmissionFactor(coalAshContent, a_vip, coalCombustibles, n_zu, coalHeatValue);
        const coalTotalEmission = calculateTotalEmission(coalEmissionFactor, coalHeatValue, coalAmount);
        
        document.getElementById('coalEmissionFactor').textContent = coalEmissionFactor.toFixed(2);
        document.getElementById('coalTotalEmission').textContent = coalTotalEmission.toFixed(2);
        
        // Розрахунок для мазуту
        const oilAmount = parseFloat(document.getElementById('oilAmount').value);
        const oilAshContent = parseFloat(document.getElementById('oilAshContent').value);
        const oilCombustibles = parseFloat(document.getElementById('oilCombustibles').value);
        const oilHeatValue = parseFloat(document.getElementById('oilHeatValue').value);
        
        const oilEmissionFactor = calculateEmissionFactor(oilAshContent, 1.0, oilCombustibles, n_zu, oilHeatValue);
        const oilTotalEmission = calculateTotalEmission(oilEmissionFactor, oilHeatValue, oilAmount);
        
        document.getElementById('oilEmissionFactor').textContent = oilEmissionFactor.toFixed(2);
        document.getElementById('oilTotalEmission').textContent = oilTotalEmission.toFixed(2);
        
        // Розрахунок для природного газу
        const gasAmount = parseFloat(document.getElementById('gasAmount').value);
        const gasHeatValue = parseFloat(document.getElementById('gasHeatValue').value);
        
        // Для газу показник емісії завжди 0
        const gasEmissionFactor = 0;
        const gasTotalEmission = 0;
        
        document.getElementById('gasEmissionFactor').textContent = gasEmissionFactor.toFixed(2);
        document.getElementById('gasTotalEmission').textContent = gasTotalEmission.toFixed(2);
        
        // Загальний викид
        const totalEmission = coalTotalEmission + oilTotalEmission + gasTotalEmission;
        document.getElementById('totalEmission').textContent = totalEmission.toFixed(2);
    }
    
    // Функція для розрахунку показника емісії
    function calculateEmissionFactor(ashContent, a_vip, combustibles, n_zu, heatValue) {
        // Формула (2.2) з документації
        const emissionFactor = (Math.pow(10, 6) / heatValue) * 
                             (a_vip * (ashContent / 100) * ((100 - combustibles) / 100)) * 
                             (1 - n_zu);
        
        return emissionFactor;
    }
    
    // Функція для розрахунку валового викиду
    function calculateTotalEmission(emissionFactor, heatValue, fuelAmount) {
        // Формула (2.1) з документації
        const totalEmission = Math.pow(10, -6) * emissionFactor * heatValue * fuelAmount;
        return totalEmission;
    }
    
    // Функція для скидання форми
    function resetForm() {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = input.defaultValue;
        });
        
        document.querySelectorAll('.result-group span').forEach(span => {
            span.textContent = '-';
        });
        
        document.getElementById('totalEmission').textContent = '-';
    }
    
    // Виконуємо розрахунок при завантаженні сторінки
    calculateEmissions();
});