<h1>Se connecter</h1>
<form action="/account/login" method="POST">
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