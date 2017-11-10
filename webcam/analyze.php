<?php

	setlocale(LC_ALL, "en_US.UTF-8");
    ini_set( 'display_errors', 0);
    $debug = false;

	/*---save a POSTed file---*/
	$filename = $_POST["filename"];
    $blob64 = $_POST["blob"];
	$blob = base64_decode($blob64);
    $inMovieFilePath =  dirname(__FILE__)."/movies_webm/";
    $outMovieFilePath = dirname(__FILE__)."/movies_mp4/";

    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    echo "\n".$ext;

	if($ext == "mp4"){
		$outfilename = $outMovieFilePath.$filename;
	    file_put_contents ($outMovieFilePath.$filename, $blob );
	}else{
		$outfilename = $outMovieFilePath.$filename.".mp4";
		file_put_contents ($inMovieFilePath.$filename, $blob );
	    /*---convert to mp4---*/
		//$ffmpeg = "/usr/local/bin/ffmpeg";
		$ffmpeg =  dirname(__FILE__)."/apps/ffmpeg/bin/ffmpeg.exe";
		$command = $ffmpeg." -i ".$inMovieFilePath.$filename." -vcodec libx264 -acodec libfaac -y ".$outfilename;
		$ret = system_ex($command);
		printLog($ret);
	}

	//---prepare Json folder
	$jsondir = dirname(__FILE__)."/json/".$filename."/";
	mkdir($jsondir, 0777, true);

	//---openpose
	chdir(dirname(__FILE__)."/apps/openpose/bin");
	$openpose = "OpenPoseDemo.exe";
	$command = $openpose." --keypoint_scale 3 --write_keypoint_json ".$jsondir." --video ".$outfilename;
	printLog($command);
	$ret = system_ex($command);
	printLog($ret);

    $arr = array("filename"=>$filename);
    echo json_encode($arr);



    function printLog($str)
    {
        global $debug;
        if($debug){
            var_dump($str);
        }
    }


    function system_ex($cmd, $stdin = "")
    {
        $descriptorspec = array(
            0 => array("pipe", "r"),
            1 => array("pipe", "w"),
            2 => array("pipe", "w")
            );

        $process = proc_open($cmd, $descriptorspec, $pipes);
        $result_message = "";
        $error_message = "";
        $return = null;
        if (is_resource($process))
        {
            fputs($pipes[0], $stdin);
            fclose($pipes[0]);
            
            while ($error = fgets($pipes[2])){
                $error_message .= $error;
            }
            while ($result = fgets($pipes[1])){
                $result_message .= $result;
            }
            foreach ($pipes as $k=>$_rs){
                if (is_resource($_rs)){
                    fclose($_rs);
                }
            }
            $return = proc_close($process);
        }
        return array(
            'return' => $return,
            'stdout' => $result_message,
            'stderr' => $error_message,
            );
    }