var WindowJS_NotificationArea = null;

$.widget('exanis.windowjs_notification', {
    options: {
        sortable: true,
        containerClass: [],
        notificationAreaClass: [],
        notificationHighlightClass: []
    },

    _container: null,
    _notificationArea: null,

    _checkSingleton: function () {
        if (WindowJS_NotificationArea !== null) {
            window.console.error("Only one instance of NotificationArea can be used at a given time");
            return false;
        }
        WindowJS_NotificationArea = this;
        return true;
    },

    _enableSortable: function () {
        this._notificationArea.sortable();
        this._notificationArea.disableSelection();
    },

    _prepareContainerClass: function () {
        var className;

        this._container = this.element;
        for (className of this.options.containerClass)
            this._container.addClass(className);
    },

    _createNotificationArea: function () {
        var className;

        this._notificationArea = $('<ul />');
        for (className of this.options.notificationAreaClass)
            this._notificationArea.addClass(className);
        this._notificationArea.appendTo(this._container);
    },

    _create: function () {
        if (this._checkSingleton())
        {
            this._prepareContainerClass();
            this._createNotificationArea();
            if (this.options.sortable)
                this._enableSortable();
        }
    },

    minimize: function (window) {
        var icon = $('<li />');
        var iconHolder = $('<i />');
        var className;

        for (className of window.getIconClass())
            iconHolder.addClass(className);
        window.setNotificationWrapper(function (count) {
            var className;

            if (count > 0)
                for (className of this.widget.options.notificationHighlightClass)
                    this.iconHolder.addClass(className);
            else
                for (className of this.widget.options.notificationHighlightClass)
                    this.iconHolder.removeClass(className);
        }.bind({
            widget: this,
            iconHolder: iconHolder
        }));
        icon.click(function () {
            this.window.win().show();
            this.window._trigger('Maximize');
            this.holder.remove();
        }.bind({
            window: window,
            holder: icon
        }));
        iconHolder.appendTo(icon);
        icon.appendTo(this._container);
        window.win().hide();
    }
});