document.getElementById('emiCalculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const loanTenure = parseFloat(document.getElementById('loanTenure').value);

    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTenure * 12;

    const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    document.getElementById('monthlyEmi').textContent = emi.toFixed(2);
    document.getElementById('totalInterest').textContent = totalInterest.toFixed(2);
    document.getElementById('totalPayment').textContent = totalPayment.toFixed(2);

    // Update 3D Pie Chart
    updateChart(loanAmount, totalInterest);

    // Generate Amortization Schedule
    generateAmortizationSchedule(loanAmount, interestRate, loanTenure, emi);
});

function updateChart(principal, interest) {
    const ctx = document.getElementById('emiChart').getContext('2d');
    if (window.emiChart) {
        window.emiChart.destroy();
    }
    window.emiChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#007bff', '#ffc107'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'EMI Breakdown'
                }
            }
        }
    });
}

function generateAmortizationSchedule(loanAmount, interestRate, loanTenure, emi) {
    const tableBody = document.querySelector('#amortizationTable tbody');
    tableBody.innerHTML = '';
    let balance = loanAmount;
    const monthlyInterestRate = (interestRate / 100) / 12;
    for (let i = 1; i <= loanTenure * 12; i++) {
        const interest = balance * monthlyInterestRate;
        const principal = emi - interest;
        balance -= principal;
        const row = `<tr>
            <td>${i}</td>
            <td>${principal.toFixed(2)}</td>
            <td>${interest.toFixed(2)}</td>
            <td>${balance.toFixed(2)}</td>
        </tr>`;
        tableBody.innerHTML += row;
    }
}

document.getElementById('downloadReport').addEventListener('click', function() {
    const doc = new jspdf.jsPDF();
    doc.text('EMI Calculator Report', 10, 10);
    doc.autoTable({ html: '#amortizationTable' });
    doc.save('emi_report.pdf');
});

document.getElementById('loanAmount').addEventListener('input', function() {
    document.getElementById('loanAmountValue').textContent = this.value.toLocaleString();
});

document.getElementById('interestRate').addEventListener('input', function() {
    document.getElementById('interestRateValue').textContent = this.value;
});

document.getElementById('loanTenure').addEventListener('input', function() {
    document.getElementById('loanTenureValue').textContent = this.value;
});
