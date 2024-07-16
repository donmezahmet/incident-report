document.getElementById('incidentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const agree = document.getElementById('agree').checked;
    const disagree = document.getElementById('disagree').checked;

    if (disagree) {
        document.getElementById('warning').classList.remove('hidden');
        document.getElementById('additionalQuestions').classList.add('hidden');
        return;
    } else {
        document.getElementById('warning').classList.add('hidden');
        document.getElementById('additionalQuestions').classList.remove('hidden');
        
        // Loading animasyonu göster
        document.getElementById('loading').classList.remove('hidden');
        document.querySelector('.container').style.opacity = '0.5';
        
        // Form verilerini topla
        const issueDetails = document.getElementById('issueDetails').value;
        const involvedParties = document.getElementById('involvedParties').value;
        const issueLocation = document.getElementById('issueLocation').value;
        const otherLocation = document.getElementById('otherLocation').value;
        const issueDate = document.getElementById('issueDate').value;
        const issueTime = document.getElementById('issueTime').value;

        const location = issueLocation === 'Other' ? otherLocation : issueLocation;

        const introduce = document.querySelector('input[name="introduce"]:checked').value;
        const fullName = document.getElementById('fullName').value || '';
        const email = document.getElementById('email').value || '';
        const gsm = document.getElementById('gsm').value || '';

        const relationship = document.querySelector('input[name="relationship"]:checked').value;

        // Unique ticket number oluştur
        const ticketNumber = 'TICKET-' + Date.now();

        // Verileri bir nesnede topla
        const formData = new FormData();
        formData.append('issueDetails', issueDetails);
        formData.append('involvedParties', involvedParties);
        formData.append('location', location);
        formData.append('issueDate', issueDate);
        formData.append('issueTime', issueTime);
        formData.append('introduce', introduce);
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('gsm', gsm);
        formData.append('relationship', relationship);
        formData.append('ticketNumber', ticketNumber);

        const attachment = document.getElementById('attachment').files[0];
        if (attachment) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result.split(',')[1];
                formData.append('attachment', base64data);
                formData.append('attachmentName', `TICKET-${ticketNumber}_${attachment.name}`);
                formData.append('attachmentType', attachment.type);

                // Dosya yükleme işlemi
                fetch('https://script.google.com/macros/s/AKfycbycTedLyfNKg6uFkPGWi5_4DyYwoE3DaSu634NSXQUK2dR-2tUJy9at1g-QGtzACEpT5Q/exec?', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(data => {
                    console.log("File upload response:", data);
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                });
            }
            reader.readAsDataURL(attachment);
        }

        // Verileri Google Sheets'e gönder
        fetch('https://script.google.com/macros/s/AKfycbzAi4aOvCNaEbkbVV4WEQ-e2gLgvCpge2mL-2K6amnaV7CqeVW9uPDIPloPflqgxPdP/exec?' + new URLSearchParams(formData), {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response received:", data);
            document.getElementById('loading').classList.add('hidden');
            document.querySelector('.container').style.opacity = '1';
            if (data.status === 'success') {
                document.getElementById('incidentForm').classList.add('hidden');
                document.getElementById('introText').classList.add('hidden'); // Intro metnini gizle
                document.getElementById('successMessage').classList.remove('hidden');
            } else {
                alert('Form gönderilirken bir hata oluştu: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('loading').classList.add('hidden');
            document.querySelector('.container').style.opacity = '1';
            alert('Form gönderilirken bir hata oluştu.');
        });
    }
});

document.getElementById('agree').addEventListener('change', function() {
    document.getElementById('additionalQuestions').classList.remove('hidden');
    document.getElementById('submitBtn').classList.remove('hidden');
    document.getElementById('warning').classList.add('hidden');
});

document.getElementById('disagree').addEventListener('change', function() {
    document.getElementById('additionalQuestions').classList.add('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('warning').classList.remove('hidden');
});

document.getElementById('issueLocation').addEventListener('change', function() {
    const otherLocationField = document.getElementById('otherLocation');
    if (this.value === 'Other') {
        otherLocationField.classList.remove('hidden');
    } else {
        otherLocationField.classList.add('hidden');
    }
});

document.getElementById('introduceYes').addEventListener('change', function() {
    document.getElementById('personalInfo').classList.remove('hidden');
    document.getElementById('email').setAttribute('required', 'required');
});

document.getElementById('introduceNo').addEventListener('change', function() {
    document.getElementById('personalInfo').classList.add('hidden');
    document.getElementById('email').removeAttribute('required');
});

// Dil değiştirme
document.getElementById('language').addEventListener('change', function() {
    const lang = this.value;
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.innerHTML = translations[lang][el.getAttribute('data-lang')];
    });
});

