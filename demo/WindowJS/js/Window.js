$.widget("exanis.windowjs", {
    options: {
        container: null,
        content: 'SimplePage.html',
        update: -1,
        draggable: true,
        resizable: true,
        closable: true,
        titleBar: true,
        title: 'My Window',
        loadingText: '<img src="WindowJS/img/spinner.svg" title="Loading..." />',
        grid: 50,
        snap: true,
        toggleEffect: 'puff',
        closeButton: '[Close]',
        windowClass: 'ui-widget',
        headerClass: 'ui-widget-header',
        contentClass: 'ui-widget-content'
    },

    _window: null,
    _titleBar: null,
    _title: null,
    _content: null,

    _create: function () {
        if (this.options.container === null)
            this.options.container = $('body');

        this._content = this.element;
        this._content.addClass(this.options.contentClass);
        this._window = $("<div />").addClass(this.options.windowClass).appendTo(this.options.container);
        if (this.options.titleBar)
        {
            this._titleBar = $('<div />').addClass(this.options.headerClass).appendTo(this._window);

            if (this.options.draggable)
                this._window.draggable({
                    handle: this._titleBar,
                    start: function () { this._onMoveStart();}.bind(this),
                    drag: function () { this._onMoveDrag();}.bind(this),
                    stop: function () { this._onMoveEnd();}.bind(this),
                    snap: this.options.snap,
                    grid: [this.options.grid, this.options.grid]
                });

            if (this.options.closable)
            {
                var closeButton = $('<p />');
                closeButton.click(function () { this._onClose();}.bind(this));
                closeButton.html(this.options.closeButton).css('float', 'right');
                closeButton.appendTo(this._titleBar);
            }
            this._title = $('<h3 />').html(this.options.title).appendTo(this._titleBar);
        }

        if (this.options.resizable)
            this._window.resizable({
                containment: this.options.container,
                grid: this.options.grid,
                start: function () { this._onResizeStart();}.bind(this),
                resize: function () { this._onResize();}.bind(this),
                end: function () { this._onResizeEnd();}.bind(this)
            })
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
            window.console.error(key + " cannot be modified after window create.");
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

    window: function () {
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
    }
});