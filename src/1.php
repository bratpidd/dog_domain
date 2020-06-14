<?php
include "db_access.php";
$response = array();
                                                //VALUES ('".."','".."','".."','".."','".."','".."')  <--- PRICELESS VALUES EXPRESSION
function getCurrentUser(){                     //returns assoc array with "user" on successful authentication or NULL if cookie is outdated/does not match
    global $con;
    if (!isset($_COOKIE['auth_token'])) {return null;} //TODO when logging in from a different machine/browser - this check returns bullshit instead of authentication
    $auth_token = $_COOKIE['auth_token'];
    $user = mysqli_fetch_assoc(mysqli_query($con,"select * from owners WHERE auth_token = '".$auth_token."'"));
    if (empty($user)) {return null;}
    return $user;
}


if ($_GET['action'] === 'get_owner_info') {
    $owner_id = $_GET['ownerId'];
    $dogs_query = mysqli_query($con, "SELECT * from dogs WHERE owner_id = ".$owner_id);
    $dogs = array();
    while ($row = mysqli_fetch_assoc($dogs_query)) {
        $dogs[] = $row;
    }
    $owner = mysqli_fetch_assoc(mysqli_query($con,"select id, name, country, city, email, phone from owners WHERE id = '".$owner_id."'"));
    if (isset ($owner)) {
        $response['msg'] = 'ok';}
    $owner['email'] = ''; //quick patch for secure reasons
    $owner['phone'] = '';//-/-
    $response['dogs'] = $dogs;
    $response['owner'] = $owner;
    echo (json_encode($response));
}

if ($_GET['action'] === 'get_medication_info') {
    $dog_id = $_GET['dogId'];
    $medication_query = mysqli_query($con, "SELECT * from medications WHERE dog_id = ".$dog_id);
    $medication = array();
    while ($row = mysqli_fetch_assoc($medication_query)) {
        $medication[] = $row;
    }
    $response['medication'] = $medication;
    $response['msg'] = 'ok';
    echo (json_encode($response));
}


