<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Todo List</title>

        <link rel="stylesheet" href="/css/bootstrap.min.css">
        <link rel="stylesheet" href="/css/font-awesome.min.css">
        <link rel="stylesheet" href="/css/jquery-ui.min.css">
        <link rel="stylesheet" href="/css/tasks.css">
        <link rel="stylesheet" href="/css/app.css">
        <link rel="stylesheet" href="/css/non-responsive.css">



        <!--<script src="/js/checkList.js"></script>-->
    </head>
    <body>
        <script src="/js/jquery.min.js"></script>
        <script src="/js/bootstrap.min.js"></script>
        <?= $header ?>
        <div class="container">
            <?= $alerts ?>
            <?= $content ?>
        </div>
    </body>
</html>