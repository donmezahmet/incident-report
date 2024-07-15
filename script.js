const translations = {
    en: {
        title: "Report an Incident",
        intro: `You can send your questions or report incidents to Getir via Getir Speak Up. When you choose to stay anonymous, Getir cannot identify your identity and can only communicate with you via Getir Speak Up. Should you choose to provide your identity to Getir, your personal data involved in your questions or incident reports shall be processed by Getir. For further information regarding the processing of your personal data, please see the <a href="https://drive.google.com/file/d/1gnPx6v5cgvG8CF0i5tVd-YHrmMfYSc2U/view" target="_blank" data-lang="privacy">Getir Speak Up Privacy Notice</a>.`,
        privacy: "Getir Speak Up Privacy Notice",
        selectLanguage: "Select Language",
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
        submit: "Next",
        warning: "You cannot proceed without agreeing to the Terms and Conditions.",
        relationship: "Your relationship with the company *",
        currentEmployee: "Current Employee",
        formerEmployee: "Former Employee",
        nonEmployee: "Not an Employee"
    },
    tr: {
        title: "Bir Olay Bildirin",
        intro: `Sorularınızı veya olay bildirimlerinizi Getir Speak Up üzerinden Getir'e gönderebilirsiniz. Anonim kalmayı seçtiğinizde, Getir kimliğinizi tespit edemez ve sizinle yalnızca Getir Speak Up aracılığıyla iletişim kurabilir. Kimliğinizi Getir'e sağlamayı seçerseniz, sorularınızda veya olay bildirimlerinizde yer alan kişisel verileriniz Getir tarafından işlenecektir. Kişisel verilerinizin işlenmesiyle ilgili daha fazla bilgi için lütfen <a href="https://drive.google.com/file/d/1LQMqTUgPGWIbVrZmATwP8jGtF_2V5CTR/view" target="_blank" data-lang="privacy">Getir Speak Up Gizlilik Bildirimi</a>'ni inceleyin.`,
        privacy: "Getir Speak Up Gizlilik Bildirimi",
        selectLanguage: "Dil Seçin",
        terms: "Başlamadan Önce",
        agree: "Şartlar ve Koşulları okudum ve kabul ediyorum.",
        disagree: "Şartlar ve Koşulları kabul etmiyorum.",
        issueDetails: "Olay Detayları *",
        involvedParties: "Kimler dahildi? *",
        issueLocation: "Lütfen olayın nerede meydana geldiğini belirtin *",
        issueDate: "Lütfen olayın meydana geldiği tarihi belirtin (Tarih) *",
        issueTime: "Lütfen olayın meydana geldiği saati belirtin (Saat) *",
        introduce: "Kendinizi tanıtmak ister misiniz?",
        introduceYes: "Evet",
        introduceNo: "Hayır",
        fullName: "Ad Soyad",
        email: "Email *",
        gsm: "GSM",
        submit: "Sonraki",
        warning: "Şartlar ve Koşulları kabul etmeden devam edemezsiniz.",
        relationship: "Kurumla İlişkiniz *",
        currentEmployee: "Hâli Hazırda Çalışanım",
        formerEmployee: "Eski Çalışanım",
        nonEmployee: "Bu Organizasyon İçin Çalışmıyorum"
    }
};

document.getElementById('language').addEventListener('change', function() {
    const selectedLanguage = this.value;
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (key === 'intro') {
            element.innerHTML = translations[selectedLanguage][key];
        } else {
            element.innerText = translations[selectedLanguage][key];
        }
    });
});

document.getElementById('incidentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const agree = document.getElementById('agree').checked;
    const disagree = document.getElementById('disagree').checked;
    
    if (disagree) {
        document.getElementById('warning').classList.remove('hidden');
        document.getElementById('additionalQuestions').classList.add('hidden');
    } else {
        document.getElementById('warning').classList.add('hidden');
        document.getElementById('additionalQuestions').classList.remove('hidden');
        
        // Form verilerini topla
        const issueDetails = document.getElementById('issueDetails').value;
        const involvedParties = document.getElementById('involvedParties').value;
        const issueLocation = document.getElementById('issueLocation').value;
        const otherLocation = document.getElementById('otherLocation').value;
        const issueDate = document.getElementById('issueDate').value;
        const issueTime = document.getElementById('issueTime').value;

        const location = issueLocation === 'Other' ? otherLocation : issueLocation;

        const introduce = document.querySelector('input[name="introduce"]:checked').value;
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const gsm = document.getElementById('gsm').value;

        const relationship = document.querySelector('input[name="relationship"]:checked').value;

        // Verileri bir nesnede topla
        const formData = {
            issueDetails: issueDetails,
            involvedParties: involvedParties,
            location: location,
            issueDate: issueDate,
            issueTime: issueTime,
            introduce: introduce,
            fullName: introduce === 'yes' ? fullName : '',
            email: introduce === 'yes' ? email : '',
            gsm: introduce === 'yes' ? gsm : '',
            relationship: relationship
        };

        // Verileri Google Sheets'e gönder
        fetch('YOUR_DEPLOYMENT_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if(data.status === 'success') {
                alert('Form başarıyla gönderildi!');
            } else {
                alert('Form gönderilirken bir hata oluştu.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Form gönderilirken bir hata oluştu.');
        });
    }
});

document.getElementById('agree').addEventListener('change', function() {
    document.getElementById('additionalQuestions').classList.remove('hidden');
});

document.getElementById('disagree').addEventListener('change', function() {
    document.getElementById('additionalQuestions').classList.add('hidden');
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
