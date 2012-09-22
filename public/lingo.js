$(function() {
    var words;
    var totalAttempts = 5;
    var totalLetters, attempts, cells, guessedLetters, currentWord, currentGuess;
    var mode;
    var MODE_INIT = 1, MODE_INPUT = 2, MODE_CHECK = 3, MODE_FINISHED = 4, MODE_FINISHED_IMAGE = 5;
    var currentGameConfig;

    var setupWord = function(word) {

        console.log('setupWord', word);

        // reset vars
        currentWord = word;
        totalLetters = word.length;
        attempts = 0;
        cells = [];
        mode = MODE_INIT;

        // update container
        var $container = $('#container');
        $container.empty();

        for (var i=0;i<totalAttempts;i++) {
            var c = [];
            var row = $('<div class="row"></div>');
            for (var l=0;l<totalLetters;l++) {
                var letter = $('<div class="letter">&nbsp;</div>');
                c.push(letter);
                row.append(letter);
            }
            cells.push(c);
            $container.append(row);
        }

        var cellWidth = $('.letter').outerWidth(true);
        $('.row').css('width', cellWidth * totalLetters);

        guessedLetters = word[0].rpad(' ', totalLetters);
        setupAttempt();
    };

    var setupAttempt = function() {
        for(var i=0;i<totalLetters;i++) {
            var c = cells[attempts][i];
            var t = guessedLetters[i];
            if (t == ' ') t = '.';
            c.text(t);

        }
        currentGuess = '';
        waitForInput();
    };

    var waitForInput = function() {
        mode = MODE_INPUT;
        $('input').val('').focus();
    }

    var onLetterClick = function(l) {
        var i = currentGuess.length;
        if (i == totalLetters) return;
        currentGuess += l;
        var c = cells[attempts][i];
        c.text(l);
        c.removeClass('correct');
        //console.log(l);
    }

    var onBackspaceClick = function() {
        var i = currentGuess.length;
        if (i == 0) return;

        i -= 1;
        currentGuess = currentGuess.substring(0, i);
        var c = cells[attempts][i];
        c.html('&nbsp;');
    }

    var onEnterClick = function() {
        if (currentGuess.length != totalLetters) {
            return;
        }

        mode = MODE_CHECK;

        var availableLetters = currentWord.split('');

        var animateLetterCheck = function(i) {

            var char = currentGuess[i];
            var correct = char == currentWord[i];
            var cell = cells[attempts][i];

            var p = availableLetters.indexOf(char);
            if (p >= 0) {
                availableLetters.splice(p, 1);
            }

            if (correct) {
                cell.addClass('correct');
                guessedLetters = guessedLetters.replaceAt(i, char);
                //console.log('"'+guessedLetters+'"', i, currentGuess[i]);
            } else if (p >= 0) {
                cell.addClass('inword');
            }

            if (i == (totalLetters - 1)) {

                if (currentGuess == currentWord) {
                    guessedWord();
                    return;
                }

                attempts++;

                if (attempts >= totalAttempts) {
                    failedWord();
                    return;
                }

                setupAttempt();

            } else {
                window.setTimeout(function() {
                    animateLetterCheck(i+1);
                }, 100);
            }


        }

        animateLetterCheck(0);


    }

    var guessedWord = function() {

        mode = MODE_FINISHED;

    }

    var failedWord = function() {

        for(var r=0;r<(totalAttempts-1);r++) {

            for(var c=0;c<totalLetters;c++) {

                var source = cells[r + 1][c];
                cells[r][c].text(source.text()).attr('class', source.attr('class'));

            }
        }

        for(var c=0;c<totalLetters;c++) {
            cells[totalAttempts-1][c].text(' ').attr('class', 'letter');
        }

        var lastLetterStartDelay = 500;
        var lastLetterDelay = 200;

        var showLastLetter = function(index) {
            cells[totalAttempts-1][index].text(currentWord[index]).attr('class', 'letter correct');
            if (index < (totalLetters -1)) {
                window.setTimeout(function() {
                    showLastLetter(index+1);
                }, lastLetterDelay);
            }
        }
        window.setTimeout(function() {
            showLastLetter(0);
        }, lastLetterStartDelay);

        mode = MODE_FINISHED;
    }

    var showImage = function(url) {
        var $container = $('#container');
        $container.empty();
        var $img = $('<img src="'+url+'" width="1024" height="768" />');
        $container.append($img);
    }

    var endGame = function() {
        if (currentGameConfig.image) {
            showImage(currentGameConfig.image);
            mode = MODE_FINISHED_IMAGE;
        } else {
            nextWord();
        }
    }

    $('input').keyup(function(e) {

        if (mode == MODE_INPUT) {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                var char = String.fromCharCode(e.keyCode)[0].toUpperCase();
                onLetterClick(char);
            } else if (e.keyCode == 8) {
                onBackspaceClick();
            } else if (e.keyCode == 13) {
                onEnterClick();
            } else {
                console.log(e, e.keyCode);
            }
        } else if (mode == MODE_FINISHED) {
            if (e.keyCode == 13) {
                endGame();
            }
        } else if (mode == MODE_FINISHED_IMAGE) {
            if (e.keyCode == 13) {
                nextWord();
            }
        }

        e.preventDefault();
        return false;
    });

    var nextWord = function() {
        if (words.length > 0) {
            currentGameConfig = words.splice(0, 1)[0];
            setupWord(currentGameConfig.word);
        }
    }

    $.get('/words.json', function(config) {
        console.log('words', config);
        words = config;
        nextWord();
    })


});

String.prototype.rpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

String.prototype.replaceAt=function(index, char) {
    return this.substr(0, index) + char + this.substr(index+char.length);
}