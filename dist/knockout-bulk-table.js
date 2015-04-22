(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['knockout', 'jquery', 'bootstrap'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('knockout'), require('jquery'), require('bootstrap'));
  } else {
    root.Bulktable = factory(root.ko, root.jQuery, root.jQuery);
  }
}(this, function(ko, $, bootstrap) {
var Bulktable = function(collection, actions, settings) {
    this.collection = collection;
    this.actions = actions;
    this.settings = this.generateSettings(settings);

    this.checked = ko.observableArray();
    this.checkedCollection = this.createCheckedCollectionObservable();
    this.checkedCount = this.createCheckedCountObservable();
    this.masterIsChecked = this.createMasterCheckboxObservable();
    this.showActions = this.createShowActionsObservable();
    this.showActionsMenu = ko.observable(false);
}

Bulktable.DEFAULTS = {
    actionsTemplate: "<div style='position:relative;'>" + 
                        "<input type='checkbox' data-bind='checked: masterIsChecked' " +
                            "style='position:absolute;z-index:1;top:1px;'>" + 
                        "<div class='dropdown' data-bind=\"css: {'open': showActionsMenu() === true}, " + 
                            "style: {display: showActions() === true ? 'block' : 'none'}\" " + 
                            "style='position:absolute;left:-8px;top:-4px;z-index:0;'>" +
                          "<button class='btn btn-default btn-sm' style='padding-left:25px' data-bind='click: toggleActionsMenu'>" +
                            "<span class='bulk-actions-label'></span>" +
                          "</button>" +
                          "<ul class='dropdown-menu' data-bind='foreach: actions'>" +
                            "<li><a href='javascript:;' data-bind='click: $parent.click.bind(this, click), html: label'></a></li>" +
                          "</ul>" +
                        "</div>" +
                    "</div>",
    checkProperty: 'id',
    label: "item(s) selected <span class='caret'></span>",
    showCheckedCountInLabel: true
}

Bulktable.prototype.createCheckedCollectionObservable = function createCheckedCollectionObservable() {
    var self = this;
    return ko.computed(function(){
        var collection = self.collection();
        var checked = self.checked();

        return ko.utils.arrayFilter(collection, function(item){
            return ko.utils.arrayIndexOf(checked, ko.unwrap(item[self.settings.checkProperty])) !== -1;
        });
    }, this);
}

Bulktable.prototype.createCheckedCountObservable = function createCheckedCountObservable() {
    return ko.computed(function(){
        return this.checked().length;
    }, this);
}

Bulktable.prototype.createMasterCheckboxObservable = function createMasterCheckboxObservable() {
    return ko.computed({
        read: function() {
            return this.checked().length === this.collection().length;
        },
        write: function(value) {
            this.checked([]);
            if (value === true) {
                var self = this;
                ko.utils.arrayForEach(this.collection(), function(item) {
                    self.checked.push(ko.unwrap(item[self.settings.checkProperty]));
                });
            }
        },
        owner: this
    });
}

Bulktable.prototype.createShowActionsObservable = function createShowActionsObservable() {
    return ko.computed(function(){
        return this.checked().length > 0;
    }, this);
}

Bulktable.prototype.generateSettings = function generateSettings(settings) {
    return $.extend({}, Bulktable.DEFAULTS, settings);
}

ko.bindingHandlers.bulkActions = {init: function(element, valueAccessor, allBindings){
    var column = $(element);
    var instance = valueAccessor();
    var actions = $(instance.settings.actionsTemplate);

    var actionsButtonLabel = actions.find(".bulk-actions-label");
    var label = "";
    if (instance.settings.showCheckedCountInLabel === true) {
        label += "<span data-bind='text: checkedCount'></span> ";
    }
    label += instance.settings.label;
    actionsButtonLabel.html(label);

    // Th are as default often set as vertical-align bottom
    // which will fuck up the positioning of the checkbox
    column.css("vertical-align", "top");

    actions.appendTo(column);

    var toggleActionsMenu = function(){
        instance.showActionsMenu(!instance.showActionsMenu());
        // returning true will make sure the checkbox event click
        // is successfully executed.
        return true;
    }

    ko.applyBindings({
        actions: instance.actions,
        click: function(action) {
            var success = function() {
                // Remove the actions menu
                toggleActionsMenu();
                // Deselect all the checkboxes
                instance.masterIsChecked(false);
            }
            action.call(this, instance.checkedCollection, success);
        },
        checkedCount: instance.checkedCount,
        showActions: instance.showActions,
        showActionsMenu: instance.showActionsMenu,
        masterIsChecked: instance.masterIsChecked,
        toggleActionsMenu: toggleActionsMenu
    }, actions[0]);

    return { controlsDescendantBindings: true };
}}
return Bulktable;
}));
