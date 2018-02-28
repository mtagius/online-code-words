<?php
    $file = file("words.txt");
    $words = array();
    for ($i = 0; $i < 25; $i++) {
        $line = $file[rand(0, count($file) - 1)];
        while(in_array($line, $words)) {
            $line = $file[rand(0, count($file) - 1)];
        }
        array_push($words, $line);
    } 
    echo json_encode($words);
?>