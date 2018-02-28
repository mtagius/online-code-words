<?php
$json_array = json_decode(file_get_contents('../data/token.json'), true);

file_put_contents('../data/token.json', json_encode($_POST));

echo json_encode("PHP Finished!");
?>