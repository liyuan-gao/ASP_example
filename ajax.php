<?php
// Get the POST data from the client
$data = $_POST["data"];

// Set up the curl request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://wave.ttu.edu/");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the curl request and get the response
$response = curl_exec($ch);

// Close the curl request
curl_close($ch);

// Return the response to the client
echo $response;
?>
