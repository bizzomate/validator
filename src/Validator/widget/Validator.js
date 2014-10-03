dojo.provide("Validator.widget.Validator");
dojo.declare("Validator.widget.Validator", mxui.widget._WidgetBase, {
    _hasStarted     : false, 
    field           : null,
    fieldNode       : null,
    initialValue    : null,

    startup : function() {
        if (this._hasStarted) {
            return;
        }

        var divfield = dojo.query('.' + this.classString)[0],
            fieldid = dojo.attr(divfield, "id");
        
        this.field = dijit.byId(fieldid);
        
        dojo.setAttr(this.domNode.id, "tabIndex", -1);

        this.connect(this.field, "update", function (e) {
            this.domNodeField = this.field.domNode.lastChild;
            
            if( this.domNodeField.className == "mx-referenceselector-input-wrapper"){
                 this.domNodeField =  this.domNodeField.lastChild;
            }
            
            if (this.domNodeField.className == "mx-dateinput"){
                this.domNodeField =  this.domNodeField.lastChild.lastChild;
                this.connect(this.domNodeField, "onblur", this.isValid2);
            }
            else {
                this.connect(this.domNodeField, "onchange", this.isValid2);
            }
            
            if (this.domNodeField != null && this.domNodeField != undefined){
                this.connect(this.domNodeField, "onkeyup", function(e) {
                    if(e.keyCode == 13){ // if someone presses Enter
                        this.isValid2();
                    }
                })
            }
        });
        

        this._hasStarted = true;
    }, 

    isValid2 : function () {
        
        
        var currvalue = '';
        
        if(this.domNodeField.nodeName == "SELECT"){
            currvalue  = this.domNodeField.options[this.domNodeField.selectedIndex].text;
        }
        else
            currvalue = this.domNodeField.value;
        
        
        var regex = new RegExp(this.regexStr, this.regexFlags),
            matched = regex.test(currvalue);

        this.showImage(matched);
        return matched;
    },


    showImage : function (matched) {
        dojo.empty(this.domNode);
        var url = "";
        if(matched){
            url = this.trueImg;
            this.removeMessage();
        } else {
            url = this.falseImg;
            this.addMessage();
        }

        var node = mxui.dom.create("img", { 
                "src"   : url, 
                "class" : this.id + "-validator-image" 
            });


        this.domNode.appendChild(node);
    },

    addMessage : function () {
        if (dojo.byId(this.id + '-invalid') !== null){
            this.removeMessage();
        }
        var invalidStr = "<div id='" + this.id + "-invalid' class='alert alert-danger'>" + this.errorMsg + "</div>"
        dojo.place(invalidStr, this.field.domNode, "after");
        dojo.addClass(this.field.domNode, "danger");
    },

    removeMessage : function () {
        dojo.destroy(this.id + '-invalid');
        dojo.removeClass(this.field.domNode, "danger");
    },

   
});