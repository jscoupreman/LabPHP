function NpcModel(){
}
NpcModel.prototype.modelInfo = {
    viewerModel: {
        type: 8
    },
    aspect: 1
}
NpcModel.prototype.ShowModel = function(c, a) {
    /*if (NpcModel.modelViewer) {
        console.log("modelViewer already exists")
        return
    }*/
    //this.DestroyModel();
    this.modelInfo.viewerModel.id = a.displayId;
    this.modelInfo.viewerModel.humanoid = !!(a.humanoid);
    var e;
    this.containerDiv = e = $WH.ge(c);
    var b = $WH.ce("div", {
        id: "npc-model-container"
    });
    $WH.ae(e, b);
    var d = {
        type: ZamModelViewer.WOW,
        contentPath: "http://wow.zamimg.com/modelviewer/",
        container: $(b),
        aspect: this.modelInfo.aspect,
        models: this.modelInfo.viewerModel
    };
    var f = new ZamModelViewer(d);
    this.modelViewer = f;
    this.SetModelAnimation()
}
NpcModel.prototype.getAnimationsLength = function(){
    console.log("trying to get animations length");
    if (!this.modelViewer) {
        return;
    }
    var c = this.modelViewer;
    var a = false;
    try {
        a = c.method("isLoaded");
    } catch (b) {
        return;
    }
    if (!a) {
        window.setTimeout(this.getAnimationsLength, 500);
        return;
    }
    console.log("get animations length");
    console.log(c.method("getNumAnimations"));
    this.modelViewer.method("getNumAnimations");
}
NpcModel.prototype.SetModelAnimation = function() {
    //console.log("going to animate an object")
    if (!this.modelViewer) {
        return
    }
    if (!this.modelInfo.animation) {
        return
    }
    var c = this.modelViewer;
    var a = false;
    try {
        a = c.method("isLoaded")
    } catch (b) {
        this.DestroyModel();
        return
    }
    if (!a) {
        window.setTimeout(this.SetModelAnimation, 500);
        return
    }
    c.method("setAnimation", this.modelInfo.animation);
}
NpcModel.prototype.DestroyModel = function() {
    if (this.modelViewer) {
        try {
            this.modelViewer.destroy()
        } catch (a) {}
        delete this.modelViewer
    }
    if (this.containerDiv) {
        this.containerDiv.parentNode.removeChild(NpcModel.containerDiv);
        delete this.containerDiv
    }
}