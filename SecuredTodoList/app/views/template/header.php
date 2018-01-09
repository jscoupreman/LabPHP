<?php

use SecuredTodoList\tools\DIC;

function generateLiURL($routeName, $linkName, $vars = []) {
    $url = "<li";
    if (DIC::get(CONF_CLASS_ROUTER)->isCurrentURL($routeName)) {
        $url .= ' class="active"';
    }
    $url .= '>' . generateURL($routeName, $linkName, $vars) . '</li>';
    return $url;
}

function generateURL($routeName, $linkName, $vars = []) {
    return '<a href="' . getUrl($routeName, $vars) . '">' . $linkName . '</a>';
}

function getURL($routeName, $vars = []) {
    return DIC::get(CONF_CLASS_ROUTER)->getUrl($routeName, $vars);
}
?>

<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="<?= getUrl('index') ?>">Secured Todo List</a>
        </div>
        <div id="navbar">
            <ul class="nav navbar-nav">
                <?php
                echo generateLiURL('index', 'Home');
                $session = DIC::get(CONF_CLASS_SESSION);
                if (!$session->isLogged()) {
                    echo generateLiURL('UserController#showLogin', 'Login');
                    echo generateLiURL('UserController#register', 'Register');
                } else {
                    ?>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">My Lists <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <?php
                                $frontList = DIC::get(CONF_CLASS_FRONTLIST);
                                foreach($frontList->getLists($session->getUser()) as $list){
                                    echo generateLiURL('ListController#getList', $list->getTitle(), ['id' => $list->getId()]);
                                }
                            ?>
                            <li role="separator" class="divider"></li>
                            <li><a href="#" data-toggle="modal" data-target="#createNewList">Create new list</a></li>
                        </ul>
                    </li>
                    <?php
                    echo generateLiURL('UserController#logoff', 'Logoff');
                }
                ?>

            </ul>
        </div>
    </div>
</nav>

<!-- Modal -->
<div class="modal fade" id="createNewList" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Create a new todo list</h4>
            </div>
            <form action="/create/list" method="POST">
                <div class="modal-body">

                    <!--<div class="form-group">-->
                    <input type="text" name="title" placeholder="Title" value="" class="form-control" required/>
                    <!--</div>-->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Create list</button>
                </div>
            </form>
        </div>
    </div>
</div>
