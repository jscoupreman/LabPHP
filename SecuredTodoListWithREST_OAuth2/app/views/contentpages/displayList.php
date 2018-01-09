<?php

use SecuredTodoList\tools\DIC;

if (isset($vars["list"])) {
?>
    <section class="panel tasks-widget" id="">
        <header class="panel-heading">
            <span class="task-title-sp">
                <?= $vars["list"]->getTitle() ?></span>
            <!--<button class="btn btn-primary btn-xs" id="edit-list"><i class="fa fa-pencil"></i></button>-->
            <?php
            $removeListURL = DIC::get(CONF_CLASS_ROUTER)->getUrl('ListController#removeList', ['id' => $vars["list"]->getId()]);
            ?>
            <a class="btn btn-danger btn-sm pull-right" href="<?= $removeListURL ?>" id="delete-list">Delete List</a>
        </header>
        <div class="panel-body">
            <div class="task-content">
                <ul class="task-list">
                    <?php
                    foreach ($vars["list"]->getItems() as $item) {
                        ?>
                        <li>
                            <div class="task-checkbox">
                                <input type="checkbox" class="list-child" value="">
                            </div>
                            <div class="task-title">
                                <span class="task-title-sp"><?php echo $item->getText(); ?></span>
                                <div class="pull-right hidden-phone">
                                    <!--<button class="btn btn-primary btn-xs"><i class="fa fa-pencil"></i></button>-->
                                    <?php
                                    $removeTaskURL = DIC::get(CONF_CLASS_ROUTER)->getUrl('ListController#removeTask', [
                                        'taskID' => $item->getId(),
                                        'listID' => $vars["list"]->getId()
                                    ]);
                                    ?>
                                    <button class="btn btn-danger btn-xs" onclick="location.href = '<?= $removeTaskURL ?>'"><i class="fa fa-trash-o "></i></button>
                                </div>
                            </div>
                        </li>
                        <?php
                    }
                    ?>
                </ul>
            </div>
            <form action="<?= DIC::get(CONF_CLASS_ROUTER)->getUrl('ListController#addTask'); ?>" method="POST">
                <div class="form-inline">
                    <input type="text" name="taskTitle" value="" class="form-control" required/>
                    <input type="hidden" name="listID" value="<?= $vars["list"]->getId() ?>" required/>
                    <button type="submit" class="btn btn-success btn-sm">Add New Tasks</button>
                </div>
            </form>
        </div>
    </section>
    <script>
        var TaskList = function () {
            return {
                initTaskWidget: function () {
                    $('input.list-child').change(function () {
                        if ($(this).is(':checked')) {
                            $(this).parents('li').addClass("task-done");
                        } else {
                            $(this).parents('li').removeClass("task-done");
                        }
                    });
                }

            };
        }();
    </script>
    <script>
        jQuery(document).ready(function () {
            TaskList.initTaskWidget();
        });
    </script>
    <?php
}
?>