if ($_GET['action'] === 'update_medication') {
    $user = getCurrentUser();
    $medication = json_decode($_GET['medication'], true);
    $dog_id = $medication['dogId'];
    $dog = mysqli_fetch_assoc(mysqli_query($con, "SELECT * FROM dogs WHERE id = ".$dog_id)); //since we know only the dog's ID, first we need to use DB to verify this is the requester's dog
    if (!empty($dog)) {
        if ((isset($user)) && ($user['id'] === $dog['owner_id'])){ //so the dog belongs to the requester
            $code = $medication['code'];
            $duration = $medication['duration'];
            $date = $medication['date'];
            $brand = $medication['brand'];
            //since this is smart operation (update or add) - we use INSERT ON DUPLICATE KEY UPDATE. key will be formed as a string with format $dog_id."_".$code, like "31_2"
            $id = $dog_id.'_'.$code; //must be unique enough

            mysqli_query($con, "INSERT INTO medications (`id`, `code`, `duration`, `date`, `brand`, `dog_id`)
VALUES ('".$id."','".$code."','".$duration."','".$date."','".$brand."','".$dog_id."')
ON DUPLICATE KEY UPDATE id = '".$id."', code = '".$code."', duration = '".$duration."', date = '".$date."', brand = '".$brand."', dog_id = '".$dog_id."' ;
");
            $response['msg'] = 'ok';
        }
        echo json_encode($response);
    }


    //var_dump($dog);
}

if ($_GET['action'] === 'update_dog') {
    $user = getCurrentUser();
    $dog = json_decode($_GET['dog'], true);
    if ((isset($user)) && ($user['id'] === $dog['owner_id'])){
        $name = $dog['name'];          //may be verification in future
        $id = $dog['id'];
        $breed = $dog['breed'];
        $sex = $dog['sex'];
        $birthdate = $dog['birthdate'];
        $color = $dog['color'];
        $tattoo = $dog['tattoo'];
        mysqli_query($con, "UPDATE dogs
SET name = '".$name."', breed = '".$breed."', sex = '".$sex."', birthdate = '".$birthdate."', color = '".$color."', tattoo = '".$tattoo."' 
WHERE owner_id = ".$user['id']." AND id = ".$id);
        $response['msg'] = 'ok';
    }
    echo json_encode($response);
    //var_dump($dog);
}

if ($_GET['action'] === 'update_user') {
    $user = getCurrentUser();
    if ((isset($user)) && ($user['id'] === $_GET['id'])){
        $name = $_GET['name'];          //may be verification in future
        $country = $_GET['country'];
        $city = $_GET['city'];
        $email = $_GET['email'];
        $phone = $_GET['phone'];
        mysqli_query($con, "UPDATE owners 
SET name = '".$name."', country = '".$country."', city = '".$city."', email = '".$email."', phone = '".$phone."' 
WHERE id = ".$user['id']);
        $response['msg'] = 'ok';
    }
    echo json_encode($response);
}


if ($_GET['action'] === 'get_dog') {
    $dog_id = $_GET['dogId'];
    $dog = mysqli_fetch_assoc(mysqli_query($con, "SELECT * FROM dogs WHERE id = ".$dog_id));
    if (!empty($dog)) {
        $owner_id = $dog['owner_id'];
        $owner = mysqli_fetch_assoc(mysqli_query($con, "SELECT id, name, country, city, email, phone FROM owners WHERE id = ".$owner_id));
        $response['msg'] = 'ok';
        $response['dog'] = $dog;
        $response['owner'] = $owner;
    } else $response['msg'] = 'not_found';
    echo json_encode($response);
}

if ($_GET['action'] === 'get_owner_dogs') { //might be unused
    $owner_id = $_GET['ownerId'];
    $dogs_query = mysqli_query($con, "SELECT * from dogs WHERE owner_id = ".$owner_id);
    $dogs = array();
    while ($row = mysqli_fetch_assoc($dogs_query)) {
        $dogs[] = $row;
    }
    $response['msg'] = 'ok';
    $response['dogs'] = $dogs;
    echo (json_encode($response));
}

if ($_GET['action'] === 'new_dog') {
    $user = getCurrentUser();
    if (isset($user)) {
        $user_id = $user['id'];
        $dog = json_decode($_GET['dogInfo'], true);
        mysqli_query($con, "INSERT INTO dogs (`name`, `breed`, `sex`, `birthdate`, `color`, `tattoo`, `owner_id`) 
VALUES ('".$dog['name']."', '".$dog['breed']."', '".$dog['sex']."', '".$dog['birthdate']."', '".$dog['color']."', '".$dog['tattoo']."', '".$user_id."')");
        $response ['msg'] = 'ok';
    } else {$response['msg'] = 'fail';}
    echo (json_encode($response));
}

if ($_GET['action'] === 'get_current_user') {
    $user = getCurrentUser();
    if (isset($user)) {
        unset ($user['user']['auth_token']);
        unset ($user['user']['google_id']);
        $dogs_query = mysqli_query($con, "SELECT * from dogs WHERE owner_id = ".$user['id']);
        $dogs = array();
        while ($row = mysqli_fetch_assoc($dogs_query)) {
            $dogs[] = $row;
        }
        $response['msg'] = 'ok';
        $response['user'] = $user;
        $response['dogs'] = $dogs;
    } else {
        $response['msg'] = 'fail';
    }
    echo (json_encode($response));
}

if ($_GET['action'] === 'auth_request') {           //request to authorize user by Google id_token - in case user cannot be authorized by a cookie token (e.g. expired) - and generate a new cookie token
    $token_url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $_GET['id_token'];
//    print_r($token_url);
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $token_url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_HEADER, false);
    $data = curl_exec($curl);
    curl_close($curl);
    $id_token_content = json_decode($data, true);
    if (($id_token_content['aud'] === '747483898884-7prg0qcvs25uvkl6bffhbe1eml9blt04.apps.googleusercontent.com') &&
        ($id_token_content['iss'] === 'accounts.google.com')
    ) {
        $token = bin2hex(random_bytes(64));
        $google_id = $id_token_content['sub'];
        $userData = mysqli_fetch_assoc(mysqli_query($con,"select * from owners WHERE google_id = ".$google_id));
        if (empty($userData)) {                                                                     //if noone found - create a new owner and create a test dog for him
            $name = $id_token_content['name'];
            $email = $id_token_content['email'];
            mysqli_query($con, "
INSERT INTO owners (`name`, `email`, `google_id`, `auth_token`) 
VALUES ('".$name."', '".$email."', '".$google_id."', '".$token."')");
            setcookie('auth_token', $token, time()+259200); //3 days
            $response['msg'] = 'new_user';
        } else {                                                                                    //if someone found
                mysqli_query($con, "UPDATE owners SET auth_token = '".$token."' WHERE google_id = '".$google_id."'");
                $response['msg'] = 'auth_token_updated';
                setcookie('auth_token', $token, time()+259200); //3 days
        }
    } else {
        $response['msg'] = 'your google id token - invalid!';
    }
    echo (json_encode($response));
}
//print_r($token_id_content);

?>