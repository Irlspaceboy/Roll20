//!magic --[[1d5]] rounds --desc --ammo
on("chat:message", function (msg_orig) {
    var msg = _.clone(msg_orig);
    if (msg.type != "api") return;
    if(_.has(msg,'inlinerolls')){
        msg.content = MakeRollNum(msg.content, msg.inlinerolls);
    }
    var msgTxt = msg.content;
    var command = msg.content.split(" ", 1);
    if (command == "!cast") {
        var cWho = findObjs({_type: 'character',name: msg.who})[0];
        if (cWho == undefined && msg.who != "GM (GM)") {
            cWho = RollRight(msg.playerid);
            msg.who = cWho.get("name");
        }
        var who = msg.who;
        var msgFormula = msgTxt.split(" --");
        //-----------------------------
        //AMMO PARTS----------------
        //-----------------------------
        cAmmo ="0";
        mAmmo ="0";
        if (msgFormula[6] !== undefined) {
            var ammoF = msgFormula[6].split(" ");
            var ammoCount = ammoF[0];
            var ammoType = ammoF[1];
            if (cWho !== undefined) {
                var ammo0 = findObjs({_type: "attribute",name: ammoType,_characterid: cWho.id}, {caseInsensitive: true})[0];
            }
            if (ammo0 == undefined){
                sendChat(who, '/direct <b> '+msg.who+' set cost type!');
                return;
            }
            else {
                cAmmo = parseInt(ammo0.get("current") - ammoCount);
                cAmmo1 = parseInt(ammo0.get("current"));
                mAmmo = parseInt(ammo0.get("max"));
                var per = (cAmmo/mAmmo)*100;
                var ammoT = '<div style="border: 2px solid #333; background-color: black; border-radius: 13px; padding: 3px; margin: 1px;"><div style="background-color: orange; width: '+per+'%; height: 3px; border-radius: 10px;"></div></div>';
                if (cAmmo1 < ammoCount) {
                    sendChat(who, '/direct <b> '+msgFormula[1].toUpperCase()+': not enough points!');
                    return;
                }
                SetStat(cWho,ammoType,ammoCount);
            }
        }
        var bColor = "";
        var ammoF = msgFormula[6].split(" ");
        var ammoType = ammoF[1];
        if (ammoType == "PPE") {
            bColor = "#C8CFE6"
        }
        else {
            bColor = "#D1C8E6";
        }
        var rollresult = 0;
        var name = msgFormula[1].toUpperCase();
        var range = "<b>Range: </b>" + msgFormula[2];
        var dam = "<b><br>Damage: </b><span style='color:#ff0000'>" + msgFormula[3] + "</span>";
        var dur = "<b><br>Duration: </b><span style='color:#ff0000'>" + msgFormula[4] + "</span>";
        var cost =  "<b><br>Cost: </b>" + msgFormula[6];
        var desc = "<br><b>Desc: " + msgFormula[5];
        var boxcolor =  "#545454";
        pad = "2px;";
        var PlayerBGColor = getObj("player", msg.playerid).get("color");
        var toptext = brPart + "background-color:" + PlayerBGColor + ";'>" + msg.who +" used:</div>";
        weburl = "http:\\//fc05.deviantart.net/fs70/f/2014/189/4/5/magic___free_texture_by_camy_orca-d7pro4i.jpg";
        var SayParts = "<div style='line-height: 9px; text-shadow: "+tshadow+"; margin:0.0em; font-size: 9pt; display:inline-block; text-align: center; vertical-align:middle; padding: 0px 6px 0px 6px; border: 1px solid #000; border-radius: 3px; color: #FFF; background-image: url("+weburl+");'><b>●"+ name +"●</b></div>";
        var top = "<div style=' box-shadow: "+bShadow+"; text-shadow: -1px -1px #000, 1px -1px #000, -1px 1px #000, 2px 2px #000; font-family: "+font+"; text-align: center; vertical-align: middle; padding: 2px 2px; margin-top: 0.2em; border: 1px solid #000; border-radius: 10px 10px 0px 0px; color: #FFFFFF; background-color:" + boxcolor + ";'><b>"+toptext+"</b></div>";
        var Main = "<div style='box-shadow: "+bShadow+"; text-shadow: 1px 1px #878787; font-family: "+ font + "; font-size: small; vertical-align: middle; padding: 1px; border-left: 1px solid #000; border-right: 1px solid #000; border-radius: 0px; background-color:"+bColor+"; color: #000;'><i>"+SayParts+"<br>" + range+dam+dur+cost+desc + "</div>";
        var End = "<div style='box-shadow: "+bShadow+"; text-shadow: -1px -1px #000, 1px -1px #000, -1px 1px #000, 2px 2px #000; font-family: "+font+"; font-size: 12px ;text-align: center; padding: "+pad+" vertical-align: middle; border: 1px solid #000; border-radius: 0px 0px 5px 5px; color: #FFFFFF; background-color:#545454;'><b>"+cAmmo + " of " + mAmmo  +  " left"+ammoT+"</div>";
        if (who == "NPC") {
            var PlayerBGColor = getObj("player", msg.playerid).get("color");
            var toptext = brPart + "padding: 10px; background-color:" + PlayerBGColor + ";'><b>" + msg.who +" used a Power!</b></div>";
            sendChat(who, toptext);
            sendChat('BlindRoll', "/w GM " + top + Main + End);
            return;
        }
        else sendChat(who, '' + top + Main + End);
    }
});