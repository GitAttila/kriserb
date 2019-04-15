<?php

header("Content-Type: application/json");

$result = array(
    "errors" => array(),
);

// provedu validaci
// posbiram chyby
if (strlen($_REQUEST["name"]) == 0) {
    $result["errors"]["name"] = "Must be filled out!";
}

if (strlen($_REQUEST["email"]) == 0) {
    $result["errors"]["email"] = "Must be filled out!";
}else {
    if (!preg_match("/^.*@.*\\..*$/", $_REQUEST["email"])) {
        $result["errors"]["email"] = "Invalid email";
    }
}

if (strlen($_REQUEST["message"]) == 0) {
    $result["errors"]["message"] = "Must be filled out!";
}

if (count($result["errors"]) == 0) {
    $userFormHistory = array();
    if (file_exists("userFormHistory.json")) {
        $userFormHistory = json_decode(file_get_contents("userFormHistory.json"), true);
    }
    
    $ip = $_SERVER["REMOTE_ADDR"];
    if (!array_key_exists($ip, $userFormHistory)) {
        $userFormHistory[$ip] = array();
    }
    $userFormHistory[$ip][] = time();
    
    // ulozime
    file_put_contents("userFormHistory.json", json_encode($userFormHistory));
    
    // zvalidujem
    $sendCount = 0;
    foreach ($userFormHistory[$ip] as $timestamp) {
        if ($timestamp > time() - 24*3600) {
            $sendCount++;
        }
    }
    
    if ($sendCount > 5) {
        $result["errors"]["message"] = "It is not possible to sent more than 5 messages within 24 hours.";
    }else {
        // form ok
        require 'PHPMailer/PHPMailerAutoload.php';

        $mail = new PHPMailer();

        //$mail->isSMTP();
        $mail->Host =''; // 'mail.primakurzy.cz';
        $mail->SMTPAuth ='';// true; 
        $mail->Username ='';// 'student@primakurzy.cz';                
        $mail->Password =''; // 'student';                          
        $mail->port=''; //25;
        $mail->setFrom($_REQUEST["email"], $_REQUEST["name"]);
        $mail->addAddress('kristyna.erbenova@gmail.com'); 
        $mail->isHTML(true); 
        $mail->Subject = 'MESSAGE fROM WWW.KRISTYNAERBENOVA.COM';
        $mail->Body    = sprintf("
            <table>
                <tr>
                    <th>Name:</th> <td>%s</td>
                </tr>
                <tr>
                    <th>Email:</th> <td>%s</td>
                </tr>
                <tr>
                    <th>Message:</th> <td>%s</td>
                </tr>
            </table>
            ",
                $_REQUEST["name"],
                $_REQUEST["email"],
                $_REQUEST["message"]
        );

        $ok = $mail->send();
        if(!$ok) {
            $result["errors"]["message"] = "Email could not be sent.";
        }
    }
}

// vypisu vysledek
echo json_encode($result);

?>