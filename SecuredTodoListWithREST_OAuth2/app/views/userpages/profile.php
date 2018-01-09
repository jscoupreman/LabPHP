<?php

use SecuredTodoList\tools\DIC;
?>

<div class="btn-group">
    <label>REST Security Token :</label>
    <div class="input-group">
        <input type="text" id="token" class="form-control" readonly value="<?= DIC::get(CONF_CLASS_SESSION)->getRestToken(); ?>"/>
        <span class="input-group-btn">
            <button class="btn btn-default" id="generate" type="button">Generate</button>
        </span>
    </div>
</div>
<br /><br />
<div class="form-group">
    <label>Your Applications :</label>
    <a href="#" data-toggle="modal" data-target="#createNewApplication">Create new application</a>
    <?php
    $frontOAuth = DIC::get(CONF_CLASS_FRONTOAUTH);
    $applications = $frontOAuth::getOAuthApplications();
    foreach ($applications as $application) {
        $client_id = $application->getClient_id();
        $secret = $application->getClient_secret();
        $redirect_uri = $application->getRedirect_uri();
        $grant_type = $application->getGrant_types();
        $scope = $application->getScope();
        $user_id = $application->getUser_id();
        $output = <<<MSG
                   <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">$client_id</h3>
        </div> 
        <div class="panel-body">
            <div class="input-group input-group-sm">
                <span class="input-group-addon" id="sizing-addon3">Application ID</span>
                <input type="text" class="form-control" value="$client_id" aria-describedby="sizing-addon3">
            </div>
            <br>
            <div class="input-group input-group-sm">
                <span class="input-group-addon" id="sizing-addon3">Application Secret</span>
                <input type="text" class="form-control" value="$secret" aria-describedby="sizing-addon3">
            </div>
            <br>
            <div class="input-group input-group-sm">
                <span class="input-group-addon" id="sizing-addon3">Redirect URI</span>
                <input type="text" class="form-control" value="$redirect_uri" aria-describedby="sizing-addon3">
            </div>
            <br>
            <div class="input-group input-group-sm">
                <span class="input-group-addon" id="sizing-addon3">Grant type</span>
                <input type="text" class="form-control" value="$grant_type" aria-describedby="sizing-addon3">
            </div>
            <br>
            <div class="input-group input-group-sm">
                <span class="input-group-addon" id="sizing-addon3">Scope</span>
                <input type="text" class="form-control" value="$scope" aria-describedby="sizing-addon3">
            </div>
            <br>
            <div class="input-group input-group-sm">
                <span class="input-group-addon" id="sizing-addon3">User ID</span>
                <input type="text" class="form-control" value="$user_id" aria-describedby="sizing-addon3">
            </div>
        </div>
    </div>     
MSG;
        echo $output;
    }
    ?>
</div>




<script>
    $(document).ready(function () {
        $("#generate").click(function () {
            // ajouter la gestion du loading via la classe modal
            $.get("<?= DIC::get(CONF_CLASS_ROUTER)->getUrl("UserController#generateRestToken"); ?>", function (data) {
                $("#token").val(data);
            });
        });
        $("#copy").click(function () {
            copyToClipboard('#token');
        });
        function copyToClipboard(element) {
            var $temp = $("<input>");
            $("body").append($temp);
            $temp.val($(element).text()).select();
            document.execCommand("copy");
            $temp.remove();
        }
    });
</script>




<!-- Modal -->
<div class="modal fade" id="createNewApplication" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Create a new OAuth2 application</h4>
            </div>
            <form action="<?= DIC::get(CONF_CLASS_ROUTER)->getUrl('ListController#addList'); ?>" method="POST">
                <div class="modal-body">

                    <!--<div class="form-group">-->
                    <input type="text" name="app_name" placeholder="Application Name" value="" class="form-control" required/>
                    <br />
                    <input type="text" name="app_website" placeholder="Application Website" value="" class="form-control" required/>
                    <br />
                    <input type="text" name="app_callback" placeholder="Callback URL" value="" class="form-control" required/>
                    <!--</div>-->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Create application</button>
                </div>
            </form>
        </div>
    </div>
</div>
