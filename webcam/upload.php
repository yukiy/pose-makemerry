<?php
	$filename = $_POST["filename"];
    $blob64 = $_POST["blob"];
	$blob = base64_decode($blob64);
    $moviefilepath =  dirname(__FILE__)."/stored_movies/";
    file_put_contents ($moviefilepath.$filename, $blob );
	$ffmpeg = "/usr/local/bin/ffmpeg";
	$command = $ffmpeg." -i ".$moviefilepath.$filename." ".$moviefilepath."output.mp4";
	system($command);
	echo $command;
