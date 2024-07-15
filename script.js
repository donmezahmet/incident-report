document.getElementById('incidentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const agree = document.getElementById('agree').checked;
    const disagree = document.getElementById('disagree').checked;
    
    if (disagree) {
        document.getElementById('warning').classList.remove('hidden');
    } else {
        document.getElementById('warning').classList.add('hidden');
        // Burada formun sunucuya gönderilmesi veya başka bir sayfaya yönlendirme yapılabilir
        alert("Form başarıyla gönderildi!");
    }
});
