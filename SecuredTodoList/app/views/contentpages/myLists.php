<?php

use SecuredTodoList\tools\DIC;

?>
<center><h3>My task lists :</h3>
    <form action="/create/list" method="POST">
        <div class="form-inline">
            <input type="text" name="title" value="" class="form-control" required/>
            <button type="submit" class="btn btn-success btn-sm">Add Task List</button>
        </div>
    </form>
</center>
<br/>
<div class="list-group">
    <?php
    $frontList = DIC::get(CONF_CLASS_FRONTLIST);
    $router = DIC::get(CONF_CLASS_ROUTER);
    $session = DIC::get(CONF_CLASS_SESSION);
    if ($session->isLogged()) {
        foreach ($frontList->getLists($session->getUser()) as $list) {
            $url = $router->getUrl('ListController#getList', ['id' => $list->getId()]);
            echo "<button onclick=\"location.href = '$url'\" type=\"button\" class=\"list-group-item\">" . $list->getTitle() . "</button>";
        }
    }
    ?>
</div>