const translations = {
    en: {
        selectLanguage: "Select Language",
        title: "Report an Incident",
        intro: "You can send your questions or report incidents to Getir via Getir Speak Up. When you choose to stay anonymous, Getir cannot identify your identity and can only communicate with you via Getir Speak Up. Should you choose to provide your identity to Getir, your personal data involved in your questions or incident reports shall be processed by Getir. For further information regarding the processing of your personal data, please see the <a id='privacy-link' href='https://drive.google.com/file/d/1gnPx6v5cgvG8CF0i5tVd-YHrmMfYSc2U/view' target='_blank'>Getir Speak Up Privacy Notice</a>.",
        terms: "Before Getting Started",
        agree: "I have read and agree to the Terms and Conditions.",
        disagree: "I do not agree to the Terms and Conditions.",
        issueDetails: "Issue Details *",
        involvedParties: "Who was involved? *",
        issueLocation: "Please indicate where the issue occurred *",
        issueDate: "Please indicate when the issue occurred (Date) *",
        issueTime: "Please indicate when the issue occurred (Time) *",
        introduce: "Would you like to introduce yourself?",
        introduceYes: "Yes",
        introduceNo: "No",
        fullName: "Full Name",
        email: "Email *",
        gsm: "GSM",
        relationship: "Your relationship with the company *",
        currentEmployee: "Current Employee",
        formerEmployee: "Former Employee",
        nonEmployee: "Not an Employee",
        submit: "Submit",
        warning: "You cannot proceed without agreeing to the Terms and Conditions.",
        successMessage: "Your report has been successfully submitted. Thank you!"
    },
    tr: {
        selectLanguage: "Dil Seçiniz",
        title: "Bir Olay Bildirin",
        intro: "Sorularınızı gönderebilir veya Getir'e Getir Speak Up üzerinden olayları bildirebilirsiniz. Anonim kalmayı tercih ettiğinizde, Getir kimliğinizi belirleyemez ve yalnızca Getir Speak Up üzerinden sizinle iletişim kurabilir. Kimliğinizi Getir'e sağlamayı tercih ederseniz, sorularınızda veya olay raporlarınızda yer alan kişisel verileriniz Getir tarafından işlenecektir. Kişisel verilerinizin işlenmesiyle ilgili daha fazla bilgi için lütfen <a id='privacy-link' href='https://drive.google.com/file/d/1LQMqTUgPGWIbVrZmATwP8jGtF_2V5CTR/view' target='_blank'>Getir Speak Up Gizlilik Bildirimini</a> okuyun.",
        terms: "Başlamadan Önce",
        agree: "Şartlar ve Koşulları okudum ve kabul ediyorum.",
        disagree: "Şartlar ve Koşulları kabul etmiyorum.",
        issueDetails: "Olay Detayları *",
        involvedParties: "Kimler Dahil Oldu? *",
        issueLocation: "Lütfen olayın nerede gerçekleştiğini belirtin *",
        issueDate: "Lütfen olayın gerçekleştiği tarihi belirtin (Tarih) *",
        issueTime: "Lütfen olayın gerçekleştiği zamanı belirtin (Zaman) *",
        introduce: "Kendinizi tanıtmak ister misiniz?",
        introduceYes: "Evet",
        introduceNo: "Hayır",
        fullName: "Tam Adı",
        email: "Email *",
        gsm: "GSM",
        relationship: "Şirketle olan ilişkiniz *",
        currentEmployee: "Mevcut Çalışan",
        formerEmployee: "Eski Çalışan",
        nonEmployee: "Çalışan Değil",
        submit: "Gönder",
        warning: "Şartlar ve Koşulları kabul etmeden devam edemezsiniz.",
        successMessage: "Bildiriminiz başarıyla gönderildi. Teşekkürler!"
    }
};
