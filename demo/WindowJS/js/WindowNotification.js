var WindowJS_NotificationArea = null;

$.widget('exanis.windowjs_notification', {
    options: {
        sortable: true,
        containerClass: [],
        notificationAreaClass: ['nav', 'navbar-nav'],
        notificationHighlightClass: [],
        activeClass: ['active'],
        inactiveClass: []
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

    _notificationWrapper: function (count) {
        var className;

        if (count > 0)
            for (className of this.widget.options.notificationHighlightClass)
        this.iconHolder.addClass(className);
        else
        for (className of this.widget.options.notificationHighlightClass)
        this.iconHolder.removeClass(className);
    },

    _onIconClick: function () {
        var className;

        if (this.window.win().is(':visible')) {
            this.window.win().hide();
            this.window._trigger('Minimize');
            for (className of this.notification.options.inactiveClass)
                this.holder.addClass(className);
            for (className of this.notification.options.activeClass)
                this.holder.removeClass(className);
        } else {
            this.window.win().show();
            this.window._trigger('Maximize');
            for (className of this.notification.options.inactiveClass)
                this.holder.removeClass(className);
            for (className of this.notification.options.activeClass)
                this.holder.addClass(className);
        }
    },

    _createIconHolder: function (icon, window) {
        var iconLink = $('<a />');
        var iconHolder = $('<i />');
        var className;

        for (className of window.getIconClass())
            iconHolder.addClass(className);
        iconHolder.appendTo(iconLink);
        iconLink.appendTo(icon);
        return iconHolder;
    },

    addWindow: function (window) {
        var icon = $('<li />');
        var iconHolder = this._createIconHolder(icon, window);
        var className;

        window.setNotificationWrapper(this._notificationWrapper.bind({
            widget: this,
            iconHolder: iconHolder
        }));
        icon.click(this._onIconClick.bind({
            window: window,
            holder: icon,
            notification: this
        }));

        for (className of this.options.activeClass)
            icon.addClass(className);
        icon.appendTo(this._notificationArea);
        return icon;
    }
});