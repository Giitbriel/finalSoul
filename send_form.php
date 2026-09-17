<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $secretKey = "6LcpKV4sAAAAAKuwNL7K43sNU-1UpoVUf0OjTSLD";
    $recaptchaResponse = $_POST['g-recaptcha-response'];

    // Weryfikacja reCAPTCHA
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$recaptchaResponse");
    $responseKeys = json_decode($response, true);

    if(intval($responseKeys["success"]) !== 1) {
        echo "Proszę zaznaczyć captcha.";
        exit;
    }

    // Pobranie danych z formularza
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Wysyłka maila
    $to = "wagaadrian87@gmail.com";
    $subject = "Wiadomość z formularza kontaktowego";
    $body = "Imię i nazwisko: $name\nEmail: $email\nWiadomość: $message";
    $headers = "From: $email";

    if(mail($to, $subject, $body, $headers)){
        echo "Wiadomość wysłana!";
    } else {
        echo "Wystąpił błąd podczas wysyłki.";
    }
}
?>
