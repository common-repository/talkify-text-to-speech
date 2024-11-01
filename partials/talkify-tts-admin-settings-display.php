<?php

?>
<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">
    <div id="icon-themes" class="icon32"></div>  
    <h2>Talkify Text To Speech Settings</h2>  
	<?php settings_errors(); ?>  
    <form method="POST" action="options.php">  
        <?php 
            settings_fields( 'talkify_tts_general_settings' );
            do_settings_sections( 'talkify_tts_general_settings' ); 
        ?>             
        <?php submit_button(); ?>  
    </form> 
</div>