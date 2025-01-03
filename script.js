document.addEventListener("DOMContentLoaded", function () {

    const auditYes = document.getElementById('auditYes');
    const auditNo = document.getElementById('auditNo');
    const auditWarning = document.getElementById('auditWarning');

    // 'auditYes' seçildiğinde uyarıyı göster
    if (auditYes) {
        auditYes.addEventListener('change', function () {
            if (auditYes.checked) {
                auditWarning.classList.remove('hidden'); // Uyarıyı göster
            }
        });
    }

    // 'auditNo' seçildiğinde uyarıyı gizle
    if (auditNo) {
        auditNo.addEventListener('change', function () {
            if (auditNo.checked) {
                auditWarning.classList.add('hidden'); // Uyarıyı gizle
            }
        });
    }

    // Sayfanın dilini doğru şekilde alıyoruz
    let language = document.documentElement.lang;  // HTML lang attribute'undan dil bilgisini alıyoruz
    console.log("Language:", language);  // Sayfa dilini konsola yazdırıyoruz

    // Success message'ı burada kontrol edelim
    const successMessageElement = document.querySelector('#successMessage');

    // Dil değişikliği işlemleri
    document.getElementById('trFlag').addEventListener('click', function () {
        window.location.href = window.location.pathname.replace('new_home.html', 'new_home_tr.html');
    });

    document.getElementById('enFlag').addEventListener('click', function () {
        window.location.href = window.location.pathname.replace('new_home_tr.html', 'new_home.html');
    });

    // Form submit işlemi
    document.getElementById('incidentForm').addEventListener('submit', function (event) {
        event.preventDefault();

        // Form gönderildiğinde, sayfanın dilini konsola yazdırıyoruz
        console.log("Language:", language);

        // "internalAudit" seçeneklerinin kontrolü
        const internalAuditYesChecked = auditYes.checked;
        const internalAuditNoChecked = auditNo.checked;

        // Eğer her iki seçenek de işaretlenmemişse, hata mesajı göster
        if (!internalAuditYesChecked && !internalAuditNoChecked) {
            alert("Lütfen 'Evet' veya 'Hayır' seçeneğini işaretleyin.");
            return;
        }

        const internalAudit = internalAuditYesChecked ? 'yes' : 'no';
        const formData = new FormData();

        formData.append('internalAuditYes', internalAudit === 'yes' ? 'yes' : 'no');

        const agree = document.getElementById('agree').checked;
        const disagree = document.getElementById('disagree').checked;

        // Terms and Conditions kontrolü
        if (disagree) {
            document.getElementById('warning').classList.remove('hidden');
            document.getElementById('additionalQuestions').classList.add('hidden');
            return;
        } else {
            document.getElementById('warning').classList.add('hidden');
            document.getElementById('additionalQuestions').classList.remove('hidden');

            // Loading animasyonunu göster
            document.getElementById('loading').classList.remove('hidden');
            document.querySelector('.container').style.opacity = '0.5';

            // Form verilerini topla
            const issueDetails = document.getElementById('issueDetails').value;
            const involvedParties = document.getElementById('involvedParties').value;
            const issueLocation = document.getElementById('issueLocation').value;
            const otherLocation = document.getElementById('otherLocation').value;
            const incidentDuration = document.getElementById('incidentDuration').value;
            const ongoing = document.getElementById('ongoing').value;
            const issueDate = document.getElementById('issueDate').value;
            const issueTime = document.getElementById('issueTime').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;

            const location = issueLocation === 'Other' ? otherLocation : issueLocation;
            const introduce = document.querySelector('input[name="introduce"]:checked').value;
            const fullName = document.getElementById('fullName').value || '';
            const email = document.getElementById('email').value || '';
            const gsm = document.getElementById('gsm').value || '';
            const relationship = document.getElementById('relationship').value;
            const securityQuestion = document.getElementById('securityQuestion').value;
            const securityAnswer = document.getElementById('securityAnswer').value;

            // Unique ticket number oluştur
            const ticketNumber = 'TICKET-' + Date.now();

            // Verileri formData'ya ekle
            formData.append('issueDetails', issueDetails);
            formData.append('involvedParties', involvedParties);
            formData.append('location', location);
            formData.append('incidentDuration', incidentDuration);
            formData.append('ongoing', ongoing);
            formData.append('issueDate', issueDate);
            formData.append('issueTime', issueTime);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('introduce', introduce);
            formData.append('internalAudit', internalAudit);
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('gsm', gsm);
            formData.append('relationship', relationship);
            formData.append('securityQuestion', securityQuestion);
            formData.append('securityAnswer', securityAnswer);
            formData.append('ticketNumber', ticketNumber);

            // Anonim kalmayı seçerse e-posta adresini ekle
            if (introduce === 'no') {
                const contactEmail = document.getElementById('contactEmail').value || '';
                formData.append('contactEmail', contactEmail);
            }

            // Dosya yükleme işlemi
            const attachments = document.getElementById('attachment').files;

            if (attachments.length > 0) {
                let uploadPromises = [];

                for (let i = 0; i < attachments.length; i++) {
                    const attachment = attachments[i];
                    const reader = new FileReader();

                    const uploadPromise = new Promise((resolve, reject) => {
                        reader.onloadend = function () {
                            const base64data = reader.result.split(',')[1];
                            const fileData = new FormData();
                            fileData.append('attachment', base64data);
                            fileData.append('attachmentName', attachment.name);
                            fileData.append('attachmentType', attachment.type);
                            fileData.append('ticketNumber', ticketNumber);

                            fetch('https://script.google.com/macros/s/AKfycbxSrzlR3YJ8I10HG_JglvnSODvcPFZN33yioNsNMLU3v4n18-Sl_YuK1jXokX_vSTYsQQ/exec?', {
                                method: 'POST',
                                body: fileData
                            })
                                .then(response => response.text())
                                .then(data => {
                                    console.log("File upload response:", data);
                                    resolve();
                                })
                                .catch(error => {
                                    console.error('Error uploading file:', error);
                                    reject();
                                });
                        };
                        reader.readAsDataURL(attachment);
                    });

                    uploadPromises.push(uploadPromise);
                }

                Promise.all(uploadPromises).then(() => {
                    // API'ye veri gönder
                    const sheetUrl = internalAuditYesChecked
                        ? 'https://script.google.com/macros/s/AKfycbwcVqnhIjn6Bgq1ZpPQ-zBdgAWovNAbIPXIzfwp5Qs5bszhzoB31lNYh6ohPb9JoozT/exec?' // Audit Yes
                        : 'https://script.google.com/macros/s/AKfycbzU_ChlJFnM1ifaKcUy7-a155J6ia5QlRkxl1alq6yybSbvGkY6o1CRsuUF8OZyJQ/exec?'; // Audit No

                    fetch(sheetUrl + '?' + new URLSearchParams(formData), {
                        method: 'POST',
                        mode: 'cors',
                        body: formData
                    })
                        .then(response => {
                            console.log("API response received", response);
                            return response.json();
                        })
                        .then(data => {
                            console.log("Response received:", data);
                            document.getElementById('loading').classList.add('hidden');
                            document.querySelector('.container').style.opacity = '1';
                            if (data.status === 'success') {
                                document.getElementById('incidentForm').classList.add('hidden');
                                document.getElementById('introText').classList.add('hidden');
                                document.getElementById('successMessage').classList.remove('hidden');
                                document.querySelector('.language-selector').classList.add('hidden');
                                document.querySelector('.faq-container').classList.add('hidden');
                                document.querySelector('h1').textContent = translations[language].successTitle;
                                const successMessage = translations[language].successMessage + ' ' + translations[language].ticketNumber + ticketNumber + '. ' + translations[language].checkStatus;
                                const successMessageElement = document.getElementById('successMessage');
                                successMessageElement.innerHTML = successMessage;
                                 const space = document.createElement('br');
                            successMessageElement.appendChild(space);
                                const homeButton = document.createElement('button');
                                homeButton.id = 'homeButton';
                                homeButton.textContent = translations[language].goToHomePage;
                                homeButton.onclick = function() {
                                    window.location.href = 'index.html';
                                };
                                successMessageElement.appendChild(homeButton);
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

                    return;
                }).catch(() => {
                    alert('Dosyalar yüklenirken bir hata oluştu.');
                    document.getElementById('loading').classList.add('hidden');
                    document.querySelector('.container').style.opacity = '1';
                });
            } else {
                // Dosya yoksa sadece form verilerini gönder
                const sheetUrl = internalAuditYesChecked
                    ? 'https://script.google.com/macros/s/AKfycbwcVqnhIjn6Bgq1ZpPQ-zBdgAWovNAbIPXIzfwp5Qs5bszhzoB31lNYh6ohPb9JoozT/exec?' // Audit Yes
                    : 'https://script.google.com/macros/s/AKfycbzU_ChlJFnM1ifaKcUy7-a155J6ia5QlRkxl1alq6yybSbvGkY6o1CRsuUF8OZyJQ/exec?'; // Audit No

                fetch(sheetUrl + '?' + new URLSearchParams(formData), {
                    method: 'POST',
                    mode: 'cors',
                    body: formData
                })
                    .then(response => {
                        console.log("API response received", response);
                        return response.json();
                    })
                    .then(data => {
                        console.log("Response received:", data);
                        document.getElementById('loading').classList.add('hidden');
                        document.querySelector('.container').style.opacity = '1';
                        if (data.status === 'success') {
                            document.getElementById('incidentForm').classList.add('hidden');
                            document.getElementById('introText').classList.add('hidden');
                            document.getElementById('successMessage').classList.remove('hidden');
                            document.querySelector('.language-selector').classList.add('hidden');
                            document.querySelector('.faq-container').classList.add('hidden');
                            document.querySelector('h1').textContent = translations[language].successTitle;
                            const successMessage = translations[language].successMessage + ' ' + translations[language].ticketNumber + ticketNumber + '. ' + translations[language].checkStatus;
                            const successMessageElement = document.getElementById('successMessage');
                            successMessageElement.innerHTML = successMessage;
                            const space = document.createElement('br');
                            successMessageElement.appendChild(space);
                            const homeButton = document.createElement('button');
                            console.log(language);
                            homeButton.id = 'homeButton';
                            homeButton.textContent = translations[language].goToHomePage;
                            homeButton.onclick = function() {
                                window.location.href = 'index.html';
                            };
                            successMessageElement.appendChild(homeButton);
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
        }
    });
});

// "Introduce" ve "Employee Name" kısmının işleyişi burada...


document.getElementById('agree').addEventListener('change', function () {
    document.getElementById('additionalQuestions').classList.remove('hidden');
    document.getElementById('submitBtn').classList.remove('hidden');
    document.getElementById('warning').classList.add('hidden');
});

document.getElementById('disagree').addEventListener('change', function () {
    document.getElementById('additionalQuestions').classList.add('hidden');
    document.getElementById('submitBtn').classList.add('hidden');
    document.getElementById('warning').classList.remove('hidden');
});

document.getElementById('issueLocation').addEventListener('change', function () {
    const otherLocationField = document.getElementById('otherLocation');
    if (this.value === 'Other') {
        otherLocationField.classList.remove('hidden');
    } else {
        otherLocationField.classList.add('hidden');
    }
});

document.getElementById('introduceYes').addEventListener('change', function () {
    document.getElementById('personalInfo').classList.remove('hidden');
    document.getElementById('email').setAttribute('required', 'required');
    document.getElementById('contactEmail').classList.add('hidden');
    document.getElementById('anonymousWarning').classList.add('hidden');
});

document.getElementById('introduceNo').addEventListener('change', function () {
    document.getElementById('personalInfo').classList.add('hidden');
    document.getElementById('email').removeAttribute('required');
    document.getElementById('contactEmail').classList.remove('hidden');
    document.getElementById('anonymousWarning').classList.remove('hidden');
});

document.getElementById('incidentDuration').addEventListener('change', function () {
    const dateQuestions = document.getElementById('dateQuestions');
    const ongoingQuestion = document.getElementById('ongoingQuestion');
    const dateRangeQuestions = document.getElementById('dateRangeQuestions');
    const timeQuestion = document.getElementById('timeQuestion');

    dateQuestions.classList.add('hidden');
    ongoingQuestion.classList.add('hidden');
    dateRangeQuestions.classList.add('hidden');
    timeQuestion.classList.add('hidden');

    document.getElementById('issueDate').removeAttribute('required');
    document.getElementById('ongoing').removeAttribute('required');
    document.getElementById('startDate').removeAttribute('required');
    document.getElementById('endDate').removeAttribute('required');
    document.getElementById('issueTime').removeAttribute('required');

    if (this.value === 'once') {
        dateQuestions.classList.remove('hidden');
        timeQuestion.classList.remove('hidden');
        document.getElementById('issueDate').setAttribute('required', 'required');
        document.getElementById('issueTime').setAttribute('required', 'required');
    } else if (this.value === 'period') {
        ongoingQuestion.classList.remove('hidden');
        document.getElementById('ongoing').setAttribute('required', 'required');
    }
});

document.getElementById('ongoing').addEventListener('change', function () {
    const dateQuestions = document.getElementById('dateQuestions');
    const dateRangeQuestions = document.getElementById('dateRangeQuestions');
    const timeQuestion = document.getElementById('timeQuestion');

    dateQuestions.classList.add('hidden');
    dateRangeQuestions.classList.add('hidden');
    timeQuestion.classList.add('hidden');

    document.getElementById('issueDate').removeAttribute('required');
    document.getElementById('startDate').removeAttribute('required');
    document.getElementById('endDate').removeAttribute('required');
    document.getElementById('issueTime').removeAttribute('required');

    if (this.value === 'yes') {
        dateQuestions.classList.remove('hidden');
        timeQuestion.classList.remove('hidden');
        document.getElementById('issueDate').setAttribute('required', 'required');
        document.getElementById('issueTime').setAttribute('required', 'required');
    } else if (this.value === 'no') {
        dateRangeQuestions.classList.remove('hidden');
        document.getElementById('startDate').setAttribute('required', 'required');
        document.getElementById('endDate').setAttribute('required', 'required');
    }
});

// Hata mesajını sayfa yüklendiğinde ekle
window.addEventListener('DOMContentLoaded', (event) => {
    addErrorMessage();
    const selectElement = document.getElementById('relationship');
    if (selectElement.value === "") {
        selectElement.style.color = 'gray';
    }

    document.getElementById('timeQuestion').classList.add('hidden');

});

function addErrorMessage() {
    const errorMessages = document.querySelectorAll('.errorMessages');
    errorMessages.forEach(el => el.remove());

    const securityQuestionDiv = document.getElementById('securityQuestion');
    if (!securityQuestionDiv) {
        console.error("securityQuestion element not found");
        return; // Exit if the element is not found
    }

    const errorMessage = translations[language].errorMessage;
    const errorMessageElement = document.createElement('div');
    errorMessageElement.className = 'errorMessages';
    errorMessageElement.style.color = 'red';
    errorMessageElement.innerHTML = errorMessage;

    securityQuestionDiv.appendChild(errorMessageElement);
}

// Başlangıçta dil değişkenini tanımlayın
let language = 'en'; // Varsayılan dil İngilizce
 // Bayrak ikonlarına event listener ekleyerek dil değişimini sağla
     document.getElementById('trFlag').addEventListener('click', function () {
        changeLanguage('tr');
         changeLanguage(language);
    
    });


  document.getElementById('enFlag').addEventListener('click', function () {
        changeLanguage('en');
         changeLanguage(language);
    
    });


 // Dil değişikliği sırasında metinleri güncelleyen fonksiyon
    function changeLanguage(lang) {
        // Sayfadaki tüm 'data-lang' özelliğine sahip öğeleri güncelle
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.innerHTML = translations[lang][el.getAttribute('data-lang')];
        });
    document.querySelector('h1').textContent = translations[lang].title;
      document.querySelector('#successMessage').textContent = translations[lang].successMessage;
    document.getElementById('faqTitle').textContent = translations[lang].faqTitle;
    document.getElementById('q1').textContent = translations[lang].q1;
    document.getElementById('a1').textContent = translations[lang].a1;
    document.getElementById('q2').textContent = translations[lang].q2;
    document.getElementById('a2').textContent = translations[lang].a2;
    document.getElementById('q3').textContent = translations[lang].q3;
    document.getElementById('a3').textContent = translations[lang].a3;
    document.getElementById('q4').textContent = translations[lang].q4;
    document.getElementById('a4').textContent = translations[lang].a4;
    // document.getElementById('anonymousWarning').textContent = translations[lang].anonymousWarning;
    document.getElementById('securityQuestionLabel').textContent = translations[lang].securityQuestion;
    document.getElementById('securityAnswer').placeholder = translations[lang].securityAnswerPlaceholder;


    // Security Question Options
    const securityQuestionSelect = document.getElementById('securityQuestion');
    securityQuestionSelect.innerHTML = `
    <option value="" disabled selected>${translations[lang].choose}</option>
    <option value="firstPet">${translations[lang].firstPet}</option>
    <option value="motherMaiden">${translations[lang].motherMaiden}</option>
    <option value="firstSchool">${translations[lang].firstSchool}</option>
    <option value="favoriteTeacher">${translations[lang].favoriteTeacher}</option>
    <option value="birthCity">${translations[lang].birthCity}</option>
`;


    const anonymousWarningElement = document.getElementById('anonymousWarning');
    anonymousWarningElement.querySelector('p').innerHTML = translations[lang].anonymousWarning;
    anonymousWarningElement.querySelector('p').style.color = 'red'; // Rengi kırmızı olarak ayarla
    anonymousWarningElement.querySelector('p').style.fontStyle = 'italic'; // İtalik yap

    // Placeholderları güncelle
    document.getElementById('issueDetails').placeholder = translations[lang].issueDetailsPlaceholder;
    document.getElementById('involvedParties').placeholder = translations[lang].involvedPartiesPlaceholder;
    document.getElementById('otherLocation').placeholder = translations[lang].otherPlaceholder;
    document.getElementById('contactEmail').placeholder = translations[lang].contactEmailPlaceholder; // Yeni eklenen satır
    const relationshipSelect = document.getElementById('relationship');
    relationshipSelect.querySelector('option[value=""]').textContent = translations[lang].choose;
    relationshipSelect.querySelector('option[value="otherrelation"]').textContent = translations[lang].otherrelation;
    document.querySelector('[data-lang="attachment"]').innerHTML = translations[lang].attachment;
    document.getElementById('otherrelationtext').placeholder = translations[lang].otherPlaceholder;

    // Hata mesajını güncelle
    addErrorMessage();
};

// Relationship dropdown değiştiğinde diğer seçeneği göster
document.getElementById('relationship').addEventListener('change', function () {
    const otherRelationshipField = document.getElementById('otherrelationtext');
    if (this.value === 'otherrelation') {
        otherRelationshipField.classList.remove('hidden');
    } else {
        otherRelationshipField.classList.add('hidden');
    }
});

// FAQ toggle işlemi
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const allAnswers = document.querySelectorAll('.faq-answer');

        allAnswers.forEach(ans => {
            if (ans !== answer) {
                ans.style.display = 'none';
            }
        });

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
        } else {
            answer.style.display = 'block';
        }
    });
});

