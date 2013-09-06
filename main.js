define([
    'jasmine-html'
    ], 
function(jasmine){
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];

//    specs.push('../lib/test/spec/create_scalinggrp');
//    specs.push('../lib/test/spec/create_alarm');
    specs.push('text!../lib/test/spec/selenium/create-volume');

    $(function() {
        $('body').append('<div id="HTMLReporter"><a href="javascript:runTests()">Run tests</a></div>');
    });

    var findLinkByText = function(text) {
        return $('a').filter(function(index) { return $(this).text() === text; }).first();
    }

    runTests = function() {
        $('#HTMLReporter').remove();
        require(specs, function(){
            console.log('ARGS', arguments);
            _.each(arguments, function(spec) {
                if (typeof spec == 'string') {
                    var $spec = $(spec);
                    
                    // locate the title and create a jasmine test
                    var title = $('thead', $spec).text();
                    describe('SELENIUM TEST: ' + title, function() {
                        $('tbody tr', $spec).each(function (i, $s) {
                            var $tds = $('td', $s);
                            var action = $($tds[0]).text();
                            var target = $($tds[1]).text();
                            var parameter = $($tds[2]).text();
                            switch (action) {
                                case 'setTimeout':
                                    it('does setTimeout ' + target, function() {
                                        console.log('SELENIUM+JASMINE:', action, target, parameter);
                                        waits(parseInt(target));
                                    });
                                    break;
                                case 'waitForElementPreset':
                                    it('does waitsForElementPresent ' + target, function() {
                                        waitsFor(function() {
                                            if (/link=/.test(target)) {
                                                console.log('SELENIUM+JASMINE:', action, target, parameter);
                                                return findLinkByText(/link=(.*)/.exec(target)[1]);
                                            } else {
                                                console.log('SELENIUM+JASMINE:(unsupported)', action, target, parameter);
                                                return false;
                                            }
                                        });
                                    });
                                    break;
                                case 'click':
                                    it('does click ' + target, function() {
                                        var link;
                                        waitsFor(function() {
                                            if (/link=/.test(target)) {
                                                console.log('SELENIUM+JASMINE:', action, target, parameter);
                                                link = findLinkByText(/link=(.*)/.exec(target)[1]);
                                                return link;
                                            } else {
                                                console.log('SELENIUM+JASMINE:(unsupported)', action, target, parameter);
                                                return false;
                                            }
                                        });
                                        runs(function() {
                                            link.click();
                                        });
                                    });
                                    break;
                            }
                        });
                    });
                }
            });
            execJasmine();
        });
    }

    function execJasmine() {
        jasmineEnv.execute();
        requireCSS('../lib/test/jasmine.css');

        $('#HTMLReporter').css('position', 'absolute');
        $(document).ready(function() {
            var $dragging = null;

            $(document.body).on("mousemove", function(e) {
                if ($dragging) {
                    $('#HTMLReporter').offset({
                        top: e.pageY - 20,
                        left: e.pageX - 20
                    });
                }
            });

            $(document.body).on("mousedown", "#HTMLReporter", function (e) {
                $dragging = $(e.target);
            });

            $(document.body).on("mouseup", function (e) {
                $dragging = null;
            });
        });
    }

    return jasmineEnv;
});
