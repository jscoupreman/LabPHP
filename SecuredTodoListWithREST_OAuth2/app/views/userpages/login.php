<?php

if(isset($vars) && isset($vars['redirect_url'])){
    $login_url = '/account/login/'.$vars['redirect_url'];
}else{
    $login_url = '/account/login';
}
?>


<h1>Se connecter</h1>
<form action="<?= $login_url ?>" method="POST">
    <div class="form-group">
        <label for="">Pseudo</label>
        <input type="text" name="username" class="form-control"/>
    </div>
    <!--<div class="form-group">
        <label for="">Email</label>
        <input type="text" name="email" class="form-control"/>
    </div>-->
    <div class="form-group">
        <label for="">Mot de passe</label>
        <!--<input type="email" name="email" required/>-->
        <input type="password" name="password" class="form-control"/>
    </div>
    <!--<div class="checkbox">
    <label>
      <input type="checkbox"> Connection automatique
    </label>
  </div>-->
    <button type="submit" class="btn btn-primary">Login</button>
    <a href="">Forgot your password ?</a>
</form>