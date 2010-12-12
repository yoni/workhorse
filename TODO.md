* Add a test for the socket.io behavior
* VRP solver
* Persist problems and solutions
* Augment problem data structure to have a `status`. Status should support knowing if it has been distributed, if it's queued for distribution, or has been solved.
* Solution 'push' retries on failure.
* Better CouchDB missing db handling.
* CouchDB authentication.

* Rename stuff
** problem -> job
** client -> worker
** browser_client -> web_worker

* Make a diagram

* keys@0.1.2 doesn't work for some reason, giving the following stack trace:
   workhorse.js POST problem: TypeError: Bad argument
    at Memory.set (/usr/local/lib/node/.npm/keys/0.1.2/package/lib/stores/memory.js:43:11)
    at /Users/yoni/Projects/workhorse/lib/problem_registry.js:60:27
    at Memory.has (/usr/local/lib/node/.npm/keys/0.1.2/package/lib/stores/memory.js:81:24)
    at Object.register (/Users/yoni/Projects/workhorse/lib/problem_registry.js:42:19)
    at Object.postProblem (/Users/yoni/Projects/workhorse/workhorse.js:84:18)
    at /Users/yoni/Projects/workhorse/test/workhorse.js:23:19
    at next (/usr/local/lib/node/.npm/expresso/0.7.0/package/bin/expresso:769:25)
    at runSuite (/usr/local/lib/node/.npm/expresso/0.7.0/package/bin/expresso:787:6)
    at check (/usr/local/lib/node/.npm/expresso/0.7.0/package/bin/expresso:648:16)
    at runFile (/usr/local/lib/node/.npm/expresso/0.7.0/package/bin/expresso:652:10)
