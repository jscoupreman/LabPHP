$(function(){
    
    function setAnimation(npcModel, animationType){
        //console.log("test")
        if(!npcModel){
            return;
        }
        
        if(!animationType){
            return;
        }
        npcModel.modelInfo.animation = animationType;
        npcModel.SetModelAnimation();
    }
    
    function setModel(obj, id, div){
        obj.ShowModel(
                div, {
                    "displayId" : id,
                    "humanoid" : true
                }
                );
    }
    
    leftObject = new NpcModel();
    //rightObject = new NpcModel();
    
    /**
     * Pour déterminer le GUID :
     * dans wowhead avec 3D View active :
     * NpcModel.modelInfo.viewerModel.id
     */
    
    
    //setModel(leftObject, 53982, 'model-left');
    setModel(leftObject, 28777, 'model-left');
    //setModel(rightObject, 53983, 'model-right');
    
  /*
    $("#select-animation-left").change(function() {
        setAnimation(leftObject, $(this).val())
    });
  
    $("#select-animation-right").change(function() {
        setAnimation(rightObject, $(this).val())
    });*/
    
    console.log(leftObject.getAnimationsLength());
    //leftObject.modelViewer.method("getNumAnimations")
    /*
    $("#select-animation").find('option').each(function(index, element){
        if(index < 4){
            $("#button-animation-left").append(
                '<input type="button" value="'+element.value+'" id="' + element.value + '"> '
                );
            $("#button-animation-right").append(
                '<input type="button" value="'+element.value+'" id="' + element.value + '"> '
                );
        }
    });*/
    $("#button-animation-left").append('<input type="button" value="Jump" id="Jump"> ');
    $("#button-animation-left").append('<input type="button" value="Walk" id="Walk"> ');
    $("#button-animation-left").append('<input type="button" value="Run" id="Run"> ');
    $("#button-animation-left").append('<input type="button" value="Fall" id="Fall"> ');
    $("#button-animation-left").append('<input type="button" value="JumpLandRun" id="JumpLandRun"> ');
    
    
    $("#button-animation-left").find(":button").click(function(){
        //console.log("click left")
        setAnimation(leftObject, this.id)
        //setAnimation(leftObject, "Stand")
    });
    
    $("#button-animation-right").find(":button").click(function(){
        console.log("click right")
        setAnimation(rightObject, this.id)
    });
    
    
})