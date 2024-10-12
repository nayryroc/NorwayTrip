function sendEmail(email, bcc, subject, body){
    window.open("mailto:" + email + "?" + bcc + "&subject=" + subject + "&body=" + body , "_blank");
}

export default sendEmail;