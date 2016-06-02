$.widget("exanis.windowjs", {
    options: {
        container: null,
        content: 'SimplePage.html',
        update: -1,
        draggable: true,
        resizable: true,
        closable: true,
        minimizable: true,
        notifiable: true,
        titleBar: true,
        title: 'My Window',
        loadingText: '<img src="WindowJS/img/spinner.svg" title="Loading..." />',
        grid: 20,
        snap: true,
        toggleEffect: 'puff',
        closeButton: '[Close]',
        minButton: '[Min]',
        windowClass: ['panel', 'panel-default', 'clearfix', 'windowJSWindow'],
        titleBarClass: ['panel-heading'],
        titleClass: ['panel-title', 'windowJSTitle'],
        buttonClass: ['windowJSButton'],
        iconClass: ['glyphicon', 'glyphicon-inbox'],
        contentClass: ['panel-body', 'WindowJSContent', 'clearfix'],
        notificationClass: ['badge'],
        notificationHighlightClass: [],
        highlightClass: [],
        activeClass: [],
        minHeight: 100,
        minWidth: 300
    },

    _window: null,
    _titleBar: null,
    _title: null,
    _content: null,
    _icon: null,
    _notification: null,
    _titleWrapper: null,

    _iconNotificationWrapper: null,

    _notificationCount: 0,

    _prepareContent: function () {
        var className;

        this._content = this.element;
        for (className of this.options.contentClass)
            this._content.addClass(className);

        this._content.height(this.options.minHeight).width(this.options.minWidth);
    },

    _createWindow: function () {
        var className;

        this._window = $("<div />").appendTo(this.options.container);
        for (className of this.options.windowClass)
            this._window.addClass(className);
    },

    _enableDrag: function () {
        this._window.draggable({
            handle: this._titleBar,
            start: function () { this._onMoveStart();}.bind(this),
            drag: function () { this._onMoveDrag();}.bind(this),
            stop: function () { this._onMoveEnd();}.bind(this),
            snap: this.options.snap,
            grid: [this.options.grid, this.options.grid]
        });
    },

    _createMinButton: function () {
        var className;
        var minButton = $('<p />');

        minButton.click(function () { this._onMinimize();}.bind(this));
        minButton.html(this.options.minButton);
        for (className of this.options.buttonClass)
            minButton.addClass(className);
        minButton.appendTo(this._titleBar);
    },

    _createCloseButton: function () {
        var className;
        var closeButton = $('<p />');

        closeButton.click(function () { this._onClose();}.bind(this));
        closeButton.html(this.options.closeButton);
        for (className of this.options.buttonClass)
            closeButton.addClass(className);
        closeButton.appendTo(this._titleBar);
    },

    _createNotification: function () {
        var className;
        this._notification = $('<span />');

        for (className of this.options.notificationClass)
            this._notification.addClass(className);
        this._notification.appendTo(this._titleWrapper);
        this._updateNotification();
    },

    _createTitle: function () {
        this._title = $('<span />').html(this.options.title).appendTo(this._titleWrapper);

        for (className of this.options.titleClass)
            this._titleWrapper.addClass(className);
    },

    _createTitleWrapper: function () {
        this._titleWrapper = $('<h3 />');
        this._titleWrapper.appendTo(this._titleBar);
    },

    _createTitleBar: function () {
        var className;

        this._titleBar = $('<div />').appendTo(this._window);
        for (className of this.options.titleBarClass)
            this._titleBar.addClass(className);

        if (this.options.draggable)
            this._enableDrag();

        if (this.options.closable)
            this._createCloseButton();

        if (this.options.minimizable)
            this._createMinButton();

        this._createTitleWrapper();

        if (this.options.notifiable)
            this._createNotification();

        this._createTitle();
    },

    _resizeEnabled: false,

    _enableResize: function () {
        this._content.resizable({
            grid: this.options.grid,
            start: function () { this._onResizeStart();}.bind(this),
            resize: function () { this._onResize();}.bind(this),
            end: function () { this._onResizeEnd();}.bind(this),
            minHeight: this.options.minHeight,
            minWidth: this.options.minWidth
        });
    },

    _createIcon: function () {
        if (WindowJS_NotificationArea !== null)
            this._icon = WindowJS_NotificationArea.addWindow(this);
    },

    _create: function () {
        if (this.options.container === null)
            this.options.container = $('body');

        this._prepareContent();
        this._createWindow();
        if (this.options.titleBar)
            this._createTitleBar();
        this._createIcon();

        this._content.appendTo(this._window);
        this.update();
    },

    _setOption: function (key, value) {
        this.options[key] = value;
        if (key == 'content') {
            this.update();
        } else if (key == 'title') {
            if (this._title)
                this._title.html(this.options[key]);
        } else if (key != 'loadingText' && key != 'update')
            window.console.error(key + " cannot be modified after window creation.");
    },

    update: function () {
        if (this._window !== null) {
            this._content.html(this.options.loadingText);
            this._content.load(this.options.content, function () { this._onLoaded();}.bind(this));
        }
    },

    _onLoaded: function () {
        if (this._trigger("loaded") && this.options.update > 0)
            setTimeout(function () { this.update();}.bind(this), this.options.update);

        if (this.options.resizable)
            this._enableResize();
    },

    _onMoveStart: function () {
        this._trigger("MoveStart");
    },

    _onMoveDrag: function () {
        this._trigger("MoveDrag");
    },

    _onMoveEnd: function () {
        this._trigger("MoveEnd");
    },

    _onResizeStart: function () {
        this._trigger("ResizeStart");
    },

    _onResize: function () {
        this._trigger("Resize")
    },

    _onResizeEnd: function () {
        this._trigger("ResizeEnd");
    },

    _onClose: function () {
        if (this._trigger("Close")) {
            if (this.options.toggleEffect !== null)
                this._window.toggle(this.toggleEffect, function () {
                    this._window.remove();
                    this._window = null;
                }.bind(this));
            else {
                this._window.remove();
                this._window = null;
            }
        }
    },

    _onMinimize: function () {
        if (this._icon !== null)
            this._icon.trigger('click');
    },

    win: function () {
        return this._window;
    },

    titleBar: function () {
        return this._titleBar;
    },

    title: function () {
        return this._title;
    },

    content: function () {
        return this._content;
    },

    icon: function () {
        return this._icon;
    },

    notification: function () {
        return this._notification;
    },

    _updateNotification: function () {
        var className;

        this._notification.text(this._notificationCount);
        if (this._notificationCount > 0) {
            for (className of this.options.notificationHighlightClass)
                this._notification.addClass(className);
        } else
            for (className of this.options.notificationHighlightClass)
                this._notification.removeClass(className);
        if (this._iconNotificationWrapper)
            this._iconNotificationWrapper(this._notificationCount);
    },

    notify: function () {
        this.setNotification(this._notificationCount + 1);
    },

    setNotification: function (count) {
        this._notificationCount = count;
        this._updateNotification();
    },

    activate: function () {
        var className;

        if (this._titleBar)
            for (className of this.options.activeClass)
                this._titleBar.addClass(className);
    },

    desactivate: function () {
        var className;

        if (this._titleBar)
            for (className of this.options.activeClass)
                this._titleBar.removeClass(className);
    },

    highlight: function (time) {
        var className;
        if (this._titleBar)
            for (className of this.options.highlightClass)
                this._titleBar.addClass(className);

        if (time !== undefined)
            setTimeout(function () { this.unhighlight();}.bind(this), time);
    },

    unhighlight: function () {
        var className;
        if (this._titleBar)
            for (className of this.options.highlightClass)
                this._titleBar.removeClass(className);
    },

    getIconClass: function () {
        return this.options.iconClass;
    },

    setNotificationWrapper: function (wrapper) {
        this._iconNotificationWrapper = wrapper;
    },

    getNotificationsCount: function () {
        return this._notificationCount;
    }
});