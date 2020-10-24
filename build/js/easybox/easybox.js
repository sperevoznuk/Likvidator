'use strict'

var easybox = {
    class: {
        overlay: 'easy-overlay',
        blocked: 'easy-blocked',
        placeholderPrefix: 'easy-placeholder-',
    },
    default: {
        content: '',
        href: '',
    },
    open: function (data) {
        if (typeof (data) == 'string') {
            var htmlInnerEl = document.createElement('div');
            htmlInnerEl.innerHTML = data;
            data = {
                content: htmlInnerEl,
            }
        }

        data = Object.assign(this.default, data);

        if (data.href.substr(0, 1) == '#') {
            var elementId = data.href.substr(1);
            var element = document.getElementById(elementId)
            if (element == null || document.querySelectorAll('.' + this.class.placeholderPrefix + elementId).length) {
                console.log(data.href + ' not found');
                return false;
            }

            var plaseholder = document.createElement('div')
            plaseholder.classList.add(this.class.placeholderPrefix + elementId)
            element.after(plaseholder);
            data.content = element;
        }

        var box = document.createElement('div'),
            content = document.createElement('div'),
            close = document.createElement('div'),
            inner = document.createElement('div');

        content.className = 'easy-content';
        close.className = 'easy-close';
        box.className = 'easy-overlay';
        inner.className = 'easy-inner';


        inner.appendChild(data.content);


        content.appendChild(inner);
        content.appendChild(close);
        box.appendChild(content);

        var body = document.getElementsByTagName('body');
        document.body.appendChild(box);

        close.addEventListener('click', (event) => {
            this._close(event.target.parentNode.parentNode);

        });
        box.addEventListener('click', (event) => {
            if (event.target.className == this.class.overlay) {
                this._close(event.target);
            }
        });
        this.blockPage();
    },
    _close: function (target) {
        var element = target.querySelector('.easy-inner >*');
        var placeholder = document.querySelector('.' + this.class.placeholderPrefix + element.attributes['id'].value);

        placeholder.after(element); 
        placeholder.remove();
        target.remove();
        this.unBlockPage();
    },
    close: function () {
        var popups = document.getElementsByClassName(this.class.overlay);
        for (let index = 0; index < popups.length; index++) {
            this._close(popups[index]);
        }


    },
    blockPage: function () {
        document.body.classList.add(this.class.blocked)
    },
    unBlockPage: function () {
        var body = document.getElementsByTagName('body');
        if (!document.getElementsByClassName(this.class.overlay).length) {
            document.body.classList.remove(this.class.blocked)
        }
    }
}

var elements = document.querySelectorAll('.easybox');

for (let index = 0; index < elements.length; index++) {
    elements[index].addEventListener('click', function () {
        easybox.open({ href: this.attributes['href'].value })
    })
}


// easybox.open({
//     href: '#call'
// })

// easybox.close();

// easybox.open('text')