// Relationship select rengini ayarla
document.getElementById('relationship').addEventListener('change', function () {
    if (this.value === "") {
        this.style.color = 'gray';
    } else {
        this.style.color = 'black';
    }
});

// Add event listener for home button
document.getElementById('homeButton').addEventListener('click', function () {
    window.location.href = 'index.html';
});

const translations = {
    en: {
        selectLanguage: "",
        title: "Report an Incident",
        intro: "You can send your questions or report incidents to Getir via Getir Speak Up. When you choose to stay anonymous, Getir cannot identify your identity and can only communicate with you via Getir Speak Up. Should you choose to provide your identity to Getir, your personal data involved in your questions or incident reports shall be processed by Getir. For further information regarding the processing of your personal data, please see the <a id='privacy-link' href='https://drive.google.com/file/d/1gnPx6v5cgvG8CF0i5tVd-YHrmMfYSc2U/view' target='_blank'>Getir Speak Up Privacy Notice</a>.",
        terms: "Before Getting Started",
        agree: "I have read and agree to the Terms and Conditions.",
        disagree: "I do not agree to the Terms and Conditions.",
        issueDetails: "Issue Details",
        involvedParties: "Who was involved?*",
        issueLocation: "Please indicate where the issue occurred*",
        issueDate: "Please indicate when the issue occurred (Date)",
        issueTime: "Please indicate when the issue occurred (Time)",
        introduce: "Would you like to introduce yourself?",
        introduceYes: "Yes",
        introduceNo: "No",
        fullName: "Full Name",
        email: "Email *",
        gsm: "GSM",
        relationship: "Your relationship with the company",
        currentEmployee: "Current Employee",
        formerEmployee: "Former Employee",
        nonEmployee: "Not an Employee",
        submit: "Submit",
        warning: "You cannot proceed without agreeing to the Terms and Conditions.",
        successTitle: "Thank you for your submission!",
        successMessage: "Your report has been successfully submitted. Thank you!",
        ticketNumber: "Your ticket number is ",
        checkStatus: "You can check the status of your ticket using this number.",
        faqTitle: "FAQ",
        q1: "What is Getir Speak Up?",
        a1: "It is a 24/7 support line where Getir employees can share 'ethical misconduct' they have observed or experienced and express their concerns. Reports received are directed to the Getir Ethics and Compliance Executive on the same day, and an investigation is initiated as soon as possible.",
        q2: "Which issues are regarded as ethical claims?",
        a2: "Employees can notify any issue contradicting Getir’s culture, ethical values, professional standards and applicable law. In this context, it is possible to report various issues such as data leak, bribery and corruption, conflicts of interest, confidential information breaches, inappropriate expense reporting, misuse of company resources for personal gain, discrimination, mobbing, anti-competitive behaviors, and violations of the company's ethical culture.",
        q3: "Do I have to reveal my identity while reporting?",
        a3: "You can either reveal your identity to communicate easily or choose to keep your personal information protected. In case you decide to reveal your identity, Getir Ethics and Compliance Executive will take necessary measures to protect your identity. Whether you reveal your identity or not will not affect the reporting procedure. Without the consent of employees their personal information or any information that might reveal their identity will not be shared with Getir or third-party individuals.",
        q4: "Will there be any negative consequences for me after I report an issue?",
        a4: "Getir values the support of its employees in detecting inconsistencies. There will not be any ramifications (discrimination, loss of rights, intimidation, etc.) to those who report their claims honestly and out of goodwill. However, those who intentionally report false claims will be held accountable.",
        issueDetailsPlaceholder: "Please provide all details related to the alleged violation, including the locations where the incident occurred, witnesses to the incident, an assessment of the situation, and any other information that might be useful for evaluating and correcting the issue. Take your time and provide as much detail as possible; however, if you do not wish to disclose your name, be careful not to include any details that could reveal your identity. If you are the only person aware of this situation, it may be necessary for us to know.",
        involvedPartiesPlaceholder: "Please specify the identity of the person(s) engaged in this behavior.",
        contactEmailPlaceholder: "Your Email (optional)",
        supplier: "Supplier",
        franchisee: "Franchisee",
        contractor: "Contractor",
        subcontractor: "Subcontractor",
        noDeclaration: "I don't want to declare",
        goToHomePage: "Go to Home Page",
        Turkey: "Turkey",
        Netherlands: "Netherlands",
        Germany: "Germany",
        France: "France",
        Spain: "Spain",
        UK: "United Kingdom",
        US: "US",
        other: "Other",
        choose: "Choose",
        otherPlaceholder: "Please specify",
        attachment: "Please attach any supporting evidence documents...",
        incidentDuration: "What is the duration of the incident?*",
        once: "It happened once",
        period: "Over a period of time",
        ongoing: "Is it still ongoing?",
        yes: "Yes",
        no: "No",
        otherrelation: "Other",
        startDate: "Start Date",
        endDate: "End Date",
        securityQuestion: "Security Question (Required for ticket status tracking)",
        firstPet: "What is the name of your first pet?",
        motherMaiden: "What is your mother's maiden name?",
        firstSchool: "What is the name of your first school?",
        favoriteTeacher: "What is the name of your favorite teacher?",
        birthCity: "In which city were you born?",
        securityAnswerPlaceholder: "Your Answer",
        auditYes: "Is this report related to an internal audit employee?",
         yes: "Yes",
        no: "No",
        anonymousWarning: "You chose to remain anonymous. However, if we have additional questions regarding your report, we currently have no contact information to reach you. If further information is needed for your report, we won't be able to reach you, and your report may not be properly evaluated. It may be beneficial for you to provide an email address without revealing your identity. If you would like to do this, please enter your email address below. Otherwise, please check the status of your report using the ticket number we provide, and see if there is any additional information needed",
        errorMessage: "This field is required to track the report. It is not mandatory to complete the report, but if this field is empty, you cannot track the report."
        
    },
    tr: {
        selectLanguage: "",
        title: "Bir Olay Bildirin",
        intro: "Sorularınızı gönderebilir veya Getir'e Getir Speak Up üzerinden olayları bildirebilirsiniz. Anonim kalmayı tercih ettiğinizde, Getir kimliğinizi belirleyemez ve yalnızca Getir Speak Up üzerinden sizinle iletişim kurabilir. Kimliğinizi Getir'e sağlamayı tercih ederseniz, sorularınızda veya olay raporlarınızda yer alan kişisel verileriniz Getir tarafından işlenecektir. Kişisel verilerinizin işlenmesiyle ilgili daha fazla bilgi için lütfen <a id='privacy-link' href='https://drive.google.com/file/d/1LQMqTUgPGWIbVrZmATwP8jGtF_2V5CTR/view' target='_blank'>Getir Speak Up Gizlilik Bildirimini</a> okuyun.",
        terms: "Başlamadan Önce",
        agree: "Şartlar ve Koşulları okudum ve kabul ediyorum.",
        disagree: "Şartlar ve Koşulları kabul etmiyorum.",
        issueDetails: "Olay Detayları*",
        involvedParties: "Kimler Dahil Oldu?*",
        issueLocation: "Lütfen olayın nerede gerçekleştiğini belirtin*",
        issueDate: "Lütfen olayın gerçekleştiği tarihi belirtin (Tarih)",
        issueTime: "Lütfen olayın gerçekleştiği zamanı belirtin (Zaman)",
        introduce: "Kendinizi tanıtmak ister misiniz?",
        introduceYes: "Evet",
        introduceNo: "Hayır",
        fullName: "Ad - Soyad",
        email: "Email*",
        gsm: "GSM",
        contactEmailPlaceholder: "E-posta Adresiniz (isteğe bağlı)",
        relationship: "Şirketle olan ilişkiniz",
        currentEmployee: "Mevcut Çalışan",
        formerEmployee: "Eski Çalışan",
        nonEmployee: "Çalışan Değil",
        submit: "Gönder",
        warning: "Şartlar ve Koşulları kabul etmeden devam edemezsiniz.",
        successTitle: "Bildiriminiz için teşekkürler!",
        successMessage: "Bildiriminiz başarıyla gönderildi. Teşekkürler!",
        ticketNumber: "Bildirim numaranız ",
        checkStatus: "Bu numara ile bildiriminizin durumunu kontrol edebilirsiniz.",
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
        involvedPartiesPlaceholder: "Bu davranışta bulunan kişi(ler)in kimliğini belirtin.",
        supplier: "Tedarikçi",
        franchisee: "Bayi Sahibi",
        contractor: "Yüklenici",
        subcontractor: "Taşeron",
        noDeclaration: "Beyan etmek istemiyorum",
        goToHomePage: "Ana Sayfaya Git",
        Turkey: "Türkiye",
        Netherlands: "Hollanda",
        Germany: "Almanya",
        France: "Fransa",
        Spain: "İspanya",
        UK: "Birleşik Krallık",
        US: "Amerika",
        other: "Diğer",
        choose: "Seçiniz",
        otherPlaceholder: "Lütfen belirtiniz",
        attachment: "Lütfen iddialarınızı destekleyen tüm kanıt belgelerini (ekran görüntüleri vb.) ekleyin.",
        incidentDuration: "Bu vaka ne sürede meydana geldi?*",
        once: "Bir kere oldu",
        period: "Bir zaman aralığında oldu",
        ongoing: "Halen devam ediyor mu?",
        yes: "Evet",
        no: "Hayır",
        otherrelation: "Diğer",
        startDate: "Başlangıç Tarihi",
        yes: "Evet",
        no: "Hayır",
        endDate: "Bitiş Tarihi",
        securityQuestion: "Gizli Soru (Bildirim durumu takibi için gereklidir)",
        firstPet: "İlk evcil hayvanınızın adı nedir?",
        motherMaiden: "Annenizin kızlık soyadı nedir?",
        firstSchool: "İlkokulunuzun adı nedir?",
        favoriteTeacher: "En sevdiğiniz öğretmenin adı nedir?",
        birthCity: "Hangi şehirde doğdunuz?",
        securityAnswerPlaceholder: "Cevabınız",
        auditYes: "Bu bildirim bir İç Denetim departmanı çalışanı ile ilgili mi?",
         anonymousWarning: "Anonim kalmayı tercih ettiniz. Ancak, bildiriminizle ilgili ek sorularımız olursa, sizinle iletişim kuracak herhangi bir iletişim bilgisine sahip değiliz. Eğer bildiriminiz için ek bilgiye ihtiyaç duyulursa, sizinle iletişim kuramayacağız ve bildiriminiz düzgün bir şekilde değerlendirilemeyebilir. Kimliğinizi açığa çıkarmadan bir e-posta adresi sağlamanız sizin için faydalı olabilir. Bunu yapmak isterseniz, lütfen aşağıya e-posta adresinizi giriniz. Aksi halde size vereceğimiz bildirim numarası ile bildiriminizin durumunu sorgulayıp ilave bilgi ihtiyacı olup olmadığını kontrol ediniz.",
        errorMessage: "Bu alan bildirim takibi yapabilmeniz için gereklidir. Bildirimi tamamlamak için zorunlu değildir ancak bu alan boşsa bildirim takibi yapamazsınız."
       
    }
};