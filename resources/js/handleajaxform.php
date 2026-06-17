<?php

header("Content-Type: application/json; charset=UTF-8");

$result = array(
    "errors" => array(),
);

$input = ($_SERVER["REQUEST_METHOD"] === "POST") ? $_POST : array();

$nameRaw = isset($input["name"]) ? trim($input["name"]) : "";
$emailRaw = isset($input["email"]) ? trim($input["email"]) : "";
$messageRaw = isset($input["message"]) ? trim($input["message"]) : "";

// Basic header-injection hardening for values used in email headers.
$name = str_replace(array("\r", "\n"), " ", $nameRaw);
$email = str_replace(array("\r", "\n"), "", $emailRaw);
$message = $messageRaw;

// validate input
// collect validation errors
if (strlen($name) == 0) {
    $result["errors"]["name"] = "Must be filled out!";
}

if (strlen($email) == 0) {
    $result["errors"]["email"] = "Must be filled out!";
} else {
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $result["errors"]["email"] = "Invalid email";
    }
}

if (strlen($message) == 0) {
    $result["errors"]["message"] = "Must be filled out!";
}

if (count($result["errors"]) == 0) {
    $historyFile = __DIR__ . "/userFormHistory.json";
    $userFormHistory = array();
    if (file_exists($historyFile)) {
        $decodedHistory = json_decode(file_get_contents($historyFile), true);
        if (is_array($decodedHistory)) {
            $userFormHistory = $decodedHistory;
        }
    }

    $ip = isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : "unknown";
    if (!array_key_exists($ip, $userFormHistory) || !is_array($userFormHistory[$ip])) {
        $userFormHistory[$ip] = array();
    }
    $userFormHistory[$ip][] = time();

    // save updated history
    if (file_put_contents($historyFile, json_encode($userFormHistory), LOCK_EX) === false) {
        $result["errors"]["message"] = "Server error. Please try again later.";
    }

    // validate sending limit
    $sendCount = 0;
    if (!array_key_exists("message", $result["errors"])) {
        foreach ($userFormHistory[$ip] as $timestamp) {
            if ($timestamp > time() - 24 * 3600) {
                $sendCount++;
            }
        }
    }

    if (!array_key_exists("message", $result["errors"]) && $sendCount > 5) {
        $result["errors"]["message"] = "It is not possible to sent more than 5 messages within 24 hours.";
    } else if (!array_key_exists("message", $result["errors"])) {
        // form is valid
        require 'PHPMailer/PHPMailerAutoload.php';

        $mail = new PHPMailer();

        //$mail->isSMTP();
        $mail->Host =''; // 'mail.primakurzy.cz';
        $mail->SMTPAuth ='';// true;
        $mail->Username ='';// 'student@primakurzy.cz';
        $mail->Password =''; // 'student';
        $mail->port=''; //25;
        $mail->setFrom($email, $name);
        $mail->addAddress('kristyna.erbenova@gmail.com');
        $mail->isHTML(true);
        $mail->Subject = 'MESSAGE fROM WWW.KRISTYNAERBENOVA.COM';

        $safeName = htmlspecialchars($name, ENT_QUOTES, "UTF-8");
        $safeEmail = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
        $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, "UTF-8"));

        $mail->Body = sprintf(
            "
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
            $safeName,
            $safeEmail,
            $safeMessage
        );

        $ok = $mail->send();
        if (!$ok) {
            $result["errors"]["message"] = "Email could not be sent.";
        }
    }
}

// output result
echo json_encode($result);

?>
