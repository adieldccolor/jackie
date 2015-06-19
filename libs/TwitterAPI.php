<?php
// ini_set('display_errors', 1);
require_once('TwitterAPIExchange.php');

/**
* 
*/

    function twitterStream($hash='#google', $count = 5)
    {
        /** Set access tokens here - see: https://dev.twitter.com/apps/ **/
        $settings = array(
            'oauth_access_token' => "154253094-dW8R0OAtFKuhJ9NKphXlQsPsznUDgGwbVZYzRaZu",
            'oauth_access_token_secret' => "L0PkkFi0MrQkXancr5Jl3PdBbfWrsj26Kwfdm4J4L7Ac5",
            'consumer_key' => "5YmRSqHRbrL9tHX0uWvEifA5B",
            'consumer_secret' => "qrRfrIS1lCqJKjOduNbZNY8Y2c4Hh3RTGbecd7AY9uSXHvzSSp"
        );

        $status_build = "";


        /** Perform a GET request and echo the response **/
        /** Note: Set the GET field BEFORE calling buildOauth(); **/
        // $hash = '#google';
        $hash_string = substr($hash, 1, strlen($hash));
        $url = 'https://api.twitter.com/1.1/search/tweets.json';
        $getfield = '?count=' . $count . '&q=' . $hash;
        $requestMethod = 'GET';
        $twitter = new TwitterAPIExchange($settings);
        $response =  $twitter->setGetfield($getfield)
                     ->buildOauth($url, $requestMethod)
                     ->performRequest();

        if( is_string($response) && !is_bool($response) ){
            $response = json_decode($response, true);
        }

        // var_dump($response);

        if($response && count($response) > 0){
            $statuses = $response['statuses'];
            for($i = 0; $i < 5; $i++){
                // echo $statuses[$i]['text'] . '<br>';
                $status_build .= '<blockquote class="twitter-tweet" lang="en"><p>
                    ' . $statuses[$i]['text'] . '
                    <a href="https://twitter.com/hashtag/' . $hash_string . '?src=hash">' . $hash . '</a>
                    </p>&mdash; ' . $statuses[$i]['user']['name'] . ' (@' . $statuses[$i]['user']['screen_name'] . ') 
                    <a href="https://twitter.com/' . $statuses[$i]['user']['screen_name'] 
                    . '/status/' . $statuses[$i]['id'] . '">' . date("F d, Y", strtotime($statuses[$i]['created_at'])) 
                    . '</a></blockquote>';
            }
        }else{
            $status_build = "No twitter feed found searching hashtag " . $hash;
        }

        return $status_build;
    }