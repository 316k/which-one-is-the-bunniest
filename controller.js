function rand(min_rand, max_rand) {
    return parseInt(min_rand + (Math.random()*10 % (max_rand - min_rand)));
}

$(document).ready(function() {
    new Controller();
});

function Controller() {
    var self = this;

    this.view = new View();

    this.level = 0;
    this.score = 0;
    this.right_image; // 0 or 1

    $('img[data-ordre]').click(function() {
        if(!self.waiting) {
            self.pick($(this).data('ordre'));
        }
    });

    $('#question span').click(function() {
        if(self.waiting) {
            self.yup();
        } else {
            self.view.dismiss();
        }
    });

    $('#play').click(function() {
        self.begin_game();
    });

    setTimeout(function() {
        self.view.say("Hi there ! Would you like to play my game ?");
    }, 2000);
}

Controller.prototype.begin_game = function() {
    this.view.play();
    this.ask_question();
};

Controller.prototype.ask_question = function() {
    var self = this;
    this.view.say(Questions[this.level].question);

    if('trick_question' in Questions[this.level]) {
        $('.' + Questions[this.level].right_element).click(function() {
            self.pick(this);
        });
    }

    // Refresh images
    this.right_image = Math.random() < 0.5 ? 0 : 1;
    this.view.refresh_images(this.right_image, Questions[this.level].wrong_image, this.level);
};

Controller.prototype.pick = function(image) {
    var right = image === this.right_image;

    // Handle trick questions
    if('trick_question' in Questions[this.level]) {
        right = $(image).hasClass(Questions[this.level].right_element);
        $('.' + Questions[this.level].right_element).unbind('click');
    }

    // Handle impossible questions
    right = right && !Questions[this.level].force_loose;

    if(right) {
        this.score++;

        this.view.say(Questions[this.level].answers.right);
    } else {
        this.view.say(Questions[this.level].answers.wrong);
    }

    this.view.refresh_score(this.score, this.level);

    this.waiting = true;

    $('#question span').text('[Next question !]');

    this.next_level();
};

Controller.prototype.next_level = function() {
    if(this.waiting) {
        var self = this;
        setTimeout(function() {
            self.next_level();
        }, 50);
    } else {
        if(!this.over()) {
            this.level++;
            this.ask_question();
        } else {
            this.view.say("No more questions, the game is over ! You lost and I won !");
            $('img[data-ordre]').unbind('click');
            $('#question span').text('[Play Again !]').unbind('click').click(function() {
                window.location.reload();
            });
        }
    }
};

Controller.prototype.over = function() {
    return this.level == Questions.length - 1;
};

Controller.prototype.yup = function() {
    this.waiting = false;
    $('#question span').text('[Hide]');
};
