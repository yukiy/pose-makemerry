<?php
    include 'ChromePhp.php';
	setlocale(LC_ALL, "en_US.UTF-8");
    ini_set( 'display_errors', 0);
    $debug = false;
    $isAngleJson = false;

	/*---save a POSTed file---*/
	$fullfilename = $_POST["filename"];
    $blob64 = $_POST["blob"];
	$blob = base64_decode($blob64);
    $inMovieFilePath =  dirname(__FILE__)."/movies_webm/";
    $outMovieFilePath = dirname(__FILE__)."/movies_mp4/";

    $filename = pathinfo($fullfilename, PATHINFO_FILENAME);
    $ext      = pathinfo($fullfilename, PATHINFO_EXTENSION);


//todo TRY convert to jpg
//ffmpeg -i movies_mp4/test.mp4 -qscale:v 2 -huffman optimal movies_jpg/test3/test_%04d.jpg

	if($ext == "mp4"){
		$outfilename = $outMovieFilePath.$filename.".mp4";
	    file_put_contents ($outfilename, $blob );
	}
    else{
		$outfilename = $outMovieFilePath.$filename.".mp4";
		file_put_contents ($inMovieFilePath.$fullfilename, $blob );
	    /*---convert to mp4---*/
		$ffmpeg =  dirname(__FILE__)."/apps/ffmpeg/bin/ffmpeg.exe";
        $ffmpegOpt =  " -c:v libx264 -c:a aac -vf framerate=30 ";
		$command = $ffmpeg." -i ".$inMovieFilePath.$fullfilename.$ffmpegOpt." -y ".$outfilename;
		$ret = system_ex($command);
		//printLog($ret);
	}

	//---prepare Json folder
	$jsondir = dirname(__FILE__)."/json/".$filename."/";
    if(!is_dir($jsondir)){
	   mkdir($jsondir, 0777, true);
    }
	//---openpose
	chdir(dirname(__FILE__)."/apps/openpose/bin");
	$openpose = "OpenPoseDemo.exe";
    $openposeOpt = " --resolution 800x600 --keypoint_scale 3 --write_keypoint_json ".$jsondir."original/ ";
	$command = $openpose.$openposeOpt."--video ".$outfilename;
	$ret = system_ex($command);
	//printLog($ret);

    //---return json
    // if(isAngleJson){
    //     //---convert
    //     chdir(dirname(__FILE__)."/apps/Convert2AngleJSON/bin");
    //     $converter = "Convert2AngleJson.exe";
    //     $command = $converter." ".$jsondir."original/ ".$jsondir.$filename."_angle.json";
    //     //$ret = system_ex($command);
    //     system_ex($command);

    //     // //---response
    //     $angleJson = file_get_contents($jsondir.$filename."_angle.json");
    //     //$angleJson = mb_convert_encoding($angleJson, 'UTF8', 'ASCII,JIS,UTF-8,EUC-JP,SJIS-WIN');
    //     echo ($angleJson);        
    // }
    // else{
        //---return original
        $length = count(glob($jsondir."original/*.json"));
        $arr = array("filename"=>$filename, "length"=>$length);
        echo(json_encode($arr));
    // }

    // echo("nothing");



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
    