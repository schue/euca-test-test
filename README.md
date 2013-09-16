euca-test-test
==============

Experimental Eucalyptus Jasmine test rig

This repo must be checked out as the "lib/test" directory in a checkout of the Eucalyptus console "jasmine" branch.

You will also need to set a localStorage item to activate the system. You can do the following after you have
checked the system out, execute this in the console:

localStorage.setItem('__DO_JASMINE_TESTS__', true);

After reloading you should see a "run tests" link at the bottom of your page.
