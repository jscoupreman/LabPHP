<h1>S'inscrire</h1>
<form action="" method="POST">
    <div class="form-group">
        <label for="">Pseudo</label>
        <input type="text" name="username" value="<?= isset($vars["login"]) ? $vars["login"]:''; ?>" class="form-control" required/>
    </div>
    <div class="form-group">
        <label for="">Email</label>
        <!--<input type="email" name="email" required/>-->
        <input type="email" name="email" value="<?= isset($vars["email"]) ? $vars["email"]:''; ?>" class="form-control" required/>
    </div>
    <div class="form-group">
        <label for="">Mot de passe</label>
        <!--<input type="email" name="email" required/>-->
        <input type="password" name="password" class="form-control" required/>
    </div>
    <div class="form-group">
        <label for="">Confirmez votre mot de passe</label>
        <!--<input type="email" name="email" required/>-->
        <input type="password" name="password_confirm" class="form-control" required/>
    </div>
    <button type="submit" class="btn btn-primary">M'inscrire</button>
</form>