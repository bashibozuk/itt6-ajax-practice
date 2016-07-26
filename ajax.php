<?php

$list = require 'media.php';

header('Content-Type:application/json');
echo json_encode($list);