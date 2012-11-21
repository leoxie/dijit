define([
	"dojo/_base/declare", // declare
	"dojo/dom", // dom.setSelectable
	"dojo/_base/event", // event.stop
	"../registry"		// registry.byNode
], function(declare, dom, event, registry){

// module:
//		dijit/form/_ButtonMixin

return declare("dijit.form._ButtonMixin", null, {
	// summary:
	//		A mixin to add a thin standard API wrapper to a normal HTML button
	// description:
	//		A label should always be specified (through innerHTML) or the label attribute.
	//
	//		Attach points:
	//
	//		- focusNode (required): this node receives focus
	//		- valueNode (optional): this node's value gets submitted with FORM elements
	//		- containerNode (optional): this node gets the innerHTML assignment for label
	// example:
	// |	<button data-dojo-type="dijit/form/Button" onClick="...">Hello world</button>
	// example:
	// |	var button1 = new Button({label: "hello world", onClick: foo});
	// |	dojo.body().appendChild(button1.domNode);

	// label: HTML String
	//		Content to display in button.
	label: "",

	// type: [const] String
	//		Type of button (submit, reset, button, checkbox, radio)
	type: "button",

	__onClick: function(/*Event*/ e){
		// summary:
		//		Internal function to divert the real click onto the hidden INPUT that has a native default action associated with it
		// type:
		//		private
		event.stop(e);
		if(!this.disabled){
			this.defer(function(){ // let this event finish before starting another so IE isn't confused
				// cannot use on.emit since button default actions won't occur
				this.valueNode.click(e);
			});
		}
		return false;
	},

	_onClick: function(/*Event*/ e){
		// summary:
		//		Internal function to handle click actions
		if(this.disabled){
			event.stop(e);
			return false;
		}
		if(this.onClick(e) === false){
			e.preventDefault();
		}
		cancelled = e.defaultPrevented;

		// Signal Form/Dialog to submit/close.  For 2.0, consider removing this code and instead making the Form/Dialog
		// listen for bubbled click events where evt.target.type == "submit" && !evt.defaultPrevented.
		if(!cancelled && this.type == "submit" && !(this.valueNode||this.focusNode).form){
			for(var node=this.domNode; node.parentNode; node=node.parentNode){
				var widget=registry.byNode(node);
				if(widget && typeof widget._onSubmit == "function"){
					widget._onSubmit(e);
					e.preventDefault(); // action has already occurred
					cancelled = true;
					break;
				}
			}
		}

		return !cancelled;
	},

	postCreate: function(){
		this.inherited(arguments);
		dom.setSelectable(this.focusNode, false);
	},

	onClick: function(/*Event*/ /*===== e =====*/){
		// summary:
		//		Callback for when button is clicked.
		//		If type="submit", return true to perform submit, or false to cancel it.
		// type:
		//		callback
		return true;		// Boolean
	},

	_setLabelAttr: function(/*String*/ content){
		// summary:
		//		Hook for set('label', ...) to work.
		// description:
		//		Set the label (text) of the button; takes an HTML string.
		this._set("label", content);
		var labelNode = this.containerNode || this.focusNode;
		labelNode.innerHTML = content;
		if(this.textDir){
			this.applyTextDir(labelNode);
		}
	}
});

});
