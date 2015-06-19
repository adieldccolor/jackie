<?php

function new_json($data){
	$response = "";
	if( is_array($data) && !empty($data) )
		{
			header('Content-Type: application/json');
			$response = json_encode($data);
		}

		return $response;
}

#send email
	$name = $_POST['name'];
	$email = $_POST['email'];
	$reason = $_POST['reason'];
	$comment = $_POST['comment'];

// reason for contacting us should have the following reasons listed, going to the email addresses indicated: 
// o	General Inquiries - general@jackierobinson.org
// o	Donation and Sponsorship Questions - development@jackierobinson.org
// o	Application and Program Questions - programs@jackierobinson.org
// o	Media Inquiries -  media@jackierobinson.org
// o	Questions about your Jackie Robinson Project - general@jackierobinson.org



	$message = "---Quick contact from Jackie Robinson Foundation Website. \r\nName: ".$name." \r\n";
	$message .= "Email: ".$email." \r\n";
	$message .= "Comment: ".$comment." \r\n";
	 
	$to = $reason == "1" ? "general@jackierobinson.org" 
			: ( $reason == "2" ? "development@jackierobinson.org" 
				: ( $reason == "3" ? "programs@jackierobinson.org"
					: ( $reason == "4" ? "media@jackierobinson.org" : "general@jackierobinson.org" )
				 )
			 );

	// $to = "jadher.11x2@gmail.com";

	$subject = 'Jackie Robinson Foundation Quick Contact';
	$message = 'FROM: '.$name." \r\nEmail: ".$email."\r\n\r\nMessage: \r\n".$message;
	$headers = 'From: '.$email. "\r\n";
	 
	if (filter_var($email, FILTER_VALIDATE_EMAIL) && isset($_POST)) { // this line checks that we have a valid email address
	mail($to, $subject, $message, $headers); //This method sends the mail.
	$status = ["success" => true, "message" => "Email sent.", "to" => $to, "from" => $email];
	}else{
	$status = ["success" => false, "message" => "Email not sent.", "to" => $to, "from" => $email];
	}

	echo new_json($status); // success message
?>