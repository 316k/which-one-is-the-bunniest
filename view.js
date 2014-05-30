function View() {
    $('img[data-ordre]').hide();
    $('#play').hide().delay(4000).fadeIn('slow');
    $('header').animate({
        left: '10%',
        paddingTop: '0',
    }, 1500);

    this.header_rotation = 3;
    this.rotate_header();
}

View.prototype.rotate_header = function() {
    if(this.header_rotation < 723) {
        this.header_rotation += 10;

        $('header').css({
            transform: 'rotate(' + this.header_rotation + 'deg)',
        });

        var self = this;
        setTimeout(function() {
            self.rotate_header();
        }, 10);
    }
}

View.prototype.say = function(text) {
    $('#question').clearQueue();

    $('#question p').text(text);

    if(text.length > 92) {
        $('#question p').addClass('long-text');
    } else {
        $('#question p').removeClass('long-text');
    }

    $('#question').animate({
        opacity: 0.9,
        bottom: "0px"
    }, 700);
};

View.prototype.refresh_score = function(score, level) {
    $('.score').text(score + '/' + ++level);
};

View.prototype.refresh_images = function(right, image, level) {
    if(image instanceof Array) {
        // That must be a trick question, both images are wrong
        $('img[data-ordre]').each(function(i) {
            $(this).attr('src', 'img/' + image[i] + '.png').css({
                transform: "scaleX(" + (level % 2 ? '-' : '') + "1)",
            });
        });
    } else {
        var wrong = right ? 0 : 1;

        $('img[data-ordre=' + wrong + ']').attr('src', 'img/' + image + '.png').css({
            transform: "scaleX(" + (level % 2 ? '-' : '') + "1)",
        });
        $('img[data-ordre=' + right + ']').attr('src', 'img/bunny.png').css({
            transform: "scaleX(" + (level % 2 ? '-' : '') + "1)",
        });
    }
};

View.prototype.dismiss = function(text) {
    $('#question').animate({
        opacity: 0.4,
        bottom: "-25%",
    }, 700);
};

View.prototype.play = function() {
    $('img[data-ordre]').fadeIn();
    $('#play').fadeOut();
    $('#question span').text('[Hide]');
};
