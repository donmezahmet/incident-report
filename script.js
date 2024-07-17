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
                formData.append('attachmentName', attachment.name);
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
                document.querySelector('.language-selector').classList.add('hidden'); // Dil seçimini gizle
                document.querySelector('.faq-container').classList.add('hidden'); // faq gizle
                document.querySelector('h1').textContent = translations[document.getElementById('language').value].successTitle;
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
    document.querySelector('h1').textContent = translations[lang].title;
    document.getElementById('successMessage').textContent = translations[lang].successMessage;
    document.getElementById('faqTitle').textContent = translations[lang].faqTitle
    document.getElementById('q1').textContent = translations[lang].q1;
    document.getElementById('a1').textContent = translations[lang].a1;
    document.getElementById('q2').textContent = translations[lang].q2;
    document.getElementById('a2').textContent = translations[lang].a2;
    document.getElementById('q3').textContent = translations[lang].q3;
    document.getElementById('a3').textContent = translations[lang].a3;
     document.getElementById('q4').textContent = translations[lang].q4;
    document.getElementById('a4').textContent = translations[lang].a4;

    // Placeholderları güncelle
    document.getElementById('issueDetails').placeholder = translations[lang].issueDetailsPlaceholder;
    document.getElementById('involvedParties').placeholder = translations[lang].involvedPartiesPlaceholder;


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
        successTitle: "Thank you for your submission!",
        successMessage: "Your report has been successfully submitted. Thank you!",
        faqTitle: "FAQ",
        q1: "What is Getir Speak Up?",
        a1: "It is a 24/7 support line where Getir employees can share 'ethical misconduct' they have observed or experienced and express their concerns. Reports received are directed to the Getir Ethics and Compliance Executive on the same day, and an investigation is initiated as soon as possible.",
        q2: "Which issues are regarded as ethical claims?",
        a2: "Employees can notify any issue contradicting Getir’s culture, ethical values, professional standards and applicable law. In this context, it is possible to report various issues such as data leak, bribery and corruption, conflicts of interest, confidential information breaches, inappropriate expense reporting, misuse of company resources for personal gain, discrimination, mobbing, anti-competitive behaviors, and violations of the company's ethical culture.",
        q3: "Do I have to reveal my identity while reporting?",
        a3: "You can either reveal your identity to communicate easily or choose to keep your personal information protected. In case you decide to reveal your identity, Getir Ethics and Compliance Executive will take necessary measures to protect your identity. Whether you reveal your identity or not will not affect the reporting procedure. Without the consent of employees their personal information or any information that might reveal their identity will not be shared with Getir or third-party individuals. ",
        q4: "Will there be any negative consequences for me after I report an issue?",
        a4: "Getir values the support of its employees in detecting inconsistencies. There will not be any ramifications (discrimination, loss of rights, intimidation, etc.) to those who report their claims honestly and out of goodwill. However, those who intentionally report false claims will be held accountable. ",
        issueDetailsPlaceholder: "Please provide all details related to the alleged violation, including the locations where the incident occurred, witnesses to the incident, an assessment of the situation, and any other information that might be useful for evaluating and correcting the issue. Take your time and provide as much detail as possible; however, if you do not wish to disclose your name, be careful not to include any details that could reveal your identity. If you are the only person aware of this situation, it may be necessary for us to know.",
        involvedPartiesPlaceholder: "Please specify the identity of the person(s) engaged in this behavior."
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
        successTitle: "Başvurunuz İçin Teşekkürler!",
        successMessage: "Bildiriminiz başarıyla gönderildi. Teşekkürler!",
        faqTitle: "Sıkça Sorulan Sorular",
        q1: "Getir Speak Up nedir?",
        a1: "Getir çalışanlarının gözlemledikleri veya maruz kaldıkları 'etik uygunsuzlukları' paylaşabilecekleri, endişelerini dile getirebilecekleri, 7/24 hizmet veren bir destek hattıdır. Gelen bildirimler aynı gün Getir Etik ve Uyum Yöneticisine raporlanır ve en kısa sürede konuya ilişkin inceleme başlatılır.",
        q2: "Hangi konularda etik bildirimde bulunulur?",
        a2: "Getir kültürüne, Getir etik değerlerine, profesyonel standartlara ve ilgili yasalara aykırı olduğunu düşündüğünüz her durumu bildirebilirsiniz. Bu kapsamda veri sızıntısı, rüşvet ve yolsuzluk, çıkar çatışması, gizli bilgi ihlali, uygunsuz gider bildirimi, kurum kaynaklarını kişisel çıkarlar için kullanma, ayrımcılık, mobbing, rekabete aykırı davranışlar, şirket etik kültürüne aykırılık gibi birçok başlıkta bildirimde bulunulması mümkündür.",
        q3: "Bildirimde bulunurken ismimi açıklamak zorunda mıyım?",
        a3: "Getir Speak Up'a bir bildirimde bulunduğunuz zaman, iletişimi kolaylaştırması açısından kimliğinizi açıklamayı ya da kimliğinizi saklı tutmayı tercih edebilirsiniz. Kimliğinizi açıklamanız halinde incelemeyi yapacak olan Getir Etik ve Uyum Yöneticisi kimliğinizi saklı tutmak için her türlü önlemi alacaktır. Bildiriminizin değerlendirilmeye alınması bakımından kimliğinizi açıklayıp açıklamamanızın sürecin işleyişine herhangi bir olumsuz etkisi bulunmayacaktır. Bildirimde bulunan kişinin rızası olmaksızın, hiçbir şekilde kimlik bilgileri ya da kimliğini ortaya çıkarabilecek herhangi bir bilgi Getir veya 3. şahıslar ile paylaşılmaz.",
        q4: "Bildirimde bulunduğum için bir zarar görür müyüm?",
        a4: "Getir, bir sorunun ortaya çıkarılması için katkıda bulunan Getirlilerin yardımına değer verir. Dürüst ve iyi niyetli bir şekilde bildirimde çalışanlara herhangi bir misilleme (ayrımcılık, hak kaybı, tehdit vb. eylemler) yapılamaz. Ancak bilerek yanlış/asılsız bir suçlamada bulunanlar sorumlu tutulacaktır.",
        issueDetailsPlaceholder: "İddiaya konu olan ihlal ile ilgili tüm ayrıntıları sağlayın, olayın gerçekleştiği yerler, olayın tanıkları, durumun değerlendirmesi ve sorunun değerlendirilmesi ve düzeltilmesi için yararlı olabilecek diğer bilgiler dahil. Zamanınızı ayırın ve mümkün olduğunca fazla ayrıntı sağlayın; ancak, adınızı açıklamak istemiyorsanız, kimliğinizi açığa çıkarabilecek ayrıntıları eklememeye dikkat edin. Bu durumdan haberdar olan tek kişi sizseniz, bunu bilmemiz gerekebilir.",
        involvedPartiesPlaceholder: "Bu davranışta bulunan kişi(ler)in kimliğini belirtin."
    }
};
